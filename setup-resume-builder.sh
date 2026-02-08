#!/bin/bash

# Resume Builder Setup Script
# This script installs the necessary dependencies for the resume builder

echo "🚀 Installing Resume Builder Dependencies..."
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Installing pdfmake package..."
npm install pdfmake

echo ""
echo "📦 Installing @types/pdfmake package..."
npm install --save-dev @types/pdfmake

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "📝 Next Steps:"
echo "1. Update angular.json with pdfmake scripts (see RESUME_BUILDER_GUIDE.md)"
echo "2. Restart your development server: ng serve"
echo "3. Navigate to Profile page and test the Resume Builder"
echo ""
echo "🎉 Setup complete! Your resume builder is ready to use."
