const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/auth');

router.get('/', (req, res) => {
	res.json({ message: 'Users route' });
});

// POST /api/users/create
router.post('/create', verifyToken, async (req, res) => {
	try {
		const { uid, email, fullName, phoneNumber } = req.body;

		if (!uid || !email || !fullName) {
			return res.status(400).json({ error: 'uid, email and fullName are required' });
		}

		const existing = await User.findOne({ uid });
		if (existing) {
			return res.status(409).json({ error: 'User already exists' });
		}

		const user = new User({ uid, email, fullName, phoneNumber });
		await user.save();

		return res.status(201).json({ success: true, user: { uid: user.uid, email: user.email, fullName: user.fullName, phoneNumber: user.phoneNumber, createdAt: user.createdAt } });
	} catch (err) {
		if (err.code === 11000) {
			return res.status(409).json({ error: 'User already exists' });
		}
		console.error('Error creating user:', err);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;

