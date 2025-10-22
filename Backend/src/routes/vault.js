const express = require('express');
const jwt = require('jsonwebtoken');
const VaultItem = require('../models/VaultItem');
const router = express.Router();

// JWT middleware
function verifyAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // attach userId for later use
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

// GET all vault items for the user
router.get('/', verifyAuth, async (req, res) => {
    try {
        const items = await VaultItem.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error('GET vault error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create new vault item
router.post('/', verifyAuth, async (req, res) => {
    try {
        const { title, username, password, notes } = req.body;

        if (!title || !username || !password) {
            return res.status(400).json({ message: 'Title, username, and password are required' });
        }

        const newItem = await VaultItem.create({
            userId: req.userId,
            title,
            username,
            password,
            notes: notes || '',
        });

        res.status(201).json(newItem);
    } catch (err) {
        console.error('POST vault error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE a vault item by ID
router.delete('/:id', verifyAuth, async (req, res) => {
    try {
        const deleted = await VaultItem.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!deleted) return res.status(404).json({ message: 'Item not found' });

        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('DELETE vault error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
