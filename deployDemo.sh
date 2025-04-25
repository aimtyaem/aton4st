#!/bin/bash

# Ensure the script stops if any command fails
set -e

# Specify the branch to start
BRANCH="master"

# Log the start of the deployment process
echo "Starting deployment process on branch: $BRANCH"

# Checkout the branch and ensure it's up to date
git checkout $BRANCH
git pull origin $BRANCH

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application (if applicable)
if [ -f "package.json" ] && grep -q "\"build\"" package.json; then
  echo "Building the application..."
  npm run build
else
  echo "No build script found. Skipping build step."
fi

# Start the application
echo "Starting the application..."
npm start

# Log the successful deployment
echo "Deployment completed successfully on branch: $BRANCH"
