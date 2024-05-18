import { Router } from 'express';
import MatchesController from '../controllers/matches.controller';
import AuthMiddleware from '../../middlewares/authentication.middleware';

const matchesController = new MatchesController();

const router = Router();

router.get('/', (req, res) => matchesController.getAllMatches(req, res));
router.patch(
  '/:id/finish',
  AuthMiddleware.tokenHandler,
  (req, res) => matchesController.finishedMatches(req, res),
);
router.patch(
  '/:id',
  AuthMiddleware.tokenHandler,
  (req, res) => matchesController.updateGoals(req, res),
);
router.post(
  '/',
  AuthMiddleware.tokenHandler,
  (req, res) => matchesController.createMatches(req, res),
);

export default router;
