"""Test running scripts."""


def main():
    """Run tests with coverage."""
    import subprocess
    import sys

    cmd = ["pytest", "--cov=api", "--cov-report=term-missing", "--cov-fail-under=80"]

    # Pass through any additional arguments to pytest
    if len(sys.argv) > 1:
        cmd.extend(sys.argv[1:])

    result = subprocess.run(cmd)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
