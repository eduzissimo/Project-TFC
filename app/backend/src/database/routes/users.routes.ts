import { Router } from 'express';
import AuthMiddleware from '../../middlewares/authentication.middleware';
import UsersController from '../controllers/users.controller';

const usersController = new UsersController();

const router = Router();

router.post('/login', (req, res) => usersController.login(req, res));
router.get('/role', AuthMiddleware.tokenHandler, (req, res) => usersController.getRole(req, res));

export default router;
