import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import PostCard from '../components/feed/PostCard';
import { supabase } from '../lib/supabase';

export default function UserProfile() {
    // Simulamos datos que vendrán de la tabla 'profiles'
    const [user, setUser] = useState({
        full_name: "Juan Perez",
        username: "juancho_88",
        bio: "Programador a base de mate y fanático de los carpinchos. Si el código no compila, es culpa del compilador, no mía.",
        country: "Argentina 🇦🇷",
        created_at: "2025-10-15T12:00:00Z",
        total_solcitos: 1250,
        post_count: 42,
        instagram: "juancho.dev",
        tiktok: "juancho.ok",
        flair: "Cebador Serial"
    });

    const [userPosts, setUserPosts] = useState([]);

    // Formatear fecha: "En boludio desde Octubre 2025"
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-dark-azul flex flex-col items-center">
            <div className="flex w-full max-w-6xl flex-1">
                <Sidebar />

                <main className="flex-1 border-r border-slate-800 min-h-screen">
                    {/* HEADER DEL PERFIL */}
                    <div className="relative">
                        {/* Banner / Cover (Opcional, pero le da color) */}
                        <div className="h-32 bg-gradient-to-r from-slate-900 to-celeste/20 border-b border-slate-800"></div>
                        
                        {/* Info Principal */}
                        <div className="px-8 pb-6">
                            <div className="relative flex justify-between items-end -mt-12 mb-4">
                                <img 
                                    src="/avatar-default.png" 
                                    alt="Avatar" 
                                    className="w-32 h-32 rounded-full border-4 border-dark-azul bg-dark-azul object-cover"
                                    style={{ border: '4px solid #74ACDF' }}
                                />
                                <button className="px-4 py-2 border border-slate-700 rounded-full text-xs font-bold text-white hover:bg-slate-800 transition-all">
                                    Configurar Perfil
                                </button>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-black text-white">{user.full_name}</h2>
                                    <span className="text-[10px] bg-celeste/20 text-celeste px-2 py-0.5 rounded border border-celeste/30 font-black uppercase">
                                        {user.flair}
                                    </span>
                                </div>
                                <p className="text-celeste font-mono text-lg font-bold">
                                    &{user.username}
                                </p>
                            </div>

                            <p className="mt-4 text-slate-300 text-sm leading-relaxed max-w-lg">
                                {user.bio}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1">📍 {user.country}</span>
                                <span className="flex items-center gap-1">📅 En boludio desde {formatDate(user.created_at)}</span>
                            </div>

                            {/* REDES SOCIALES */}
                            <div className="flex gap-4 mt-4">
                                {user.instagram && (
                                    <a href={`https://instagram.com/${user.instagram}`} target="_blank" className="text-pink-400 text-xs hover:underline">
                                        📸 instagram.com/{user.instagram}
                                    </a>
                                )}
                                {user.tiktok && (
                                    <a href={`https://tiktok.com/@${user.tiktok}`} target="_blank" className="text-cyan-400 text-xs hover:underline">
                                        🎵 tiktok.com/@{user.tiktok}
                                    </a>
                                )}
                            </div>

                            {/* MÉTRICAS */}
                            <div className="flex gap-6 mt-6 pt-6 border-t border-slate-800/50">
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-xl">{user.total_solcitos}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Solcitos</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-xl">{user.post_count}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Posts</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FEED DEL USUARIO */}
                    <div className="border-t border-slate-800">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/10">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Boludeos de {user.username}</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Acá iría el map de posts del usuario */}
                            <p className="text-center text-slate-600 italic py-10 text-sm">
                                Cargando el bardo histórico...
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            <div className="w-full border-t border-slate-800 bg-dark-azul">
                <Footer />
            </div>
        </div>
    );
}