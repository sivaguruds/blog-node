FROM node:18.18.2-alpine
WORKDIR /src/app
COPY package*.json ./
RUN npm install
COPY . . 
EXPOSE 5000
RUN npm run dev
CMD ["node", "dist/server.js"]