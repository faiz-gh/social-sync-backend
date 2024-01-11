FROM node:20-alpine3.18

WORKDIR /app

COPY ./package.json .
RUN npm cache clean --force
RUN npm install

COPY . .

EXPOSE 4400

CMD ["sh", "-c", "npm run migration:run; npm run dev;"]