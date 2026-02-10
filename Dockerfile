FROM node:20-slim

WORKDIR /app

# Dependências do Prisma
RUN apt-get update && apt-get install -y openssl
RUN apt-get install -y tini && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

COPY . .

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["npm", "run", "start:dev"]