"""Cleanup scripts."""

import os
import shutil
import sys
from pathlib import Path


def clean():
    """Clean up Python and build artifacts."""
    # Remove Python cache directories
    for root, dirs, _ in os.walk("."):
        for d in dirs:
            if d in ["__pycache__", ".pytest_cache", ".mypy_cache"]:
                path = os.path.join(root, d)
                print(f"Removing {path}")
                shutil.rmtree(path, ignore_errors=True)

    # Remove build artifacts
    build_dirs = ["build", "dist", "*.egg-info", ".coverage", "htmlcov"]
    for d in build_dirs:
        if os.path.isfile(d):
            os.remove(d)
            print(f"Removed file {d}")
        elif os.path.isdir(d):
            shutil.rmtree(d, ignore_errors=True)
            print(f"Removed directory {d}")


def main():
    """Run cleanup."""
    try:
        clean()
        print("\nCleanup complete!")
    except Exception as e:
        print(f"Error during cleanup: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
