"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const authJwt_1 = require("../middlewares/authJwt");
const postValidators_1 = require("../validators/postValidators");
const router = (0, express_1.Router)();
router.post('/create', postValidators_1.categoryCreateValidator, authJwt_1.isAdmin, category_controller_1.categoryCreate);
exports.default = router;
