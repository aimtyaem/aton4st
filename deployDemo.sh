#!/bin/bash

# Define deployment directory
DEPLOY_DIR="/var/www/html/demo"  # Change this to your desired deployment directory
HTML_FILE="demo.html"
JS_DIR="js"

# Check if deployment directory exists, if not, create it
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "Creating deployment directory: $DEPLOY_DIR"
    mkdir -p "$DEPLOY_DIR/$JS_DIR"
else
    echo "Deployment directory already exists: $DEPLOY_DIR"
fi

# Deploy demo.html
echo "Deploying $HTML_FILE"
cp demo.html "$DEPLOY_DIR/"

# Deploy JavaScript files
echo "Deploying JavaScript files"
cp js/demo.js "$DEPLOY_DIR/$JS_DIR/"
cp js/scilib.json "$DEPLOY_DIR/$JS_DIR/"
cp js/scilib-integration.js "$DEPLOY_DIR/$JS_DIR/"

# Adjust permissions for the deployed files
echo "Setting permissions for deployed files"
chmod -R 755 "$DEPLOY_DIR"

# Test if files were deployed successfully
if [ -f "$DEPLOY_DIR/$HTML_FILE" ] && [ -f "$DEPLOY_DIR/$JS_DIR/demo.js" ] && [ -f "$DEPLOY_DIR/$JS_DIR/scilib.json" ] && [ -f "$DEPLOY_DIR/$JS_DIR/scilib-integration.js" ]; then
    echo "Files deployed successfully to $DEPLOY_DIR"
else
    echo "Error: Some files failed to deploy."
    exit 1
fi

# Restart web server to apply changes (assuming Apache here, modify for your web server)
echo "Restarting web server"
service apache2 restart

# Output access information
echo "Deployment complete. Access the demo at the following URL:"
echo "https://aimtyaem.github.io/aton4st/demo.html"