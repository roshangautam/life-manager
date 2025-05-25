#!/usr/bin/env python3
"""
Script to generate gRPC code from Protocol Buffer definitions.
"""
import os
import sys
import subprocess
from pathlib import Path

# Project root directory
PROJECT_ROOT = Path(__file__).parent.parent

# Directories
PROTO_DIR = PROJECT_ROOT / "protos"
OUTPUT_DIR = PROJECT_ROOT / "api" / "generated"

# Ensure output directory exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def generate_proto_code(proto_file: Path):
    """Generate Python gRPC code from a .proto file."""
    print(f"Generating code for {proto_file.relative_to(PROJECT_ROOT)}")

    # Create the output directory structure
    rel_path = proto_file.relative_to(PROTO_DIR)
    output_subdir = OUTPUT_DIR / rel_path.parent
    output_subdir.mkdir(parents=True, exist_ok=True)

    # Build the protoc command
    cmd = [
        "python",
        "-m",
        "grpc_tools.protoc",
        f"--proto_path={PROTO_DIR}",
        f"--python_out={OUTPUT_DIR}",
        f"--grpc_python_out={OUTPUT_DIR}",
        f"--mypy_out={OUTPUT_DIR}",
        f"--mypy_grpc_out={OUTPUT_DIR}",
        str(proto_file.relative_to(PROTO_DIR)),
    ]

    # Run the command
    try:
        subprocess.run(cmd, check=True, cwd=PROJECT_ROOT)
        print(
            f"  → Successfully generated code in {output_subdir.relative_to(PROJECT_ROOT)}"
        )
    except subprocess.CalledProcessError as e:
        print(f"  → Error generating code: {e}", file=sys.stderr)
        return False

    return True


def fix_imports():
    """Fix import paths in generated files."""
    print("Fixing import paths in generated files...")

    # Find all generated Python files
    python_files = list(OUTPUT_DIR.rglob("*.py")) + list(OUTPUT_DIR.rglob("*.pyi"))

    for py_file in python_files:
        try:
            with open(py_file, "r+", encoding="utf-8") as f:
                content = f.read()

                # Fix imports
                content = content.replace(
                    "import api.v1", "from api.generated.api import v1 as api__v1"
                )
                content = content.replace("from api.v1", "from api.generated.api.v1")
                content = content.replace(
                    "import google", "from api.generated import google"
                )

                # Write back the fixed content
                f.seek(0)
                f.write(content)
                f.truncate()

            print(f"  → Fixed imports in {py_file.relative_to(PROJECT_ROOT)}")
        except Exception as e:
            print(
                f"  → Error fixing imports in {py_file.relative_to(PROJECT_ROOT)}: {e}",
                file=sys.stderr,
            )


def create_init_files():
    """Create __init__.py files to make the directories Python packages."""
    print("Creating __init__.py files...")

    # Create __init__.py in all directories under the output directory
    for dirpath, _, _ in os.walk(OUTPUT_DIR):
        init_file = os.path.join(dirpath, "__init__.py")
        if not os.path.exists(init_file):
            with open(init_file, "w", encoding="utf-8") as f:
                f.write("# Generated file - do not edit\n")
                f.write("# flake8: noqa\n")
                f.write("# fmt: off\n")
                f.write("# isort: skip_file\n")
                f.write("# mypy: ignore-errors\n")
                f.write("# pylint: skip-file\n")
                f.write("\n")
                f.write(
                    f'"""Auto-generated package for {os.path.basename(dirpath)}."""\n'
                )
                f.write("\n")
                f.write("__all__ = []\n")

            print(f"  → Created {os.path.relpath(init_file, PROJECT_ROOT)}")


def main():
    """Main function to generate gRPC code."""
    print(
        f"Generating gRPC code from .proto files in {PROTO_DIR.relative_to(PROJECT_ROOT)}..."
    )

    # Find all .proto files
    proto_files = list(PROTO_DIR.rglob("*.proto"))

    if not proto_files:
        print(f"No .proto files found in {PROTO_DIR.relative_to(PROJECT_ROOT)}")
        return 1

    # Generate code for each .proto file
    success = all(generate_proto_code(proto_file) for proto_file in proto_files)

    if success:
        # Fix imports in generated files
        fix_imports()

        # Create __init__.py files
        create_init_files()

        print("\n✅ Successfully generated gRPC code!")
        print(f"Output directory: {OUTPUT_DIR.relative_to(PROJECT_ROOT)}")
        return 0
    else:
        print("\n❌ Failed to generate gRPC code.", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
