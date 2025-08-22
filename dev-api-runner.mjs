import express from 'express';
import app from './api/index.js';

const server = express();
server.use(app);

const port = process.env.PORT || 5173;
server.listen(port, () => {
  console.log(`dev-api-runner listening on http://localhost:${port}`);
});
