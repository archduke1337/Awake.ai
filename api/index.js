// Vercel API handler for AWAKE
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Import your server components
// Import the server routes TypeScript source. Vercel's Node builder will
// transpile TypeScript when bundling serverless functions. Using the .ts
// import here ensures the builder can find and compile the module.
import { registerRoutes } from '../server/routes.ts';

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
let _initialized = false;
let _initPromise = null;

async function ensureInitialized() {
	if (_initialized) return;
	if (_initPromise) return _initPromise;

	_initPromise = (async () => {
		try {
			await registerRoutes(app);
			_initialized = true;
		} catch (err) {
			// Re-throw so Vercel logs the error and the function fails clearly.
			console.error('Failed to initialize API routes:', err);
			throw err;
		}
	})();

	return _initPromise;
}

// Export a request handler the Vercel Node builder can call. It will
// initialize routes once, then forward all requests to the Express app.
export default async function handler(req, res) {
	await ensureInitialized();
	return app(req, res);
}