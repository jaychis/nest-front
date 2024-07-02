FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install -g dotenv-cli cross-env

RUN npm install

COPY . .

ENV PORT=9797
ENV HOST=3.34.131.71
ENV NODE_ENV=production

RUN rm -rf ./dist || true
RUN npm run build

CMD ["npm", "run", "start:prod"]
