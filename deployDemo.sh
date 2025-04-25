#!/bin/bash

# Ensure the script stops if any command fails
set -e

# Specify the branch to start
BRANCH="master"

# Checkout the branch
git checkout $BRANCH

# Install dependencies
npm install

# Start the application
npm start
