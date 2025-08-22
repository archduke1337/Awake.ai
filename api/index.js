// Vercel API handler for AWAKE
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Import your server components
import { registerRoutes } from '../server/routes.js';

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