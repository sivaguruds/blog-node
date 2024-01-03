import { Router } from 'express';
import { categoryCreate, categoryDelete, categoryGetAll, categoryUpdate } from '../controllers/category.controller';
import { isAdmin, verifyToken } from '../middlewares/authJwt';
import { categoryCreateValidator } from '../validators/postValidators';

const router = Router();

router.get('', verifyToken, isAdmin, categoryGetAll);
router.post('/create', categoryCreateValidator, verifyToken, isAdmin, categoryCreate);
router.patch('/:id', categoryCreateValidator, verifyToken, isAdmin, categoryUpdate);
router.delete('/:id', verifyToken, isAdmin, categoryDelete);

export default router;
