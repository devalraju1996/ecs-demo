FROM node:20-alpine

WORKDIR /app

# Install dependencies first so this layer is cached between builds
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy app code
COPY server.js ./

ENV NODE_ENV=production \
    PORT=8080 \
    BACKEND_URL=http://backend:3000

EXPOSE 8080

# Run as the non-root user that ships with the Node image
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["node", "server.js"]
