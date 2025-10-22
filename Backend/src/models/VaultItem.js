const mongoose = require('mongoose');

const vaultItemSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        notes: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('VaultItem', vaultItemSchema);
