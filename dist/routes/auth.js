"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authJwt_1 = require("../middlewares/authJwt");
const userValidators_1 = require("../validators/userValidators");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - mobile
 *         - email
 *         - password
 *         - role
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         firstName:
 *           type: string
 *           description: The user first name
 *         lastName:
 *           type: string
 *           description: The user last name
 *         mobile:
 *           type: string
 *           description: The user mobile
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *            type: string
 *            description: The user password
 *            format: password
 *            minLength: 8
 *         role:
 *            type: string
 *            description: The user role
 *            enum: ['admin', 'viewer']
 *         status:
 *           type: boolean
 *           description: The user status
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the user was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the user was updated
 *       example:
 *         id: d5fE_asz
 *         firstName: Dewdney
 *         lastName: Alexander K. Dewdney
 *         email: C0eJt@example.com
 *         mobile: 1234567890
 *         password: Admin@123
 *         role: admin
 *         status: true
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
 */
/**
 * @swagger
 * tags:
 *   name: User
 *   description: New user API
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  mobile:
 *                      type: string
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *                  role:
 *                      type: string
 *                  status:
 *                      type: boolean
 *     responses:
 *       200:
 *         description: Successfully Registered the account!.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: test response
 *       400:
 *         description: Registration Failed! Please try again
 */
router.post('/register', userValidators_1.userCreateValidator, auth_controller_1.register);
router.post('/login', userValidators_1.userLoginValidator, auth_controller_1.login);
router.post('/refresh-token', auth_controller_1.refreshToken);
router.post('/forgot-password', auth_controller_1.forgotPassword);
router.post('/reset-password', auth_controller_1.resetPassword);
router.get('/admin', authJwt_1.verifyToken, authJwt_1.isAdmin, auth_controller_1.adminBoard);
router.get('/viewer', authJwt_1.verifyToken, authJwt_1.isUser, auth_controller_1.viewerBoard);
exports.default = router;
