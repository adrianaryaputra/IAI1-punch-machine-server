FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
EXPOSE 8889
CMD ["npm", "start"]