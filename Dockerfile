FROM node

WORKDIR /developer/nodejs/booking-service

COPY package.json .
RUN npm install --omit=dev

COPY . .

RUN curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh

RUN chmod +x wait-for-it.sh

CMD ["./wait-for-it.sh", "rabbitmq:5672", "--", "npm", "run", "dev"]