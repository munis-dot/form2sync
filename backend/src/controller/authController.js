import User from '../models/UserSchema.js';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'form2sync';

export const sendOtp = async (req, res) => {
    const { phone } = req.body;
    console.log(`Send OTP: received phone number ${phone}`);

    try {
        // Generate a custom token using Firebase Admin SDK
        const customToken = await admin.auth().createCustomToken(phone);
        console.log(customToken);
        // Use custom token to sign in and send OTP
        const signInResponse = await getAuth().signInWithPhoneNumber(phone, customToken);

        // Store verificationId (for demonstration, normally you wouldn't log this)
        console.log(`Verification ID: ${signInResponse.verificationId}`);

        res.status(200).json({ message: 'OTP sent successfully', verificationId: signInResponse.verificationId });
    } catch (error) {
        console.log(`Error sending OTP: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;
    try {
        const verification = await admin.auth().verifyIdToken(otp);
        if (verification.phone_number === phone) {
            let user = await User.findOne({ phone });
            if (!user) {
                user = new User({ phone, otpVerified: true });
                await user.save();
            }
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Signup (Register)
export const signup = async (req, res) => {
    const { type, kisanId, userName, address, phone, password, farmName } = req.body;

    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (type === 'farmer' && !kisanId) {
        return res.status(400).json({ message: 'kisanId is required for former type users' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            type,
            kisanId: type === 'farmer' ? kisanId : undefined,
            userName,
            address,
            farmName: type === 'farmer' ? farmName : '',
            phone,
            password: hashedPassword, // Store hashed password
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.errorResponse.errmsg });
    }
};

// Login
export const login = async (req, res) => {
    const { phone, password } = req.body;
    console.log(req.body)
    if (!phone || !password) {
        return res.status(400).json({ message: 'Phone and password are required' });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log(user)
        const { type, userName, _id, farmName } = user;
        // Generate JWT token
        const token = jwt.sign({ type, userName, phone: user.phone, _id, farmName }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

