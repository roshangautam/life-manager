#!/bin/bash
set -e

# Define the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Define the protobuf files directory
PROTO_DIR="${PROJECT_ROOT}/protos"

# Define the output directory for generated code
OUTPUT_DIR="${PROJECT_ROOT}/api/generated"

# Create the output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}/api/v1"

# Generate gRPC code for each .proto file
for proto_file in $(find "${PROTO_DIR}" -name '*.proto'); do
  echo "Generating code for ${proto_file}"
  
  # Extract the relative path to maintain the directory structure
  rel_path="${proto_file#$PROTO_DIR/}"
  rel_dir="$(dirname "$rel_path")"
  
  # Create the output directory structure
  mkdir -p "${OUTPUT_DIR}/${rel_dir}"
  
  # Generate Python gRPC code
  python -m grpc_tools.protoc \
    -I"${PROTO_DIR}" \
    --python_out="${OUTPUT_DIR}" \
    --grpc_python_out="${OUTPUT_DIR}" \
    --mypy_out="${OUTPUT_DIR}" \
    --mypy_grpc_out="${OUTPUT_DIR}" \
    "${proto_file}"
    
  # Fix import paths in generated files
  # for generated_file in $(find "${OUTPUT_DIR}" -name '*.py' -o -name '*.pyi'); do
    # Fix imports to use the full path from the project root
    # sed -i '' -e "s/^import /import api.generated./g" "$generated_file"
    # sed -i '' -e "s/^from api.v1 import /from api.generated.api.v1 import /g" "$generated_file"
    # sed -i '' -e "s/^from api.v1/from api.generated.api.v1/g" "$generated_file"
    # sed -i '' -e "s/from google/from api.generated.google/g" "$generated_file"
  # done
done

# Create __init__.py files to make the directories Python packages
find "${OUTPUT_DIR}" -type d -exec touch {}/__init__.py \;

# Create a version file
echo "# Generated file - do not edit" > "${OUTPUT_DIR}/__version__.py"
echo "__version__ = '0.1.0'" >> "${OUTPUT_DIR}/__version__.py"

echo "gRPC code generation complete. Generated files are in ${OUTPUT_DIR}"
