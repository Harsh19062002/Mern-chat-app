import express from 'express';
import { protectedRoute } from "../middleware/authmiddleware.js";
import { getUser, getMessages, sendMessage } from "../controllers/messagecontroller.js";

const messageRouter = express.Router();

messageRouter.get("/user", protectedRoute, getUser);
messageRouter.get("/:id", protectedRoute, getMessages);

messageRouter.post("/send/:id", protectedRoute,sendMessage);




export default messageRouter;