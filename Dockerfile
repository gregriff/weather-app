FROM node:23-alpine as build-stage

WORKDIR /code

COPY package*.json ./

RUN npm ci --no-audit

COPY . ./

RUN npm run build

FROM nginx:stable-alpine AS webserver
ARG NGINX_SERVER_NAME
ARG PORT
ENV NGINX_ENVSUBST_OUTPUT_DIR="/etc/nginx"

COPY --from=build-stage /code/dist /usr/share/nginx/html
COPY --from=build-stage /code/etc/nginx /etc/nginx

RUN apk update && apk upgrade

EXPOSE ${PORT}/tcp

CMD [ "nginx", "-c", "/etc/nginx/nginx.conf"]