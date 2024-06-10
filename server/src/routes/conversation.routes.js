import express from 'express';
import { chats, chatmessages, groupchat ,gpmessages } from '../controllers/conversation.controllers.js';

const router = express.Router();

router.post('/chats' , chats);
router.post('/chatmessages' , chatmessages);
router.post('/groupchat' , groupchat );
router.post('/gpmessages' , gpmessages);


export default router ;