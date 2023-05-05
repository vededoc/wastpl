FROM node:16-alpine
ARG DB_BRAND=mariadb
ARG DB_HOST=localhost
ARG DB_NAME=was
ARG DB_USER=was
ARG DB_PASSWORD

ARG SERVICE_PORT=19000
ARG BASE_PATH=/was/v1
ARG CLUSTER_COUNT=0
ARG API_LOG=0

ARG REDIS_HOST=localhost
ARG GOOGLE_CLIENT_ID

#ARG EXTERNAL_ADDR
#ARG STORAGE_PATH=/data/was/files
WORKDIR /app
RUN npm i -g @vededoc/l4app
RUN npm i -g pnpm
ADD dist /app/dist
#RUN mkdir -p /data/was/files
RUN mkdir -p /data/was/logs
COPY package.json ./
COPY pnpm-lock.yaml ./
#RUN npm install --omit=dev
RUN pnpm install --frozen-lockfile --prod

ENV NODE_ENV production
ENV DB_BRAND $DB_BRAND
ENV DB_HOST $DB_HOST
ENV DB_NAME $DB_NAME
ENV DB_USER $DB_USER
ENV DB_PASSWORD $DB_PASSWORD
ENV REDIS_HOST $REDIS_HOST
ENV EXTERNAL_ADDR $EXTERNAL_ADDR
ENV STORAGE_PATH $STORAGE_PATH
ENV NPM_CONFIG_LOGLEVEL warn
CMD ["l4app", "-w", "/data/was/logs", "node", "--", "./dist/main.js"]
