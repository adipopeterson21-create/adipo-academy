# -------- Stage 1: Build React frontend --------
FROM node:18 AS frontend

WORKDIR /app

# Copy only admin-app first (improves caching)
COPY admin-app/package*.json ./admin-app/
RUN cd admin-app && npm install

# Now copy the rest of the code
COPY admin-app ./admin-app
RUN cd admin-app && npm run build

# -------- Stage 2: Build backend --------
FROM node:18 AS backend

WORKDIR /app

# Copy backend files
COPY package*.json ./
RUN npm install

# Copy built frontend into backend's public directory
COPY --from=frontend /app/admin-app/build ./public/admin

# Copy all backend source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port and start
EXPOSE 8080
CMD ["npm", "start"]
