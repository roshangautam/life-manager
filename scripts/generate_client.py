#!/usr/bin/env python3
"""
Generate a Python client library for the gRPC API.

This script generates a Python package that provides a convenient interface
for interacting with the gRPC services defined in the project.
"""

import os
import shutil
from pathlib import Path
from string import Template

# Project root directory
PROJECT_ROOT = Path(__file__).parent.parent

# Source and destination directories
SRC_DIR = PROJECT_ROOT / "api" / "generated"
DEST_DIR = PROJECT_ROOT / "client"
TEMPLATES_DIR = PROJECT_ROOT / "scripts" / "templates"

# Client package structure
CLIENT_PACKAGE = "lifemanager_client"
CLIENT_DIR = DEST_DIR / CLIENT_PACKAGE

# Template files to process
TEMPLATE_FILES = [
    "setup.py.tmpl",
    "__init__.py.tmpl",
    "client.py.tmpl",
    "models.py.tmpl",
    "exceptions.py.tmpl",
]

# Template context
CONTEXT = {
    "package_name": CLIENT_PACKAGE,
    "version": "0.1.0",
    "description": "Python client for the Life Manager gRPC API",
    "author": "Your Name",
    "author_email": "your.email@example.com",
    "url": "https://github.com/yourusername/lifemanager",
}


def clean_directory(directory: Path):
    """Remove and recreate the target directory."""
    if directory.exists():
        shutil.rmtree(directory)
    directory.mkdir(parents=True, exist_ok=True)


def copy_generated_files():
    """Copy generated gRPC files to the client package."""
    # Create the proto directory
    proto_dir = CLIENT_DIR / "proto"
    proto_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy the generated proto files
    for root, _, files in os.walk(SRC_DIR):
        for file in files:
            if file.endswith(".py") and not file.startswith("__"):
                src_path = Path(root) / file
                rel_path = src_path.relative_to(SRC_DIR)
                dest_path = proto_dir / rel_path
                
                # Create destination directory if it doesn't exist
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Copy the file
                shutil.copy2(src_path, dest_path)
    
    # Create __init__.py files in all subdirectories
    for root, dirs, _ in os.walk(CLIENT_DIR):
        for dir_name in dirs:
            init_file = Path(root) / dir_name / "__init__.py"
            if not init_file.exists():
                init_file.touch()


def render_template(template_name: str, context: dict) -> str:
    """Render a template file with the given context."""
    template_path = TEMPLATES_DIR / template_name
    if not template_path.exists():
        return ""
    
    with open(template_path, "r") as f:
        template_content = f.read()
    
    template = Template(template_content)
    return template.safe_substitute(context)


def generate_client_files():
    """Generate client library files from templates."""
    # Create the client package directory
    clean_directory(CLIENT_DIR)
    
    # Copy generated proto files
    copy_generated_files()
    
    # Generate files from templates
    for template_file in TEMPLATE_FILES:
        # Determine the output file name
        output_file = template_file.replace(".tmpl", "")
        output_path = CLIENT_DIR / output_file
        
        # Render the template
        content = render_template(template_file, CONTEXT)
        if content:
            with open(output_path, "w") as f:
                f.write(content)
    
    # Create a README.md for the client
    readme_content = render_template("README.md.tmpl", CONTEXT)
    if readme_content:
        with open(CLIENT_DIR / "README.md", "w") as f:
            f.write(readme_content)
    
    print(f"Generated client library in {CLIENT_DIR}")


if __name__ == "__main__":
    # Create the templates directory if it doesn't exist
    TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Generate the client library
    generate_client_files()
