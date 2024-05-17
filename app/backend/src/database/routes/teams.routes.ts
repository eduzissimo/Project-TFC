import { Router } from 'express';
import TeamsController from '../controllers/teams.controller';
import TeamsService from '../services/teams.service';

const teamsRouter = Router();
const serviceTeams = new TeamsService();
const teamsController = new TeamsController(serviceTeams);

teamsRouter.get('/', (req, res) => teamsController.getAllTeams(req, res));
teamsRouter.get('/:id', (req, res) => teamsController.getTeamsById(req, res));

export default teamsRouter;
