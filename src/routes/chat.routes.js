import { Router } from "express";
import { getInbox, getMessages, sendMessage } from '../controllers/chat.controller.js';
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get('/buzon', authRequired, getInbox);
router.get('/messages/:receiverId', authRequired, getMessages);
router.post('/messages', authRequired, sendMessage);

export default router;
