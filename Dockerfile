# Stage 1: Build the Angular application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Using --legacy-peer-deps to handle peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=4000

# Start the application
CMD ["node", "dist/hiring-tool/server/server.mjs"]
