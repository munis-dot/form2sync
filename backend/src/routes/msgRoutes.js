import express from 'express';
import { getMessages, sendMsg, updateChatList, userList } from '../controller/chatController.js';

const msgRouter = express.Router();

msgRouter.get('/msg/:recipientId', getMessages)
msgRouter.get('/list/:id',userList)
msgRouter.post('/updateChat',updateChatList)
msgRouter.post('/sendMessage',sendMsg)

export default msgRouter;