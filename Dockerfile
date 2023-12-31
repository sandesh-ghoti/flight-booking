FROM node
WORKDIR /development/nodejs/booking-service
COPY . .
RUN npm install nodemon
RUN npm ci
CMD ["npx", "nodemon","./src"]