FROM node

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .
RUN mkdir output; chown -R 1000:1000 ./output/; chmod a+rwx output

ENTRYPOINT ["npm", "start"]