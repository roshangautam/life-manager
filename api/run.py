"""
Life Manager API - Combined FastAPI and gRPC Server

This module provides functionality to run both FastAPI and gRPC servers
concurrently using asyncio.
"""

import asyncio
import logging
import signal
import sys
from concurrent import futures
from typing import Any, List, Optional

import grpc
import uvicorn
from fastapi import FastAPI
from grpc_health.v1 import health as health_servicer
from grpc_health.v1 import health_pb2, health_pb2_grpc
from grpc_reflection.v1alpha import reflection

from .config import settings
from .grpc_interceptors import create_grpc_interceptors

logger = logging.getLogger(__name__)


class ServerManager:
    """Manages both FastAPI and gRPC servers."""

    def __init__(
        self,
        app: FastAPI,
        grpc_servers: Optional[List[grpc.Server]] = None,
        host: str = "0.0.0.0",
        http_port: int = 8000,
        grpc_port: int = 50051,
        max_workers: int = 10,
    ):
        """Initialize the server manager.

        Args:
            app: FastAPI application instance.
            grpc_servers: List of gRPC servers to manage.
            host: Host to bind the servers to.
            http_port: Port for the HTTP server.
            grpc_port: Port for the gRPC server.
            max_workers: Maximum number of worker threads for gRPC server.
        """
        self.app = app
        self.grpc_servers = grpc_servers or []
        self.host = host
        self.http_port = http_port
        self.grpc_port = grpc_port
        self.max_workers = max_workers
        self._shutdown_event = asyncio.Event()

        # Configure logging
        self._configure_logging()

    def _configure_logging(self) -> None:
        """Configure logging for the application."""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[
                logging.StreamHandler(sys.stdout),
            ],
        )

    async def start_http_server(self) -> None:
        """Start the FastAPI HTTP server."""
        config = uvicorn.Config(
            app=self.app,
            host=self.host,
            port=self.http_port,
            log_level=logging.INFO,
            workers=1,  # We'll handle concurrency with gRPC
        )

        server = uvicorn.Server(config)

        # Register signal handlers
        for sig in (signal.SIGINT, signal.SIGTERM):
            signal.signal(sig, self._handle_shutdown)

        logger.info(f"Starting HTTP server on {self.host}:{self.http_port}")
        await server.serve()

    async def start_grpc_server(self) -> None:
        """Start the gRPC server."""
        if not self.grpc_servers:
            logger.warning("No gRPC servers configured")
            return

        # Start each gRPC server
        for i, server in enumerate(self.grpc_servers):
            port = self.grpc_port + i  # Use different ports for multiple servers
            server.add_insecure_port(f"{self.host}:{port}")

            # Add health check service
            health_servicer_instance = health_servicer.HealthServicer()
            health_pb2_grpc.add_HealthServicer_to_server(
                health_servicer_instance, server
            )

            # Add reflection service
            SERVICE_NAMES = (
                health_pb2.DESCRIPTOR.services_by_name["Health"].full_name,
                reflection.SERVICE_NAME,
            )
            reflection.enable_server_reflection(SERVICE_NAMES, server)

            # Start the server
            logger.info(f"Starting gRPC server {i+1} on {self.host}:{port}")
            server.start()

        # Wait for shutdown
        await self._shutdown_event.wait()

        # Graceful shutdown
        for server in self.grpc_servers:
            await server.stop(5)  # 5 second grace period

    def _handle_shutdown(self, signum: int, frame: Any) -> None:
        """Handle shutdown signals."""
        logger.info(f"Received signal {signum}. Shutting down...")
        self._shutdown_event.set()

    async def run(self) -> None:
        """Run both HTTP and gRPC servers concurrently."""
        try:
            # Start the HTTP server without waiting for it to complete
            http_task = asyncio.create_task(self.start_http_server())

            # If we have gRPC servers, start them too
            if self.grpc_servers:
                grpc_task = asyncio.create_task(self.start_grpc_server())
                tasks = [http_task, grpc_task]
            else:
                tasks = [http_task]

            # Create a simple never-ending task to keep the event loop running
            keep_alive = asyncio.create_task(self._keep_alive())
            tasks.append(keep_alive)

            # Wait for a signal to shut down or for an error in any server
            done, pending = await asyncio.wait(
                tasks,
                return_when=asyncio.FIRST_COMPLETED,
            )

            # Check for errors in completed tasks
            for task in done:
                if task.exception():
                    logger.error(f"Server error: {task.exception()}")
                    raise task.exception()

            # Cancel pending tasks
            for task in pending:
                task.cancel()
                try:
                    await task
                except asyncio.CancelledError:
                    pass

        except asyncio.CancelledError:
            logger.info("Server shutdown requested")
        except Exception as e:
            logger.exception(f"Unexpected error: {e}")
        finally:
            # Ensure all servers are properly shut down
            self._shutdown_event.set()
            logger.info("Server shutdown complete")

    async def _keep_alive(self):
        """Keep the event loop running until shutdown is requested."""
        try:
            while not self._shutdown_event.is_set():
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            pass


