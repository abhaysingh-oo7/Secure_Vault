const mongoose = require('mongoose');

const vaultItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    iv: { type: [Number], required: true },           // Encryption IV
    ciphertext: { type: [Number], required: true },   // Encrypted password
    username: { type: String, required: true },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('VaultItem', vaultItemSchema);
