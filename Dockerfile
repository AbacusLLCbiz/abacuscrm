FROM node:22-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

# Copy static files into standalone directory (required for standalone mode)
RUN cp -r .next/static .next/standalone/.next/static && \
    cp -r public .next/standalone/public 2>/dev/null || true

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
