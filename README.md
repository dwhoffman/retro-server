# retro-server

A minimal socket.io server for real-time retro board updates.

## Usage

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   npm start
   ```

The server will listen on the port specified by the `PORT` environment variable (default: 10000).

## Deploy to Render

### Automatic Deployment (Recommended)

This repository is configured for automatic deployment to Render using the included `render.yaml` file.

#### Setup Steps:

1. **Push to GitHub:**
   ```sh
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/retro-server.git
   git push -u origin main
   ```

2. **Connect to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file and configure the service

3. **Automatic Updates:**
   - Any push to the `main` branch will automatically trigger a new deployment
   - The service will be available at `https://your-app-name.onrender.com`

### Manual Deployment (Alternative)

If you prefer manual setup:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
4. The service will auto-deploy on git pushes

## Environment Variables

The server automatically uses the `PORT` environment variable provided by Render. No additional configuration needed.

## CORS Configuration

The server is configured to accept connections from any origin (`origin: "*"`). For production use, consider restricting this to your specific frontend domain.
