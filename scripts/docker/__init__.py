"""Docker Compose management scripts."""

import subprocess
import sys
from typing import List


def run_docker_compose(command: List[str], env: str = "dev") -> int:
    """Run a docker compose command."""
    base_cmd = ["docker", "compose"]

    # Add compose files based on environment
    if env == "prod":
        base_cmd.extend(["-f", "docker-compose.yml", "-f", "docker-compose.prod.yml"])
    elif env == "test":
        base_cmd.extend(["-f", "docker-compose.yml", "-f", "docker-compose.test.yml"])
    else:  # dev
        base_cmd.extend(
            ["-f", "docker-compose.yml", "-f", "docker-compose.override.yml"]
        )

    cmd = base_cmd + command
    print(f"Running: {' '.join(cmd)}")
    return subprocess.run(cmd).returncode


def up():
    """Start all services in detached mode."""
    return run_docker_compose(["up", "-d"])


def down():
    """Stop and remove all containers."""
    return run_docker_compose(["down"])


def restart():
    """Restart all services."""
    if down() != 0:
        return 1
    return up()


def logs():
    """Show logs for all services."""
    return run_docker_compose(["logs", "-f"])


def main():
    """Run docker command based on script name."""
    if len(sys.argv) < 2:
        print("Usage: poetry run docker-<command>")
        return 1

    command = sys.argv[1]
    commands = {
        "up": up,
        "down": down,
        "restart": restart,
        "logs": logs,
    }

    if command not in commands:
        print(f"Unknown command: {command}")
        print(f"Available commands: {', '.join(commands.keys())}")
        return 1

    return commands[command]() or 0


if __name__ == "__main__":
    sys.exit(main())
