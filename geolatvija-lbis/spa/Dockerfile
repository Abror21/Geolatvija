FROM node:18.14.2-buster AS build

ARG PROJECT_DIRECTORY=/srv/www

WORKDIR ${PROJECT_DIRECTORY}
COPY ./yarn.lock ./package.json ./
RUN yarn install
COPY ./ ./
RUN yarn build

FROM nginx:1.22.1-alpine

RUN apk update && apk add --no-cache supervisor

ARG PROJECT_DIRECTORY=/srv/www
ARG NODE_ENV=production
ARG REACT_APP_VERSION=0.0.0
ENV NODE_ENV ${NODE_ENV}
ENV REACT_APP_VERSION ${REACT_APP_VERSION}

WORKDIR ${PROJECT_DIRECTORY}
COPY --from=build ${PROJECT_DIRECTORY}/build/ ./
COPY ./docker/nginx/site.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/conf.d/default.conf

COPY ./docker/supervisord.conf /etc/supervisord.conf

# Expose port and CMD
CMD ["/usr/bin/supervisord"]
EXPOSE 80
