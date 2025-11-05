# -------- Stage 1: Build Vite React frontend --------
FROM node:18 AS frontend

WORKDIR /app

# Copy and install dependencies for admin-app
COPY admin-app/package*.json ./admin-app/
RUN cd admin-app && npm install

# Copy the rest of the frontend source
COPY admin-app ./admin-app

# Run Vite build
RUN cd admin-app && npx vite build

# -------- Stage 2: Build backend --------
FROM node:18 AS backend

WORKDIR /app

# Copy backend package files
COPY package*.json ./
RUN npm install

# Copy built frontend into backend's public directory
COPY --from=frontend /app/admin-app/dist ./public/admin

# Copy all backend source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port and start the app
EXPOSE 8080
CMD ["npm", "start"]
