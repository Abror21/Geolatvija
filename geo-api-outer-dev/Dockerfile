#
# Application
#
FROM php:8.3-fpm-bullseye

ARG PROJECT_DIRECTORY=/srv/www
ARG CRON_LOG_DIRECTORY=/var/log/cron
ARG COMPOSER_VERSION=2.2.0
ARG APP_VERSION=0.0.0
ENV APP_VERSION ${APP_VERSION}

WORKDIR ${PROJECT_DIRECTORY}

RUN apt-get update && apt-get install -y curl \
    nginx \
    telnet \
    libonig-dev \
    libxml2-dev \
    libzip-dev zip \
    unzip \
    dos2unix \
    nano \
    procps \
    wget \
    git \
    supervisor \
    libcurl4-openssl-dev \
    pkg-config gnupg2 \
    cron \
    libpq-dev

RUN docker-php-ext-install pdo_pgsql bcmath intl curl zip xml soap

COPY ./docker/nginx/conf.d/api-outer.conf /etc/nginx/conf.d/api-outer.conf
COPY docker/php/custom.ini /usr/local/etc/php/conf.d/custom.ini

RUN rm /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --version=${COMPOSER_VERSION} --filename=composer

# Create app directory
RUN mkdir -p ${PROJECT_DIRECTORY} && mkdir -p ${CRON_LOG_DIRECTORY}

# Copy Composer dependencies
COPY --chown=www-data:www-data . ${PROJECT_DIRECTORY}/
RUN mv .env.example .env
RUN composer install --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --no-autoloader

RUN composer dump-autoload

# Add cron
RUN crontab -l -u www-data | { cat; echo "* * * * * cd ${PROJECT_DIRECTORY} && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1"; } | crontab -u www-data -

## Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY docker/start-container /usr/local/bin/start-container
RUN dos2unix /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8081

ENTRYPOINT ["start-container"]
