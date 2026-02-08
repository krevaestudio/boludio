import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Register() {
    // Estados para capturar la info
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // Estos metadatos son los que el TRIGGER de SQL 
                    // va a agarrar para crear tu perfil automáticamente
                    data: {
                        username: username.toLowerCase().trim(),
                        full_name: fullName.trim(),
                    }
                }
            });

            if (error) throw error;

            alert("¡Chequeá tu mail! Te mandamos un link para confirmar.");
            navigate('/login');

        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-azul flex items-center justify-center p-4 selection:bg-celeste selection:text-dark-azul">
            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-10 rounded-md shadow-2xl">
                
                {/* Header */}
               <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-celeste tracking-tighter">
                        bolud<span className="text-yellow-400">.</span><span className="text-white">io</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                        Registrate, no seas boludo.
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Nombre Full */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-4">Nombre Completo</label>
                        <input 
                            required
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Pepe Piñero"
                            className="w-full bg-dark-azul border border-slate-800 rounded-md px-5 py-3 text-white text-sm focus:outline-none focus:border-celeste/50 transition-all placeholder:text-slate-700"
                        />
                    </div>

                    {/* Username con el & creativo */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-4">Username</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-celeste font-mono font-bold">&</span>
                            <input 
                                required
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="tu_usuario"
                                className="w-full bg-dark-azul border border-slate-800 rounded-md pl-10 pr-5 py-3 text-white text-sm focus:outline-none focus:border-celeste/50 transition-all placeholder:text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-4">Email</label>
                        <input 
                            required
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full bg-dark-azul border border-slate-800 rounded-md px-5 py-3 text-white text-sm focus:outline-none focus:border-celeste/50 transition-all placeholder:text-slate-700"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-4">Contraseña</label>
                        <input 
                            required
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-dark-azul border border-slate-800 rounded-md px-5 py-3 text-white text-sm focus:outline-none focus:border-celeste/50 transition-all placeholder:text-slate-700"
                        />
                    </div>

                    {/* Botón */}
                    <button 
                        disabled={loading}
                        type="submit"
                        className="cursor-pointer w-full bg-celeste text-dark-azul font-black py-4 rounded-md hover:bg-white transition-all active:scale-95 shadow-[0_0_20px_rgba(116,172,223,0.3)] disabled:opacity-50 disabled:cursor-wait"
                    >
                        {loading ? 'POSTULANDO BOLUDO...' : 'AHRE GISTRARSE'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-xs font-medium">
                        ¿Ya sos parte? <Link to="/login" className="text-celeste font-bold hover:underline">Entrá por acá</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}