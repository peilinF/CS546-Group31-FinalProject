#  Use Python to perform additional tasks
#FROM python:3.9

# Copy the build output from the node-stage to this stage
#WORKDIR /app
#COPY --from=node-stage /app/dist /app/dist

# Install Python dependencies


# Set the base image to the official Node.js image
FROM node:16

RUN apt-get update
RUN apt-get install -y python3 python3-pip

RUN pip3 install --upgrade pip 
RUN pip3 install bs4 asyncio aiohttp

# Create a directory for your app
WORKDIR /app

#COPY --from=build /app/venv /venv

#ENV PATH="/app/venv/bin:$PATH"
#ENV NODE_ENV = container

# Copy your package.json and package-lock.json files to the app directory
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of your app's source code to the app directory
COPY . .

RUN mkdir -p /app/public

# Expose the port that your app listens on
EXPOSE 4000

# Start your app
CMD ["npm", "start"]

# Set the base image to the official python3 image
#FROM python:3.10 as build

#WORKDIR /app
#RUN python -m venv /app/venv
#ENV PATH="/app/venv/bin:$PATH"

#RUN pip3 install bs4 asyncio aiohttp==3.8.4


