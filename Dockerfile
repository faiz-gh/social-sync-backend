FROM node:20-alpine3.18

WORKDIR /app

COPY ./package.json .
RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE 5500

CMD ["sh", "-c", "npm run migration:run; pnpm run build; pnpm run start"]