import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';

const leaderboardController = new LeaderboardController();

const router = Router();

router.get('/home', (req, res) => leaderboardController.getAllDataLeaderboard(req, res));

export default router;
