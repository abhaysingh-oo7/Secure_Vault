import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Shield, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const data = await (isLogin
                ? signIn(email, password)
                : signUp(email, password)
            );

            if (data.token) {
                setError("");
                setSuccess("Login successful! Redirecting...");
                setTimeout(() => navigate("/vault"), 800);
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-black/60 backdrop-blur-xl border border-yellow-900/30 rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="flex justify-center mb-8 animate-pulse">
                        <Shield className="w-20 h-20 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" strokeWidth={1.5} />
                    </div>

                    <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        SECURE VAULT
                    </h1>
                    <p className="text-center text-gray-400 mb-8 text-sm tracking-wide">
                        CLASSIFIED ACCESS ONLY
                    </p>

                    <div className="flex mb-6 bg-gray-900/50 rounded-lg p-1 border border-yellow-900/20">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 font-medium ${
                                isLogin
                                    ? "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg shadow-yellow-900/50"
                                    : "text-gray-400 hover:text-gray-200"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 font-medium ${
                                !isLogin
                                    ? "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg shadow-yellow-900/50"
                                    : "text-gray-400 hover:text-gray-200"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-600 w-5 h-5 transition-all duration-300 group-focus-within:text-yellow-400" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-yellow-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all duration-300"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-600 w-5 h-5 transition-all duration-300 group-focus-within:text-yellow-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-yellow-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all duration-300"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-900/20 border border-red-600/50 text-red-400 px-4 py-3 rounded-lg text-sm animate-shake">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-900/20 border border-green-600/50 text-green-400 px-4 py-3 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold rounded-lg shadow-lg shadow-yellow-900/50 hover:shadow-yellow-900/70 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                    Processing...
                                </span>
                            ) : (
                                <span>{isLogin ? "ACCESS VAULT" : "CREATE ACCESS"}</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
