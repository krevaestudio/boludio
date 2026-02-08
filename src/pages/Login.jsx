import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Si todo sale bien, al inicio
            navigate('/');
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-azul flex items-center justify-center p-4 selection:bg-celeste selection:text-dark-azul">
            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-10 rounded-md shadow-2xl">
                
                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-celeste tracking-tighter">
                        bolud<span className="text-yellow-400">.</span><span className="text-white">io</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                        Volvé boludo, te estábamos esperando
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-4 text-left">Email</label>
                        <input 
                            required
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full bg-dark-azul border border-slate-800 rounded-md px-5 py-4 text-white text-sm focus:outline-none focus:border-celeste/50 transition-all placeholder:text-slate-700"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-4 text-left">Contraseña</label>
                        <input 
                            required
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-dark-azul border border-slate-800 rounded-md px-5 py-4 text-white text-sm focus:outline-none focus:border-celeste/50 transition-all placeholder:text-slate-700"
                        />
                    </div>

                    <button 
                        disabled={loading}
                        type="submit"
                        className="cursor-pointer w-full bg-celeste text-dark-azul font-black py-4 rounded-md hover:bg-white transition-all active:scale-95 shadow-[0_0_20px_rgba(116,172,223,0.3)] disabled:opacity-50"
                    >
                        {loading ? 'CONECTANDO...' : 'INGRESAR'}
                    </button>
                </form>

                {/* Footer del Card */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-slate-500 text-xs font-medium">
                        ¿No tenés cuenta? <Link to="/register" className="text-celeste font-bold hover:underline">Registrate acá, boludo</Link>
                    </p>
                    <Link to="/" className="cursor-pointer block text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:text-slate-400">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}