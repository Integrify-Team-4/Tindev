FROM node:12-alpine3.10 as BUILDER 
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build-ts

FROM node:12-alpine3.10 as PRODUCTION
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY src/.well-known ./dist
COPY --from=BUILDER app/dist ./dist

ENTRYPOINT ["node", "dist/server.js"]