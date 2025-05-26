"""gRPC code generation scripts."""

import os
import shutil
import sys
from pathlib import Path


def generate():
    """Generate gRPC code from .proto files."""
    print("Generating gRPC code from .proto files...")

    # Create output directories
    output_dir = Path("api/generated")
    output_dir.mkdir(parents=True, exist_ok=True)

    # Clean existing generated files
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)

    # Find all .proto files
    proto_files = list(Path("protos").rglob("*.proto"))
    if not proto_files:
        print("No .proto files found in protos/ directory")
        return 1

    # Generate code for each .proto file
    for proto_file in proto_files:
        print(f"Generating code for {proto_file}")
        rel_path = proto_file.relative_to("protos")
        rel_dir = rel_path.parent

        # Create output directory structure
        (output_dir / rel_dir).mkdir(parents=True, exist_ok=True)

        # Run protoc
        cmd = [
            "python",
            "-m",
            "grpc_tools.protoc",
            f"-Iprotos",
            f"--python_out={output_dir}",
            f"--grpc_python_out={output_dir}",
            f"--mypy_out={output_dir}",
            f"--mypy_grpc_out={output_dir}",
            str(proto_file),
        ]

        result = subprocess.run(cmd)
        if result.returncode != 0:
            print(f"Failed to generate code for {proto_file}")
            return result.returncode

    # Create __init__.py files
    for root, dirs, _ in os.walk(output_dir):
        for d in dirs:
            (Path(root) / d / "__init__.py").touch()

    # Create __version__.py
    version_file = output_dir / "__version__.py"
    with open(version_file, "w") as f:
        f.write("# Generated file - do not edit\n")
        f.write("__version__ = '0.1.0'\n")

    print("gRPC code generation complete")
    return 0


def clean():
    """Clean generated gRPC code."""
    print("Cleaning generated gRPC code...")
    output_dir = Path("api/generated")
    if output_dir.exists():
        shutil.rmtree(output_dir)
    print("Generated code cleaned")
    return 0


def main():
    """Run gRPC command based on script name."""
    if len(sys.argv) < 2:
        print("Usage: poetry run grpc-<command>")
        return 1

    command = sys.argv[1]
    commands = {
        "generate": generate,
        "clean": clean,
    }

    if command not in commands:
        print(f"Unknown command: {command}")
        print(f"Available commands: {', '.join(commands.keys())}")
        return 1

    return commands[command]() or 0


if __name__ == "__main__":
    sys.exit(main())
