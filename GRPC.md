# Life Manager gRPC API

This document provides information about the gRPC API for the Life Manager application.

## Prerequisites

- Python 3.8+
- pip
- protoc (Protocol Buffers compiler)
- grpcio-tools

## Setup

1. **Install Dependencies**

   ```bash
   # Install Python dependencies
   pip install -r requirements.txt
   pip install -r requirements-grpc.txt
   ```

2. **Generate gRPC Code**

   Run the following command to generate the gRPC code from the Protocol Buffer definitions:

   ```bash
   make grpc-generate
   ```

   This will generate the necessary Python code in the `api/generated` directory.

## Running the Server

You can start the gRPC server using the provided script:

```bash
# Start the server
make server-run

# Start the server in development mode (generates gRPC code first)
make server-dev
```

By default, the server will start on:
- gRPC: `0.0.0.0:50051`
- HTTP (REST): `0.0.0.0:8000`

## Testing the API

You can test the gRPC API using a gRPC client like [grpcurl](https://github.com/fullstorydev/grpcurl) or [BloomRPC](https://github.com/bloomrpc/bloomrpc).

### Using grpcurl

1. **List Services**

   ```bash
   grpcurl -plaintext localhost:50051 list
   ```

2. **List Methods in a Service**

   ```bash
   grpcurl -plaintext localhost:50051 list api.v1.UserService
   ```

3. **Call a Method**

   ```bash
   # Create a user
   grpcurl -plaintext -d '{"email": "test@example.com", "password": "password123", "full_name": "Test User"}' \
     localhost:50051 api.v1.UserService/CreateUser
   
   # Authenticate
   grpcurl -plaintext -d '{"email": "test@example.com", "password": "password123"}' \
     localhost:50051 api.v1.UserService/Authenticate
   
   # Get user by ID (requires authentication)
   TOKEN="your-jwt-token"
   grpcurl -plaintext -H "authorization: Bearer $TOKEN" \
     -d '{"id": "user-id"}' \
     localhost:50051 api.v1.UserService/GetUser
   ```

## API Documentation

The gRPC API is defined in the Protocol Buffer files located in the `protos` directory. The main service definitions are:

- `api/v1/user.proto`: User management service
- `api/v1/household.proto`: Household management service
- `api/v1/finance.proto`: Finance management service
- `api/v1/calendar.proto`: Calendar and event management service

## Development

### Adding a New Service

1. Create a new `.proto` file in the `protos/api/v1` directory.
2. Define your service and messages in the Protocol Buffer file.
3. Generate the gRPC code:

   ```bash
   make grpc-generate
   ```

4. Implement the service in the `api/services/grpc` directory.
5. Register the service in the `api/run.py` file.

### Code Generation

To regenerate the gRPC code after making changes to the `.proto` files, run:

```bash
make grpc-generate
```

## Deployment

For production deployment, you can use a process manager like [systemd](https://systemd.io/) or [supervisor](http://supervisord.org/) to manage the gRPC server process. Make sure to configure appropriate resource limits and monitoring.

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Make sure the `PYTHONPATH` environment variable includes the project root.
   - Run `./scripts/generate_grpc_code.sh` to regenerate the gRPC code.

2. **Connection Issues**
   - Verify that the server is running and listening on the correct address and port.
   - Check firewall settings if connecting from a different machine.

3. **Authentication Errors**
   - Ensure that the JWT token is valid and not expired.
   - Check that the token is included in the `authorization` header with the `Bearer ` prefix.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
