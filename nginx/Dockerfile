FROM nginx:stable-alpine

COPY ./static /usr/share/nginx/html

COPY ngix.conf /etc/nginx/nginx.conf

COPY default.conf /etc/nginx/conf.d/

WORKDIR /usr/share/nginx/html