def create_servers() -> List[grpc.Server]:
    """Create gRPC servers with graceful error handling."""
    try:
        # Create server
        server = grpc.server(
            thread_pool=futures.ThreadPoolExecutor(max_workers=settings.WORKERS),
            interceptors=create_grpc_interceptors(),
            options=[
                ("grpc.max_send_message_length", settings.GRPC_MAX_MESSAGE_LENGTH),
                ("grpc.max_receive_message_length", settings.GRPC_MAX_MESSAGE_LENGTH),
                ("grpc.max_metadata_size", settings.GRPC_MAX_METADATA_SIZE),
                ("grpc.max_concurrent_streams", settings.GRPC_MAX_CONCURRENT_RPCS),
                (
                    "grpc.http2.min_time_between_pings_ms",
                    settings.GRPC_KEEPALIVE_TIME_MS,
                ),
                (
                    "grpc.http2.min_ping_interval_without_data_ms",
                    settings.GRPC_KEEPALIVE_TIMEOUT_MS,
                ),
                (
                    "grpc.http2.max_pings_without_data",
                    settings.GRPC_HTTP2_MAX_PINGS_WITHOUT_DATA,
                ),
                (
                    "grpc.http2.min_time_between_pings_ms",
                    settings.GRPC_HTTP2_MIN_RECV_PING_INTERVAL_WITHOUT_DATA_SEC * 1000,
                ),
            ],
        )

        try:
            # Add gRPC services
            from api.generated.api.v1 import user_pb2_grpc
            from api.services.grpc import UserService

            # Create and add UserService
            user_service = UserService()
            user_pb2_grpc.add_UserServiceServicer_to_server(user_service, server)

            logger.info("Registered gRPC services")
            return [server]
        except ImportError as e:
            logger.warning(f"Could not import gRPC generated modules: {e}")
            return []
    except Exception as e:
        logger.exception(f"Failed to create gRPC server: {e}")
        return []


def run() -> None:
    """Run the application."""
    # Create FastAPI app
    from .main import app

    # Create gRPC servers
    grpc_servers = create_servers()

    # Create and run the server manager
    manager = ServerManager(
        app=app,
        grpc_servers=grpc_servers,
        host=settings.HOST,
        http_port=settings.PORT,
        grpc_port=settings.GRPC_PORT,
        max_workers=settings.WORKERS,
    )

    # Check if we're in an event loop already
    try:
        loop = asyncio.get_running_loop()
        # We're already in an event loop (likely Uvicorn's)
        return asyncio.ensure_future(manager.run())
    except RuntimeError:
        # No running event loop, create one with asyncio.run()
        asyncio.run(manager.run())

# Create an ASGI app object for Uvicorn to use directly
from .main import app as fastapi_app

# This is what will be imported when using api.__main__:app
app = fastapi_app

if __name__ == "__main__":
    run()
