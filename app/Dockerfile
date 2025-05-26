FROM node:21-alpine

WORKDIR /app

# Copy the application
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Install dependencies
RUN yarn install

# Build the application
RUN yarn build

# Use a lightweight server to serve the static files
FROM nginx:alpine

# Copy the built app to nginx server
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
