import express from 'express';
import { getUser , AddRemovefriend } from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/users' , getUser);
router.get('/friendaction' , AddRemovefriend);

export default router ;