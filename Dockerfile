# Stage 1: build admin app
FROM node:20-alpine AS admin-build
WORKDIR /admin
COPY admin-app/package.json admin-app/package-lock.json* ./admin-app/
RUN cd admin-app && npm install
COPY admin-app/ admin-app/
RUN cd admin-app && npm run build

# Stage 2: build server
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
# copy server code
COPY src/ src/
COPY prisma/ prisma/
# copy built admin app into public/admin
COPY --from=admin-build /admin/admin-app/dist ./public/admin
# copy public
COPY public/ public/
RUN npx prisma generate
EXPOSE 4000
CMD ["node", "src/server.js"]
