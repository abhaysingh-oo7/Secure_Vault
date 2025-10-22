import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

// API helpers with error handling now throw on failure
async function fetchVaultItems(token) {
    const res = await fetch('http://localhost:5000/api/vault', {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Error fetching vault items: ${res.status}`);
    return await res.json();
}

async function addVaultItem(item, token) {
    const res = await fetch('http://localhost:5000/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(`Error adding item: ${res.status}`);
    return await res.json();
}

async function deleteVaultItem(id, token) {
    const res = await fetch(`http://localhost:5000/api/vault/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Error deleting item: ${res.status}`);
    return await res.json();
}

export default function Vault() {
    const { user, signOut } = useAuth();
    const [vaultItems, setVaultItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ title: '', username: '', password: '', notes: '' });
    const [error, setError] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchVaultItems(token)
            .then((data) => setVaultItems(Array.isArray(data) ? data : []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError('');
        setAdding(true);
        const token = localStorage.getItem('token');
        try {
            const created = await addVaultItem(newItem, token);
            if (created && created._id) {
                setVaultItems([...vaultItems, created]);
                setNewItem({ title: '', username: '', password: '', notes: '' });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id) => {
        setError('');
        const token = localStorage.getItem('token');
        try {
            await deleteVaultItem(id, token);
            setVaultItems(vaultItems.filter((item) => item._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const confirmSignOut = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            signOut();
        }
    };

    return (
        <div className="vault">
            <h2>Welcome, {user?.email}!</h2>
            <button onClick={confirmSignOut}>Sign Out</button>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            <form onSubmit={handleAdd}>
                <input
                    type="text"
                    placeholder="Title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={newItem.username}
                    onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newItem.password}
                    onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                />
                <button type="submit" disabled={adding}>
                    {adding ? 'Adding...' : 'Add Item'}
                </button>
            </form>

            {loading ? (
                <p>Loading vault items...</p>
            ) : vaultItems.length === 0 ? (
                <p>No items yet</p>
            ) : (
                <div className="vault-items">
                    {vaultItems.map((item) => (
                        <div key={item._id} className="vault-item">
                            <h3>{item.title}</h3>
                            <p>Username: {item.username}</p>
                            <p>Password: {item.password}</p>
                            <p>Notes: {item.notes}</p>
                            <button onClick={() => handleDelete(item._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
