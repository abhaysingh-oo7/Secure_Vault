const express = require('express');
const jwt = require('jsonwebtoken');
const VaultItem = require('../models/VaultItem');
const router = express.Router();

// Inline JWT middleware
function verifyAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach userId for next handlers
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

// GET all vault items for a user
router.get('/', verifyAuth, async (req, res) => {
    try {
        const items = await VaultItem.find({ userId: req.user.userId });
        res.json(items);
    } catch (err) {
        console.error('GET error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create new vault item
router.post('/', verifyAuth, async (req, res) => {
    try {
        const { title, username, password, notes } = req.body;
        const newItem = await VaultItem.create({
            userId: req.user.userId,
            title,
            username,
            password,
            notes,
        });
        res.status(201).json(newItem);
    } catch (err) {
        console.error('POST error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE vault item by ID
router.delete('/:id', verifyAuth, async (req, res) => {
    try {
        const deleted = await VaultItem.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId,
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('DELETE error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
