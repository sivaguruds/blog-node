import { Router } from 'express';
import { postCategoryCount } from '../controllers/category.controller';
import { categoryByPost, postCreate, postDelete, postDetails, postGetAll, postUpdate } from '../controllers/post.controller';
import { commentCreate } from '../controllers/post_comment.controller';
import { postLike, userLikePost } from '../controllers/post_like.controller';
import { isAdmin, isUser, verifyToken } from '../middlewares/authJwt';
import { postCommentValidator, postCreateValidator, postParamsValidator, postQueryValidator } from '../validators/postValidators';

const router = Router();

router.get('/count', verifyToken, isUser, postCategoryCount);
router.patch('/like', verifyToken, isUser, postLike);
router.get('/like/:id', verifyToken, isUser, userLikePost);
router.post('', postCreateValidator, verifyToken, isAdmin, postCreate);
router.get('/all', verifyToken, postGetAll);
router.patch('/:id', postCreateValidator, verifyToken, isAdmin, postUpdate);
router.delete('/:id', postParamsValidator, verifyToken, isAdmin, postDelete);
router.get('/:id', postParamsValidator, verifyToken, postDetails);
router.get('', verifyToken, isAdmin, categoryByPost);
router.post('/comment', postCommentValidator, verifyToken, isUser, commentCreate);

export default router;
