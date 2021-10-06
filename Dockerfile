FROM node:alpine
WORKDIR /node-app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
CMD [ "yarn", "dev" ]