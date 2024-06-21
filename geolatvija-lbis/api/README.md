### SETUP 

1. Clone project 
2. Copy configuration - `cp .env.example .env`
3. Change credentials in .env file if needed
4. docker-compose build
5. docker network create geo-app
6. docker volume create geo-backend-postgres
7. docker-compose up -d
8. Every command should be executed in container 
9. Connect to container - `docker exec -it geo-backend bash`
10. Configure xdebug in your IDE (if necessary)
