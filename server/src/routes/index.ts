import { Router } from 'express';
import healthRouter from './health.js';
import athletesRouter from './athletes.js';
import resultsRouter from './results.js';
import eventsRouter from './events.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/athletes', athletesRouter);
router.use('/results', resultsRouter);
router.use('/events', eventsRouter);

export default router;
