FROM node:17-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Port number
EXPOSE 8000
EXPOSE 8443

CMD [ "npm" , "start"]