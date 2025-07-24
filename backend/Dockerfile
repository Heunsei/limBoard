FROM node:alpine AS development

WORKDIR /usr/src/app

COPY backend/package*.json ./
COPY backend/pnpm-lock.yaml ./
COPY backend/tsconfig.json ./
COPY backend/nest-cli.json ./

RUN npm i -g pnpm

RUN pnpm i

COPY /backend /backend

RUN pnpm run build

CMD ["pnpm", "start:dev"]