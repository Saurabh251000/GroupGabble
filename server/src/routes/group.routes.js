import express from 'express';
import { createGP, getGroups, updateGP, AddRemoveUser } from '../controllers/group.controllers.js';

const router = express.Router();

router.post('/create' , createGP);
router.get('/groups' , getGroups);
router.post('/updategroup' , updateGP);
router.post('/addremove' , AddRemoveUser);

export default router;