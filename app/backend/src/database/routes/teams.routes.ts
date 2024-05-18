import { Router } from 'express';
import TeamsController from '../controllers/teams.controller';

const teamsController = new TeamsController();

const router = Router();

router.get('/', (req, res) => teamsController.getAllTeams(req, res));
router.get('/:id', (req, res) => teamsController.getTeamsById(req, res));

export default router;
