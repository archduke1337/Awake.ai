import express from 'express';
// Import the TypeScript API entry. Run this file with `npx tsx dev-api-runner.mjs`
import app from './api/index.ts';

const server = express();
server.use(app);

const port = process.env.PORT || 5173;
server.listen(port, () => {
  console.log(`dev-api-runner listening on http://localhost:${port}`);
});
