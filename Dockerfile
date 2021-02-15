FROM node:14.15.5-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY index.js .

EXPOSE 8080
CMD ["node", "index.js"]
