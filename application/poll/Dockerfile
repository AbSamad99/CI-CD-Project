FROM node:22.12.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
