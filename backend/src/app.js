import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session'; // Import session middleware
import admin from 'firebase-admin';
import serviceAccount from './form2sync-firebase-adminsdk-fbsvc-4c086af80e.json' assert { type: 'json' };
import { router } from './routes/routes.js';
import path from 'path'
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import Message from './models/MessageSchema.js';
import http from 'http';
import cors from 'cors'
const app = express();

// Firebase Admin SDK initialization
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK initialized');
} catch (error) {
  console.error('Firebase Admin SDK initialization error:', error);
}
app.use(cors())
// Session middleware
app.use(
  session({
    secret: 'form2sync',
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware
app.use(bodyParser.json());
app.use('/', router);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 


app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Update with frontend URL in production
  }
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('register', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on('send_message', async ({ senderId, recipientId, content }) => {
    const message = await Message.create({ senderId, recipientId, content });
    console.log(message)
    const recipientSocket = connectedUsers.get(recipientId);
    if (recipientSocket) {
      io.to(recipientSocket).emit('receive_message', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    for (let [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// MongoDB connection
mongoose
  .connect('mongodb://127.0.0.1:27017/form2sync', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


export default app;