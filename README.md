# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


🚀 Key Features
📄 PDF Expert 
Merge PDF: Combine multiple files into one.

Split PDF: Separate pages into individual files.

Compress PDF: Reduce file size while maintaining quality.

Secure Lock: Password-protect your sensitive documents.

Convert: Extract data to Word (.doc) and Excel (.csv) formats.

🖼️ Image Utilities
Bulk Converter: Simultaneously convert multiple images (JPG, PNG, WEBP).

Background Remover: AI-powered background removal.

Compression: Fast image optimization for web performance.

🔗 Developer & Generator Tools
Smart QR Generator: Create custom QR codes with dynamic filenames and real-time preview.

UUID Generator: Generate unique identifiers instantly.

🛠️ Technical Stack
Frontend: React.js

Libraries: pdf-lib, jszip, qrcode.react, file-saver, pdfjs-dist.

Deployment: Vercel (CI/CD integrated).

Processing: Entirely client-side for maximum security and privacy.


1. Clone the Repository

git clone https://github.com/your-username/quicktool.git
cd quicktool

2. Install Dependencies
npm install

3. Start Development Server
npm start
The application will open at http://localhost:3000.

4. Build for Production
npm run build

⚠️ Deployment Note
When deploying to Vercel, ensure you set the following environment variable to avoid build failures due to lint warnings:

Key: CI

Value: false