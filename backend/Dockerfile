# Use official Node.js image as base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (only production if needed, but for now standard)
RUN npm install

# Copy source code
COPY . .

# Expose port (default 8000 based on src/index.js)
EXPOSE 8000

# Start command
CMD ["npm", "start"]
