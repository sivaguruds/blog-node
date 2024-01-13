import { Router } from 'express';
import { postCreate, postDelete, postDetails, postGetAll, postUpdate } from '../controllers/post.controller';
import { isAdmin, verifyToken } from '../middlewares/authJwt';
import { postCreateValidator, postParamsValidator, postQueryValidator } from '../validators/postValidators';

const router = Router();

router.post('', postCreateValidator, verifyToken, isAdmin, postCreate);
router.get('', postQueryValidator, verifyToken, isAdmin, postGetAll);
router.patch('/:id', postCreateValidator, verifyToken, isAdmin, postUpdate);
router.delete('/:id', postParamsValidator, verifyToken, isAdmin, postDelete);
router.get('/:id', postParamsValidator, verifyToken, isAdmin, postDetails);

export default router;
