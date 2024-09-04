#!/bin/bash

# Define the directory containing your Lambda function code
SOURCE_DIR="Bottus"

# Define the name of the ZIP file
ZIP_FILE="lambda-deployment-package.zip"

# Remove any existing ZIP file to avoid appending to an old one
if [ -f "$ZIP_FILE" ]; then
    rm "$ZIP_FILE"
fi

# Create a ZIP file of the source directory
# -r: recursive, -q: quiet mode, -9: maximum compression
zip -r -q "$ZIP_FILE" "$SOURCE_DIR"

# Output the location of the ZIP file
echo "Created ZIP file: $ZIP_FILE"
