import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, LogOut, Plus, Lock, Eye, EyeOff, Trash2, FileText, Key } from 'lucide-react';
const API_BASE = import.meta.env.VITE_API_URL;

export default function Vault() {
    const { user, signOut } = useAuth();
    const [vaultItems, setVaultItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [visibleSecrets, setVisibleSecrets] = useState({});
    const [newItem, setNewItem] = useState({ title: '', username: '', password: '', notes: '' });
    const [error, setError] = useState('');

    // Fetch items on mount
    useEffect(() => {
        fetchVaultItems();
    }, []);

    const fetchVaultItems = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/vault`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                throw new Error(`Expected JSON but got: ${text.slice(0, 200)}...`);
            }

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to fetch vault items');
            }

            const data = await res.json();
            setVaultItems(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addVaultItem = async (e) => {
        e.preventDefault();
        // **BUG FIX: Save the unencrypted password locally before sending for encryption**
        const unencryptedPassword = newItem.password;

        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/vault`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newItem),
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                throw new Error(`Expected JSON but got: ${text.slice(0, 200)}...`);
            }

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to add item');
            }

            const createdItem = await res.json();

            // Store the item received from the server, but OVERWRITE its password 
            // field with the original unencrypted one from the form submission (newItem.password).
            // This allows the frontend to toggle its visibility immediately without a new fetch.
            const itemWithLocalPassword = { ...createdItem, password: unencryptedPassword };

            setVaultItems([itemWithLocalPassword, ...vaultItems]);
            setNewItem({ title: '', username: '', password: '', notes: '' });
            setShowAddModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteVaultItem = async (id) => {
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/vault/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to delete item');
                } else {
                    const text = await res.text();
                    throw new Error(`Failed to delete item: ${text.slice(0, 200)}...`);
                }
            }

            setVaultItems(vaultItems.filter((item) => item._id !== id));
            setVisibleSecrets((prev) => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleSecretVisibility = (id) => {
        setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <div className="absolute top-40 left-40 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 right-40 w-96 h-96 bg-yellow-600 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                {/* Navbar */}
                <nav className="bg-black/40 backdrop-blur-xl border-b border-yellow-900/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <Shield className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" strokeWidth={1.5} />
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                    SECURE VAULT
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-400 text-sm">{user?.email}</span>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg border border-red-600/30 transition-all duration-300 hover:border-red-600/60"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Your Secured Items</h2>
                            <p className="text-gray-400">Encrypted and protected by Gotham-grade security</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold rounded-lg shadow-lg shadow-yellow-900/50 hover:shadow-yellow-900/70 transform transition-all duration-300 hover:scale-[1.05]"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Item</span>
                        </button>
                    </div>

                    {error && <div className="text-red-400 mb-4">{error}</div>}

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-12 h-12 border-t-4 border-yellow-500 rounded-full animate-spin"></div>
                        </div>
                    ) : vaultItems.length === 0 ? (
                        <div className="text-center py-16">
                            <Lock className="w-24 h-24 text-yellow-600/30 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">Your vault is empty</h3>
                            <p className="text-gray-500">Add your first secure item to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vaultItems.map((item) => (
                                <div key={item._id} className="bg-black/60 backdrop-blur-xl border border-yellow-900/30 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:border-yellow-600/50 hover:shadow-xl hover:shadow-yellow-900/20">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-yellow-600/20 rounded-lg">
                                                <Key className="w-5 h-5 text-yellow-500" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                        </div>
                                        <button onClick={() => deleteVaultItem(item._id)} className="text-red-400 hover:text-red-300 transition-colors duration-200">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Username</label>
                                            <p className="text-gray-200 font-mono text-sm mt-1">{item.username}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Password</label>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <p className="text-gray-200 font-mono text-sm flex-1">
                                                    {visibleSecrets[item._id] ? item.password : '••••••••••••'}
                                                </p>
                                                <button onClick={() => toggleSecretVisibility(item._id)} className="text-yellow-500 hover:text-yellow-400 transition-colors duration-200">
                                                    {visibleSecrets[item._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {item.notes && (
                                            <div>
                                                <label className="text-xs text-gray-500 uppercase tracking-wide flex items-center space-x-1">
                                                    <FileText className="w-3 h-3" />
                                                    <span>Notes</span>
                                                </label>
                                                <p className="text-gray-400 text-sm mt-1">{item.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-800">
                                        <p className="text-xs text-gray-600">
                                            Added {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* Add Item Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-black/90 backdrop-blur-xl border border-yellow-900/30 rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 animate-slideUp">
                            <h3 className="text-2xl font-bold text-white mb-6">Add Secure Item</h3>
                            <form onSubmit={addVaultItem} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                    <input type="text" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} required className="w-full px-4 py-2 bg-gray-900/50 border border-yellow-900/30 rounded-lg text-white focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all duration-300" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                                    <input type="text" value={newItem.username} onChange={(e) => setNewItem({ ...newItem, username: e.target.value })} required className="w-full px-4 py-2 bg-gray-900/50 border border-yellow-900/30 rounded-lg text-white focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all duration-300" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                                    <input type="password" value={newItem.password} onChange={(e) => setNewItem({ ...newItem, password: e.target.value })} required className="w-full px-4 py-2 bg-gray-900/50 border border-yellow-900/30 rounded-lg text-white focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all duration-300" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Notes (optional)</label>
                                    <textarea value={newItem.notes} onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })} rows={3} className="w-full px-4 py-2 bg-gray-900/50 border border-yellow-900/30 rounded-lg text-white focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all duration-300" />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all duration-300">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold rounded-lg shadow-lg shadow-yellow-900/50 transition-all duration-300">Add Item</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
