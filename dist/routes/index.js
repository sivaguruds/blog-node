"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
const defaultRoute = [
    {
        path: '/auth',
        route: auth_1.default,
    },
];
defaultRoute.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
