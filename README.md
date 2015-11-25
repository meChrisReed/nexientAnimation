
# Installation:
```
npm install
```

# Run Development Server:
```
npm start
```
To start up a development server.
Since this application is not yet immutable. Hot loading only works in the render cycle.

# Run AMD Package Deployment:
```
npm run deploy
```

# Usage:
To load this module. Target ``` /dist/bundle.js ``` with an AMD require.
From there you can run the ``` initialize ``` method to set up the canvas.
You also have access to the ``` makeWind ``` method to simulate wind in the particle field.
