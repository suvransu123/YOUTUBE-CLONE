# Stage 1: Build stage
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production stage (Serve with Nginx)
FROM nginx:stable-alpine as production-stage

# Copy built files from build stage to nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config to allow React routing (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
