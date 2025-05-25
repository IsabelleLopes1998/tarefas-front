# Etapa única: servir o frontend com Nginx
FROM nginx:alpine

# Copia os arquivos já gerados no dist local para o diretório do Nginx
COPY ./dist /usr/share/nginx/html
