# Face Talk - Professional Video Chat

A modern, responsive video chat application built with Node.js, Socket.IO, and WebRTC.

## Features

- 🎥 Real-time video chat with WebRTC
- 📱 Responsive design for all devices
- 👥 Dynamic layout for multiple participants
- 🎨 Professional UI with modern design
- 🔄 Automatic layout adjustment based on user count

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open http://localhost:3000 in your browser

## Deployment

### Option 1: Render (Recommended)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: face-talk
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click "Create Web Service"

### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy automatically

### Option 3: Heroku

1. Install Heroku CLI
2. Run:
```bash
heroku create your-app-name
git push heroku main
```

## Environment Variables

No environment variables required for basic functionality.

## Technologies Used

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript
- **Real-time**: WebRTC, Socket.IO
- **Styling**: CSS Grid, Flexbox, Glass Morphism

## License

MIT 