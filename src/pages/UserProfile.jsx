import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { supabase } from '../lib/supabase';

export default function UserProfile() {
    const { username } = useParams(); 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('username', username)
                    .single();

                if (error) throw error;
                setUser(data);
            } catch (error) {
                console.error('Error cargando perfil:', error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    };

    if (loading) return (
        <div className="min-h-screen bg-dark-azul flex items-center justify-center font-mono text-celeste p-4 text-center">
            [ BUSCANDO DATA DE &{username?.toUpperCase()}... ]
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-dark-azul text-white flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-black italic">ERROR 404</h1>
            <p className="text-slate-500 mt-2 font-mono uppercase tracking-widest">Este boludo no existe.</p>
        </div>
    );

    return (
        <div className="flex w-full max-w-6xl flex-1">
            <Sidebar />

            {/* COLUMNA CENTRAL (PERFIL) */}
            <main className="flex-1 border-r border-slate-800 min-h-screen">
                <div className="relative">
                    {/* PORTADA: h-32 en mobile, h-48 en desktop */}
                    <div 
                        className="h-32 sm:h-48 bg-cover bg-center border-b border-slate-800 bg-slate-900"
                        style={{ backgroundImage: "url('/portada-default.png')" }}
                    ></div>
                    
                    <div className="px-4 sm:px-8 pb-6">
                        {/* HEADER: En mobile es col, en desktop es row */}
                        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 -mt-10 sm:-mt-12 mb-4">
                            <div className="flex-shrink-0 relative">
                                <img 
                                    src={user.avatar_url || "/avatar-default.png"} 
                                    alt={user.full_name} 
                                    className="w-24 h-24 sm:w-32 sm:h-32 aspect-square rounded-full border-4 border-dark-azul bg-dark-azul object-cover shadow-2xl"
                                    style={{ border: '4px solid #74ACDF' }}
                                />
                            </div>

                            {/* Info de Usuario */}
                            <div className="flex-1 w-full sm:pt-14">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="text-2xl sm:text-3xl font-black text-white">{user.full_name}</h2>
                                            <span className="text-[9px] sm:text-[10px] bg-celeste/20 text-celeste px-2 py-0.5 rounded border border-celeste/30 font-black uppercase tracking-tighter shrink-0">
                                                {user.flair}
                                            </span>
                                        </div>
                                        <p className="text-celeste font-mono text-lg sm:text-xl font-bold tracking-tight">
                                            &{user.username}
                                        </p>
                                    </div>
                                    
                                    {/* Botón movido aquí para que no moleste arriba */}
                                    <button className="w-full sm:w-fit px-6 py-2 bg-transparent border border-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all">
                                        Configurar Perfil
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-slate-200 text-sm leading-relaxed max-w-2xl">
                                {user.bio || "Este boludo no tiene bio todavía."}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                {user.country && <span className="flex items-center gap-1.5">{user.country}</span>}
                                <span className="flex items-center gap-1.5 italic">📅 Miembro desde {formatDate(user.created_at)}</span>
                            </div>
                        </div>

                        {/* MÉTRICAS: gap reducido en mobile */}
                        <div className="flex gap-6 sm:gap-10 mt-8 pt-6 border-t border-slate-800/50">
                            <div className="flex flex-col">
                                <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">{(user.total_solcitos || 0).toLocaleString()}</span>
                                <span className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Solcitos</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">{user.post_count || 0}</span>
                                <span className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Posts</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/10">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Boludeo Histórico</h3>
                    </div>
                    <div className="p-10 text-center text-slate-600 italic text-xs font-mono">
                        [ NO HAY POSTS DISPONIBLES AÚN ]
                    </div>
                </div>
            </main>

            {/* COLUMNA DERECHA: Oculta en pantallas menores a LG */}
            <aside className="hidden lg:flex flex-col w-80 p-6 sticky top-0 h-screen gap-6">
                <div className="bg-dark-card border border-slate-800 rounded-xl p-6 shadow-xl">
                    <h3 className="font-black text-white mb-6 italic text-xs uppercase tracking-widest border-b border-slate-800 pb-2">
                        Coronaciones de Gloria
                    </h3>
                    <div className="space-y-6">
                        <div className="group cursor-pointer">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-bold text-white group-hover:text-celeste transition-colors">#Scaloneta</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-celeste h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(116,172,223,0.5)]"></div>
                            </div>
                        </div>
                        {/* ... otros trends ... */}
                    </div>
                </div>
                
                <div className="px-6 text-[10px] text-slate-600 font-medium italic">
                    <p>© 2026 bolud.io · Ubuntu 24.04 LTS</p>
                </div>
            </aside>
        </div>
    );
}