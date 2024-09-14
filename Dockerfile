# Stage 1: Build React app
FROM node:20.11.1-alpine AS build

WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose port 5173
EXPOSE 5173

# Start your React app
CMD ["yarn", "dev"]
