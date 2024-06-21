# Application
FROM php:8.3.1-fpm-bullseye

ARG PROJECT_DIRECTORY=/srv/www
ARG CRON_LOG_DIRECTORY=/var/log/cron
ARG APP_VERSION=0.0.0
ARG APP_ENV=dev
ENV APP_VERSION ${APP_VERSION}
ENV APP_ENV ${APP_ENV}

WORKDIR ${PROJECT_DIRECTORY}

# Install Nginx
RUN apt-get update -y && apt-get install -y supervisor \
    nginx \
    libxml2-dev \
    libmcrypt-dev \
    dos2unix nano \
    zip \
    unzip \
    git \
    libpng-dev \
    libzip-dev \
    cron \
    libpq-dev \
    ftp \
    libssl-dev

RUN docker-php-ext-install pdo_pgsql zip gd sockets ftp

COPY ./docker/nginx/conf.d/geo-backend.conf /etc/nginx/conf.d/site.conf
RUN rm /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default


# Add cron
RUN crontab -l -u www-data | { cat; echo "* * * * * cd ${PROJECT_DIRECTORY} && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1"; } | crontab -u www-data -

COPY ./docker/php/custom.ini /usr/local/etc/php/conf.d/custom.ini

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Create app directory
RUN mkdir -p ${PROJECT_DIRECTORY} && mkdir -p ${CRON_LOG_DIRECTORY} && chown -R www-data:www-data ${PROJECT_DIRECTORY}

# Create app directory
COPY --chown=www-data:www-data . ${PROJECT_DIRECTORY}/
RUN mv .env.example .env
RUN composer install --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --no-autoloader

RUN composer dump-autoload

## Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY docker/start-container /usr/local/bin/start-container
RUN dos2unix /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container
COPY ./docker/supervisord.conf /etc/supervisord.conf

## Thera are many bursts of request comming from geo maps, this should solve the issue
RUN echo 'pm.max_children = 32' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
echo 'pm.process_idle_timeout  = 3' >> /usr/local/etc/php-fpm.d/zz-docker.conf

# Expose port and CMD
EXPOSE 8080
ENTRYPOINT ["start-container"]
