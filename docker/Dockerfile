FROM node:12
LABEL maintainer="admin@site15.ru"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
STOPSIGNAL SIGINT
CMD ["node", "server.js"]