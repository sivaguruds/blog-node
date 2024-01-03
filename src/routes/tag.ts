import { Router } from 'express';
import { tagCreate, tagDelete, tagGetAll, tagUpdate } from '../controllers/tag.controller';
import { isAdmin, verifyToken } from '../middlewares/authJwt';
import { tagCreateValidator } from '../validators/postValidators';

const router = Router();

router.get('', verifyToken, isAdmin, tagGetAll);
router.post('/create', tagCreateValidator, verifyToken, isAdmin, tagCreate);
router.patch('/:id', tagCreateValidator, verifyToken, isAdmin, tagUpdate);
router.delete('/:id', verifyToken, isAdmin, tagDelete);

export default router;
