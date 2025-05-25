# Etapa 1: build da aplicação Angular
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: servir com Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
