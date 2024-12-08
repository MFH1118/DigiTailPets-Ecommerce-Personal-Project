FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files first to leverage Docker caching
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install nodemon globally for development
RUN npm install -g nodemon

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy source files
COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "dev"]