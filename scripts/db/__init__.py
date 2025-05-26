"""Database management scripts."""

import os
import subprocess
import sys
import time
from typing import Optional


def run_alembic_command(command: str, message: Optional[str] = None):
    """Run an alembic command with docker-compose."""
    cmd = ["docker", "compose", "exec", "api", "alembic"] + command.split()

    if message:
        cmd.extend(["-m", f'"{message}"'])

    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(" ".join(cmd), shell=True)
    return result.returncode


def migrate():
    """Create a new database migration."""
    message = input("Enter migration message: ")
    return run_alembic_command("revision --autogenerate", message)


def upgrade():
    """Upgrade database to the latest migration."""
    return run_alembic_command("upgrade head")


def downgrade():
    """Downgrade database by one migration."""
    return run_alembic_command("downgrade -1")


def revision():
    """Create a new revision file."""
    message = input("Enter revision message: ")
    return run_alembic_command("revision", message)


def show():
    """Show current database revision."""
    return run_alembic_command("current")


def reset(force: bool = False):
    """Reset database (drop, create, upgrade)."""
    print("WARNING: This will drop and recreate the database.")
    if not force and not any(arg == "--force" for arg in sys.argv):
        try:
            confirm = input("Are you sure you want to continue? [y/N] ")
            if confirm.lower() != "y":
                print("Operation cancelled.")
                return 0
        except EOFError:
            print(
                "Running in non-interactive mode. Use --force flag to skip confirmation."
            )
            return 1

    print("Stopping and removing containers...")
    subprocess.run(["docker", "compose", "down", "-v"])

    print("Starting PostgreSQL container...")
    subprocess.run(["docker", "compose", "up", "-d", "postgres"])

    # Wait for database to be ready
    print("Waiting for database to be ready...")
    for _ in range(30):  # Try for 30 seconds
        result = subprocess.run(
            [
                "docker",
                "compose",
                "exec",
                "-T",
                "postgres",
                "pg_isready",
                "-U",
                "postgres",
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        if result.returncode == 0:
            break
        time.sleep(1)
    else:
        print("Error: Database is not ready after 30 seconds")
        return 1

    print("Running database migrations...")
    return run_alembic_command("upgrade head")


def main():
    """Run database command based on script name."""
    if len(sys.argv) < 2:
        print("Usage: poetry run db-<command> [--force]")
        return 1

    command = sys.argv[1]
    force = "--force" in sys.argv[2:]

    commands = {
        "migrate": migrate,
        "upgrade": upgrade,
        "downgrade": downgrade,
        "revision": revision,
        "show": show,
        "reset": lambda: reset(force=force),
    }

    if command not in commands:
        print(f"Unknown command: {command}")
        print(f"Available commands: {', '.join(commands.keys())}")
        return 1

    return commands[command]() or 0


if __name__ == "__main__":
    sys.exit(main())
