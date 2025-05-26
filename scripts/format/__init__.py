"""Code formatting scripts."""


def main():
    """Run code formatters."""
    import subprocess

    print("Running black...")
    subprocess.run(["black", "."], check=True)

    print("\nRunning isort...")
    subprocess.run(["isort", "."], check=True)


if __name__ == "__main__":
    main()
