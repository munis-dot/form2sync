import User from '../models/UserSchema.js';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

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

export const signup = async (req, res) => {
    const { type, kishanId, name, address, phone } = req.body;

    if (type === 'former' && !kishanId) {
        return res.status(400).json({ message: 'kishanId is required for former type users' });
    }

    try {
        const newUser = new User({
            type,
            kishanId: type === 'former' ? kishanId : undefined, // Only set kishanId for former type users
            name,
            address,
            phone
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
