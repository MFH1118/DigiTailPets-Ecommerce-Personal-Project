FROM node:20-alpine3.16

WORKDIR /usr/src/app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# We don't need COPY . . anymore since we're using volumes
# COPY . .

EXPOSE 3000

# Use next dev for development
CMD ["npm", "run", "dev"]