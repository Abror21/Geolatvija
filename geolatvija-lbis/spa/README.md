# Project Readme

## Environment Variables

Environment variables are read at runtime from `/public/runtime-config.js` file, therefore,
they should be specified in this file instead of an `.env` file.

### `/public/runtime-config.js` example
```javascript
window['runConfig'] = {
	nodeEnv: 'development',
	backendUrl: 'http://geo-backend:8080',
	frontendUrl: 'http://localhost:3000',
};
```

More information: https://dev.to/matt_catalfamo/runtime-configurations-with-react-22dl

### Environment setup
1. Copy contents of `/public/runtime-config.example.js` to `/public/runtime-config.js`
2. Modify the default values as necessary
3. Re-run
