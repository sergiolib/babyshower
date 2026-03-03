# Stage 1: Build the React frontend
FROM node:20-slim AS ui-builder

# Set working directory for the frontend build
WORKDIR /app/frontend

# Copy package files first to leverage Docker layer caching
COPY frontend/package*.json ./

# Install frontend dependencies using 'npm ci' for a clean, reproducible install
RUN npm ci

# Copy the rest of the frontend source code
COPY frontend/ ./

# Build the frontend application
RUN npm run build

# Stage 2: Serve the NodeJS backend
FROM node:20-slim

# Set the working directory for the application
WORKDIR /app

# Create the app directory and set ownership to the 'node' user
RUN chown node:node /app

# Switch to the non-root 'node' user for security
USER node

# Copy backend package files with correct ownership
COPY --chown=node:node package*.json ./

# Install only production dependencies
# --omit=dev ensures devDependencies are skipped
RUN npm ci --omit=dev && npm cache clean --force

# Copy the backend server source code
COPY --chown=node:node server.js ./

# Copy the built UI from the builder stage
# This places the static files in the location expected by 'server.js'
COPY --from=ui-builder --chown=node:node /app/frontend/dist ./frontend/dist

# Expose port 8080 (standard for Cloud Run and many other platforms)
EXPOSE 8080

# Environment variables
# PORT 8080 is common for containerized environments
ENV PORT=8080
ENV NODE_ENV=production

# Start the application using node directly for better signal handling and performance
CMD ["node", "server.js"]
