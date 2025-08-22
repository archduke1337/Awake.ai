// Vercel API handler for AWAKE
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Import your server components
// Import the server routes TypeScript source. Vercel's Node builder will
// transpile TypeScript when bundling serverless functions. Using the .ts
// import here ensures the builder can find and compile the module.
// Static import so Vercel's bundler includes server files.
import { apiRouter } from '../server/routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Lazy initialize routes to avoid top-level await errors during module
// evaluation on serverless platforms (Vercel). This ensures the function
// doesn't crash if an env var is missing or if compilation/transpilation
// happens during the build phase.
// Mount the router at module initialization so the function handler is small
// and Vercel's bundler includes all referenced files.
try {
	app.use('/api', apiRouter);
} catch (err) {
	console.error('Error mounting apiRouter:', err);
}

// Export a request handler the Vercel Node builder can call. It will
// initialize routes once, then forward all requests to the Express app.
export default function handler(req, res) {
	try {
		return app(req, res);
	} catch (err) {
		console.error('API handler error:', err);
		res.statusCode = 500;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ message: 'Internal Server Error', error: (err && err.message) || String(err) }));
	}
}