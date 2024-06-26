import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { server, app } from './src/socket/socket.js';
import groupRouter from './src/routes/group.routes.js';
import authRouter from './src/routes/auth.routes.js';
import userRouter from './src/routes/user.routes.js';
import conversationRouter from './src/routes/conversation.routes.js';
import path from 'path';

const __dirname = path.resolve();

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://group-gabble-client.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(cors());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use('/conversation', conversationRouter);

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} \n http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error while connecting to MongoDB:', error.message);
    }
};

connect();



// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// io.on('connection', (socket) => {
//     console.log("User connected ");
//     console.log("id: ", socket.id);
//     socket.emit("welcome", "welcome");

//     socket.on('message', (msg) => {
//         console.log(msg);
//         socket.broadcast.emit('message', msg);
//     });

//     socket.on('disconnect', () => {
//         console.log("disconnected: ", socket.id);
//     });
// });

