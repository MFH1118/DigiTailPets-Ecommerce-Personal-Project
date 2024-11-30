FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install nodemon globally for development
RUN npm install -g nodemon

# Install dependencies
RUN npm install

EXPOSE 5000

CMD ["npm", "run", "dev"]