FROM node:current-alpine3.15 as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

RUN npm run build

FROM nginx as prod

COPY --from=build /app/dist /var/www/html

COPY ./docker/config.js /var/www/config.js
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/entrypoint.sh /usr/local/bin/entrypoint

RUN chmod +x /usr/local/bin/entrypoint

EXPOSE 8080

CMD [ "entrypoint" ]
