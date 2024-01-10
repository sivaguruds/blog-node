import { Router } from 'express';
import { categoryCreate, categoryDelete, categoryGetAll, categoryUpdate } from '../controllers/category.controller';
import { isAdmin, verifyToken } from '../middlewares/authJwt';
import { categoryCreateValidator } from '../validators/postValidators';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The category name
 *         description:
 *           type: string
 *           description: the category description
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the category was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the category was updated
 *       example:
 *         id: d5fE_asz
 *         name: computer
 *         description: laptop
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category API
 * /category/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                  name:
 *                      type: string
 *                  description:
 *                      type: string
 *     responses:
 *       200:
 *         description: Successfully category created!.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: test response
 *       400:
 *         description: Something went wrong!
 */

router.get('', verifyToken, isAdmin, categoryGetAll);
router.post('', categoryCreateValidator, verifyToken, isAdmin, categoryCreate);
router.patch('/:id', categoryCreateValidator, verifyToken, isAdmin, categoryUpdate);
router.delete('/:id', verifyToken, isAdmin, categoryDelete);

export default router;
