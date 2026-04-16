FROM node:24-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

RUN printf '#!/bin/sh\nset -e\necho "Node: $(node --version)"\necho "Running prisma db push..."\nnpx prisma db push --accept-data-loss\necho "Starting Next.js..."\nexec npm start\n' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
