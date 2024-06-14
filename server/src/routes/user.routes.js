import express from 'express';
import { getUser, AddRemoveFriend, getFriendlist, GetUserId } from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/users', getUser);
router.get('/friends', getFriendlist);
router.get('/userid', GetUserId);
router.post('/friendaction', AddRemoveFriend);

export default router;