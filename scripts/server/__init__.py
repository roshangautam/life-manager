"""Server management scripts."""

import os
import subprocess
import sys


def run():
    """Run the server in production mode."""
    print("Starting server...")
    os.environ["PYTHONPATH"] = f"{os.getcwd()}:{os.environ.get('PYTHONPATH', '')}"
    return subprocess.run(["python", "-m", "api.run"]).returncode


def dev():
    """Run the server in development mode with auto-reload."""
    print("Starting server in development mode...")
    os.environ["PYTHONPATH"] = f"{os.getcwd()}:{os.environ.get('PYTHONPATH', '')}"

    # Generate gRPC code first
    print("Generating gRPC code...")
    grpc_result = subprocess.run(["poetry", "run", "grpc-generate"])
    if grpc_result.returncode != 0:
        return grpc_result.returncode

    # Start the server with auto-reload
    return subprocess.run(["uvicorn", "api.main:app", "--reload"]).returncode


def main():
    """Run server command based on script name."""
    if len(sys.argv) < 2:
        print("Usage: poetry run server-<command>")
        return 1

    command = sys.argv[1]
    commands = {
        "run": run,
        "dev": dev,
    }

    if command not in commands:
        print(f"Unknown command: {command}")
        print(f"Available commands: {', '.join(commands.keys())}")
        return 1

    return commands[command]() or 0


if __name__ == "__main__":
    sys.exit(main())
