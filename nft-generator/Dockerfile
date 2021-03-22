FROM node

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .
RUN mkdir output/ && touch output/test.txt

ENTRYPOINT ["npm", "start"]