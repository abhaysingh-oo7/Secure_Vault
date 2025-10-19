import { useState, useEffect } from 'react';

export default function Vault() {
    const [vaultItems, setVaultItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [visibleSecrets, setVisibleSecrets] = useState({});
    const [newItem, setNewItem] = useState({
        title: '',
        username: '',
        password: '',
        notes: '',
    });

    useEffect(() => {
        fetchVaultItems();
    }, []);

    const fetchVaultItems = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/vault', {
                headers: {
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`, // if using JWT
                }
            });
            const data = await response.json();
            setVaultItems(data);
        } catch (error) {
            console.error('Error fetching vault items:', error);
        } finally {
            setLoading(false);
        }
    };

    const addVaultItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/vault', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (!response.ok) throw new Error('Failed to add item');
            setNewItem({ title: '', username: '', password: '', notes: '' });
            setShowAddModal(false);
            fetchVaultItems();
        } catch (error) {
            console.error('Error adding vault item:', error);
        }
    };

    const deleteVaultItem = async (id) => {
        try {
            const response = await fetch(`/api/vault/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete item');
            fetchVaultItems();
        } catch (error) {
            console.error('Error deleting vault item:', error);
        }
    };

}
