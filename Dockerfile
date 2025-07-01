# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy everything else
COPY . .

# Expose port & run
EXPOSE 7860
CMD [ "npm", "start" ]