import express from "express";
import {
	login,
	refresh,
	logout,
	signup,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refresh);
router.get("/logout", logout);

export default router;
