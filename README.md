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
- Push this folder to a new GitHub repository.
- Create a new Web Service on Render, connect your repo, and set the start command to `npm start`.
- The socket server will be available at `https://your-app-name.onrender.com`.
