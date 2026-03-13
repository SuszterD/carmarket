FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

CMD ["npx", "serve", "-s", "dist/carmarket/browser", "-l", "4200", "--single"]
