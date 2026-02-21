import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/layout/Sidebar';

const PRESET_AVATARS = [
    '/avatares/avatar-1.png',
    '/avatares/avatar-2.png',
    '/avatares/avatar-3.png',
    '/avatares/avatar-4.png',
    '/avatares/avatar-5.png',
    '/avatares/avatar-6.png',
    '/avatares/avatar-7.png',
    '/avatares/avatar-8.png',
];

export default function Settings() {
    const { profile, loading: authLoading } = useAuth();
    
    // Estado inicial limpio
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        bio: '',
        country: '',
        avatar_url: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Sincronización a prueba de fallos
    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                username: profile.username || '',
                bio: profile.bio || '',
                country: profile.country || '',
                avatar_url: profile.avatar_url || ''
            });
        }
    }, [profile?.username]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            // 1. Validar si cambió el username
            if (formData.username !== profile.username) {
                // Chequear los 60 días
                const lastChange = new Date(profile.last_username_change);
                const now = new Date();
                const daysDiff = Math.floor((now - lastChange) / (1000 * 60 * 60 * 24));

                if (daysDiff < 60) {
                    throw new Error(`¡Pará un poco! Tenés que esperar ${60 - daysDiff} días más para cambiar el username.`);
                }

                // Chequear si el username ya existe
                const { data: existingUser } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', formData.username)
                    .maybeSingle();

                if (existingUser) throw new Error("Ese username ya está ocupado por otro boludo.");
                
                // Si pasa las pruebas, actualizamos la fecha de cambio
                formData.last_username_change = new Date().toISOString();
            }

            const { error } = await supabase
                .from('profiles')
                .update(formData)
                .eq('id', profile.id);

            if (error) throw error;
            setMessage({ text: '¡Perfil actualizado, fiera!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="p-20 text-center font-mono text-celeste italic">[ CARGANDO TUS BOLUDECES... ]</div>;

    return (
        <div className="flex w-full max-w-6xl flex-1">
            <Sidebar />
            <main className="flex-1 border-r border-slate-800 min-h-screen p-6 sm:p-10">
                <h1 className="text-3xl font-black text-white italic mb-8 uppercase tracking-tighter">
                    Ajustes <span className="text-celeste">de cuenta</span>
                </h1>

                <form onSubmit={handleUpdate} className="max-w-xl space-y-8">
                    {/* AVATAR SELECTOR */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Elegí tu cara</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                            {PRESET_AVATARS.map((av) => (
                                <img
                                    key={av}
                                    src={av}
                                    onClick={() => setFormData({...formData, avatar_url: av})}
                                    className={`w-full aspect-square rounded-xl cursor-pointer border-2 transition-all ${formData.avatar_url === av ? 'border-celeste scale-110 shadow-[0_0_15px_rgba(116,172,223,0.4)]' : 'border-transparent hover:border-slate-600'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* INPUTS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre Completo</label>
                            <input 
                                type="text"
                                className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-celeste transition-all"
                                value={formData.full_name}
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Username (Cada 60 días)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-celeste font-mono font-bold">&</span>
                                <input 
                                    type="text"
                                    className="w-full bg-slate-900/50 border border-slate-800 p-3 pl-8 rounded-xl text-white outline-none focus:border-celeste transition-all font-mono"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bio (Tu bardo personal)</label>
                        <textarea 
                            className="w-full bg-slate-900/50 border border-slate-800 p-3 h-24 rounded-xl text-white outline-none focus:border-celeste transition-all resize-none"
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">País</label>
                        <input 
                            type="text"
                            placeholder="Ej: Argentina 🇦🇷"
                            className="w-full bg-slate-900/50 border border-slate-800 p-3 rounded-xl text-white outline-none focus:border-celeste transition-all"
                            value={formData.country}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                        />
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border ${message.type === 'error' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-green-500/10 border-green-500 text-green-500'}`}>
                            {message.type === 'error' ? '⚠️ ' : '✅ '} {message.text}
                        </div>
                    )}

                    <button 
                        disabled={loading}
                        className="w-full py-4 bg-celeste text-dark-azul font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-50"
                    >
                        {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                    </button>
                </form>
            </main>
        </div>
    );
}