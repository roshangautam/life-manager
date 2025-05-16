import logging
import signal
import sys
from concurrent import futures
from typing import List, Optional

import grpc
from grpc_health.v1 import health_pb2_grpc, health as health_servicer
from grpc_reflection.v1alpha import reflection

logger = logging.getLogger(__name__)


class GRPCServer:
    """A base class for gRPC servers with common functionality."""
    
    def __init__(
        self,
        host: str = "[::]",
        port: int = 50051,
        max_workers: int = 10,
        max_message_length: int = 100 * 1024 * 1024,  # 100MB
        options: Optional[List[tuple]] = None,
        enable_reflection: bool = True,
        enable_health_check: bool = True,
    ):
        """Initialize the gRPC server.
        
        Args:
            host: The host to bind the server to.
            port: The port to bind the server to.
            max_workers: Maximum number of worker threads.
            max_message_length: Maximum message length in bytes.
            options: Additional gRPC server options.
            enable_reflection: Whether to enable gRPC reflection.
            enable_health_check: Whether to enable gRPC health checking.
        """
        self.host = host
        self.port = port
        self.max_workers = max_workers
        self.max_message_length = max_message_length
        self.enable_reflection = enable_reflection
        self.enable_health_check = enable_health_check
        
        # Default server options
        default_options = [
            ('grpc.max_send_message_length', self.max_message_length),
            ('grpc.max_receive_message_length', self.max_message_length),
            ('grpc.max_metadata_size', 32 * 1024),  # 32KB
            ('grpc.max_concurrent_rpcs', 1000),
        ]
        
        # Merge with user-provided options
        self.options = default_options + (options or [])
        
        # Initialize the server
        self.server = grpc.server(
            futures.ThreadPoolExecutor(max_workers=self.max_workers),
            options=self.options
        )
        
        # Initialize service name list for reflection
        self.service_names = []
    
    def add_service(self, servicer, add_servicer_to_server_fn):
        """Add a service to the server.
        
        Args:
            servicer: The servicer instance implementing the service.
            add_servicer_to_server_fn: The generated function to add the servicer to the server.
        """
        add_servicer_to_server_fn(servicer, self.server)
        
        # Get the service name from the servicer
        service_name = servicer.__class__.__name__
        if service_name.endswith('Servicer'):
            service_name = service_name[:-8]  # Remove 'Servicer' suffix
        
        # Add to service names for reflection
        service_full_name = f"api.v1.{service_name}"
        self.service_names.append(service_full_name)
        logger.info(f"Added service: {service_full_name}")
    
    def _enable_health_checking(self):
        """Enable gRPC health checking."""
        if not self.enable_health_check:
            return
            
        # Create a health check servicer
        health_servicer_instance = health_servicer.HealthServicer()
        health_pb2_grpc.add_HealthServicer_to_server(health_servicer_instance, self.server)
        
        # Mark all services as serving
        for service_name in self.service_names:
            health_servicer_instance.set(service_name, health_pb2.HealthCheckResponse.SERVING)
        
        # Also add the health service to reflection
        self.service_names.append(health_pb2.DESCRIPTOR.services_by_name['Health'].full_name)
        logger.info("Enabled gRPC health checking")
    
    def _enable_reflection(self):
        """Enable gRPC reflection."""
        if not self.enable_reflection:
            return
            
        if not self.service_names:
            logger.warning("No services added to enable reflection")
            return
        
        # Add the reflection service
        service_names = list(self.service_names)
        service_names.append(reflection.SERVICE_NAME)
        reflection.enable_server_reflection(service_names, self.server)
        logger.info(f"Enabled gRPC reflection for services: {service_names}")
    
    def start(self):
        """Start the gRPC server."""
        # Enable health checking if requested
        self._enable_health_checking()
        
        # Enable reflection if requested
        self._enable_reflection()
        
        # Start the server
        server_address = f"{self.host}:{self.port}"
        self.server.add_insecure_port(server_address)
        
        logger.info(f"Starting gRPC server on {server_address}")
        self.server.start()
        
        # Register signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self._handle_shutdown)
        signal.signal(signal.SIGTERM, self._handle_shutdown)
        
        logger.info("gRPC server started")
        return self.server
    
    def wait_for_termination(self, timeout=None):
        """Wait for the server to terminate."""
        try:
            self.server.wait_for_termination(timeout=timeout)
        except KeyboardInterrupt:
            logger.info("Received keyboard interrupt. Shutting down...")
            self.stop()
    
    def stop(self, grace=None):
        """Stop the gRPC server.
        
        Args:
            grace: Optional grace period in seconds for graceful shutdown.
        """
        logger.info("Shutting down gRPC server...")
        self.server.stop(grace=grace)
        logger.info("gRPC server stopped")
    
    def _handle_shutdown(self, signum, frame):
        """Handle shutdown signals."""
        logger.info(f"Received signal {signum}. Shutting down...")
        self.stop()
        sys.exit(0)
    
    def __enter__(self):
        """Context manager entry."""
        self.start()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.stop()


def serve():
    """Run the gRPC server."""
    import logging
    from concurrent import futures
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    )
    
    # Create and start the server
    server = GRPCServer(host="[::]", port=50051)
    
    # Note: Add your services here
    # from api.services.user_service import UserService
    # from api.generated.api.v1 import user_pb2_grpc
    # server.add_service(UserService(), user_pb2_grpc.add_UserServiceServicer_to_server)
    
    try:
        server.start()
        server.wait_for_termination()
    except KeyboardInterrupt:
        logger.info("Shutting down...")
        server.stop()


if __name__ == "__main__":
    serve()
