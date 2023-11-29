# Set the base image to the official Node.js image
FROM node:16

RUN apt-get update
RUN apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb \
    # Additional dependencies based on the new error message
    libnss3-tools \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libatspi2.0-0 \
    libgtk-3-0 \
    # Clean up the apt cache to reduce image size
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a directory for your app
WORKDIR /app

# Copy your package.json and package-lock.json files to the app directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code to the app directory
COPY . .

# Expose the port that your app listens on
EXPOSE 3000

# Start your app
CMD ["npm", "start"]