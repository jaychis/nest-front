FROM node AS build

WORKDIR /app

COPY package*.json ./
RUN npm install -g dotenv-cli cross-env
RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build:prod

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# COPY SSL Certificate files
COPY ../_cert/certs/certificate.crt /etc/ssl/certs/certificate.crt
COPY ../_cert/certs/ca_bundle.crt   /etc/ssl/certs/ca_bundle.crt
COPY ../_cert/private/private.key   /etc/ssl/private/private.key

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
