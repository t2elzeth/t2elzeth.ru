FROM node

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .
RUN mkdir output; chmod a+rwx output

ENTRYPOINT ["npm", "start"]