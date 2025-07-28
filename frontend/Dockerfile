# 개발용
FROM node:alpine AS development

WORKDIR /usr/src/app

COPY /frontend/package*.json ./
RUN npm install

# 소스코드 복사
COPY /frontend .

# 개발 서버 실행
EXPOSE 3000
CMD ["npm", "run", "dev"]

# 필요할 때만 dependency 를 설치하도록 스테이지 분리
FROM node:alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

COPY /frontend/package*.json ./
COPY /frontend/tsconfig.json ./

RUN npm i

#################

FROM node:alpine AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY /frontend .

RUN npm run build

##################

FROM node:alpine AS runner

WORKDIR /usr/src/app

# container 환경에 시스템 사용자를 추가
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# next.config.js에서 output을 standalone으로 설정하면
# 빌드에 필요한 최소한의 파일만 ./next/standalone로 출력이 된다.
# standalone 결과물에는 public 폴더와 static 폴더 내용은 포함되지 않으므로, 따로 복사를 해준다.
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]

