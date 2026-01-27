const { Router } = require("express");
const AuthController = require("../controllers/auth.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");

const authRouter = Router();

authRouter.post("/login", AuthMiddleware.ValidateLoginUser, AuthController.LoginUser);

authRouter.post("/register", AuthMiddleware.ValidateRegisterUser, AuthController.RegisterUser);

authRouter.post("/logout", AuthController.LogoutUser);

module.exports = authRouter;