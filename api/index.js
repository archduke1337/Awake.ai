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

// Register your API routes
await registerRoutes(app);

// Export for Vercel
export default app;