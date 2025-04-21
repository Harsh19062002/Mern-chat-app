import express from "express";
import { login, logout, signup,updateProfile,checkAuth } from "../controllers/usercontroller.js";
import { protectedRoute } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post('/signup',signup);
router.post("/login",login);
router.post("/logout",logout);

router.put("/update",protectedRoute,updateProfile);
router.get("/check",protectedRoute,checkAuth)


export default router;