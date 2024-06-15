import { Router } from "express";
import { addContact, getUsers } from "../controllers/users.controller.js";

const router = Router()

router.get('/users', getUsers);
router.post('/add-contact', addContact);

export default router;