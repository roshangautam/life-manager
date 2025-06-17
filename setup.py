"""Life Manager - A comprehensive household and personal finance management system."""

from pathlib import Path

from setuptools import find_packages, setup

# Read the contents of README.md for the long description
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding="utf-8")


# Read requirements from requirements.txt
def read_requirements():
    requirements_path = this_directory / "requirements.txt"
    if requirements_path.exists():
        with open(requirements_path, "r", encoding="utf-8") as f:
            return [
                line.strip() for line in f if line.strip() and not line.startswith("#")
            ]
    return []


setup(
    name="life-manager",
    version="0.1.0",
    description="A comprehensive household and personal finance management system",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Roshan Gautam",
    author_email="contact@roshangautam.net",
    url="https://github.com/roshangautam/life-manager",
    license="MIT",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: End Users/Desktop",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Framework :: FastAPI",
        "Topic :: Office/Business :: Financial",
        "Topic :: Office/Business :: Scheduling",
    ],
    keywords="household finance management budget calendar",
    packages=find_packages(exclude=["tests", "tests.*"]),
    python_requires=">=3.8",
    install_requires=read_requirements(),
    extras_require={
        "dev": [
            "black>=22.3.0",
            "isort>=5.10.1",
            "mypy>=0.942",
            "pytest>=7.1.2",
            "pytest-cov>=3.0.0",
            "pytest-asyncio>=0.18.3",
            "httpx>=0.23.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "lifemanager=api.__main__:run",
        ],
    },
    include_package_data=True,
    zip_safe=False,
)
