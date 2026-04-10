import {Router} from 'express'
import {findNearbyWorkers} from '../controllers/worker.controller.js'

const router = Router();

router.post('/nearby', findNearbyWorkers);

export default router;

