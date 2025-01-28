import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import serviceAccount from './form2sync-firebase-adminsdk-fbsvc-4c086af80e.json' assert { type: 'json' };
import { router } from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Firebase Admin SDK initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(session({ secret: 'form2sync', resave: false, saveUninitialized: true }));

// Middleware
app.use(bodyParser.json());
app.use('/', router);

app.get('/', (req, res) => { res.send('Hello, World!'); });

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/form2sync', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


export default app;