# Stage 1: Build the React frontend
FROM node:20 AS ui-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve the NodeJS backend
FROM node:20
WORKDIR /app

# Copy root package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source
COPY server.js ./

# Copy the built UI from the builder stage
COPY --from=ui-builder /app/frontend/dist ./frontend/dist

# Expose port and start
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["npm", "start"]
