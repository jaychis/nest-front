FROM node

WORKDIR /app/server

COPY package*.json ./

RUN npm install -g dotenv-cli
RUN npm install -g dotenv
RUN npm install -g cross-env

RUN npm ci --force

COPY ./ ./

ENV PORT=9797
ENV HOST=3.34.131.71
ENV NODE_ENV=production

ARG AWSREGION
ARG S3BUCKETNAME

ENV AWSREGION=${AWSREGION}
ENV S3BUCKETNAME=${S3BUCKETNAME}

RUN echo "AWSREGION=$AWSREGION" \
    && echo "S3BUCKETNAME=$S3BUCKETNAME"

RUN rm -rf ./dist || true
RUN prisma generate
RUN npm run build

CMD ["npm", "run", "start:prod"]
