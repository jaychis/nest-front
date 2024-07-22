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

# Copy SSL certificate files using secrets
#ARG CERTIFICATE_CRT
#ARG CA_BUNDLE_CRT
#ARG PRIVATE_KEY

#RUN echo "$CERTIFICATE_CRT" > /etc/ssl/certs/certificate.crt
#RUN echo "$CA_BUNDLE_CRT" > /etc/ssl/certs/ca_bundle.crt
#RUN echo "$PRIVATE_KEY" > /etc/ssl/private/private.key
COPY _certs/certificate.crt /etc/ssl/certs/certificate.crt
COPY _certs/ca_bundle.crt /etc/ssl/certs/ca_bundle.crt
COPY _certs/private.key /etc/ssl/private/private.key

# Debugging step: list the files in the container
RUN ls -la /etc/ssl/certs
RUN ls -la /etc/ssl/private

# Set environment variables for ports and server name
ARG HTTP_PORT
ARG HTTPS_PORT
ARG SERVER_NAME

# Use ARG values to set ENV values
ENV HTTP_PORT=${HTTP_PORT}
ENV HTTPS_PORT=${HTTPS_PORT}
ENV SERVER_NAME=${SERVER_NAME}

# Use envsubst to substitute environment variables in nginx template
RUN envsubst '$HTTP_PORT $HTTPS_PORT $SERVER_NAME' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Expose all potential ports
EXPOSE 80
EXPOSE 81
EXPOSE 443
EXPOSE 444

CMD ["nginx", "-g", "daemon off;"]
