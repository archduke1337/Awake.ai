import express from 'express';
import { apiRouter } from '../server/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount API routes under /api
app.use('/api', apiRouter);

export default app;
