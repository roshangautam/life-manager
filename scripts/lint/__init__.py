"""Code linting scripts."""


def main():
    """Run linters."""
    import subprocess
    import sys

    print("Running black check...")
    black = subprocess.run(["black", "--check", "."])

    print("\nRunning isort check...")
    isort = subprocess.run(["isort", "--check-only", "."])

    print("\nRunning flake8...")
    flake8 = subprocess.run(["flake8", "."])

    print("\nRunning mypy...")
    mypy = subprocess.run(["mypy", "."])

    # Return non-zero exit code if any linter failed
    if any(r.returncode != 0 for r in [black, isort, flake8, mypy]):
        sys.exit(1)


if __name__ == "__main__":
    main()
