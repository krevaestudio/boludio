import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import PostCard from '../components/feed/PostCard';
import { supabase } from '../lib/supabase';

export default function UserProfile() {
    const { username } = useParams(); 
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [metrics, setMetrics] = useState({ solcitos: 0, posts: 0, nops: 0, followers: 0, following: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFullProfile = async () => {
            try {
                setLoading(true);
                
                // 1. Obtener perfil
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('username', username)
                    .single();

                if (profileError) throw profileError;
                setUser(profileData);

                // 2. Obtener posts del usuario
                const { data: postsData, error: postsError } = await supabase
                    .from('posts')
                    .select(`
                        *,
                        profiles (
                            username,
                            full_name,
                            avatar_url,
                            flair
                        )
                    `)
                    .eq('profile_id', profileData.id)
                    .order('created_at', { ascending: false });

                if (postsError) throw postsError;
                setPosts(postsData || []);

                // 3. Calcular métricas reales (Solcitos y Nops acumulados)
                const totalSolcitos = postsData.reduce((acc, post) => acc + (post.solcitos || 0), 0);
                const totalNops = postsData.reduce((acc, post) => acc + (post.nops || 0), 0);
                
                setMetrics({
                    solcitos: totalSolcitos,
                    nops: totalNops,
                    posts: postsData.length,
                    followers: 0, // Placeholder
                    following: 0  // Placeholder
                });

            } catch (error) {
                console.error('Error:', error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchFullProfile();
    }, [username]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    };

    if (loading) return (
        <div className="min-h-screen bg-dark-azul flex items-center justify-center font-mono text-celeste p-4 text-center italic">
            [ RASTREANDO A &{username?.toUpperCase()}... ]
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

            <main className="flex-1 border-r border-slate-800 min-h-screen">
                <div className="relative">
                    <div 
                        className="h-32 sm:h-48 bg-cover bg-center border-b border-slate-800 bg-slate-900"
                        style={{ backgroundImage: "url('/portada-default.png')" }}
                    ></div>
                    
                    <div className="px-4 sm:px-8 pb-6">
                        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 -mt-10 sm:-mt-12 mb-4">
                            <div className="flex-shrink-0 relative">
                                <img 
                                    src={user.avatar_url || "/avatar-default.png"} 
                                    className="w-24 h-24 sm:w-32 sm:h-32 aspect-square rounded-full border-4 border-dark-azul bg-dark-azul object-cover shadow-2xl"
                                    style={{ border: '4px solid #74ACDF' }}
                                />
                            </div>

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
                                {user.country && <span className="flex items-center gap-1.5">🇦🇷 {user.country}</span>}
                                <span className="flex items-center gap-1.5 italic">📅 Miembro desde {formatDate(user.created_at)}</span>
                            </div>
                        </div>

                        {/* MÉTRICAS EXPANDIDAS */}
                        <div className="flex flex-wrap gap-x-8 gap-y-4 mt-8 pt-6 border-t border-slate-800/50">
                            <div className="flex flex-col">
                                <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">{metrics.posts}</span>
                                <span className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Posts</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">{metrics.solcitos.toLocaleString()}</span>
                                <span className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Solcitos</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-black text-xl sm:text-2xl tracking-tighter text-red-500/80">{metrics.nops}</span>
                                <span className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Nops</span>
                            </div>
                            <div className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity">
                                <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">{metrics.followers}</span>
                                <span className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Seguidores</span>
                            </div>
                            <div className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity">
                                <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">{metrics.following}</span>
                                <span className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">Siguiendo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FEED DE POSTS */}
                <div className="border-t border-slate-800 bg-dark-azul">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/10">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Boludeo Histórico</h3>
                    </div>
                    
                    <div className="pb-20">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="p-20 text-center text-slate-600 italic text-xs font-mono">
                                [ ESTE BOLUDO TODAVÍA NO DIJO NADA... MUY SOSPECHOSO ]
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <aside className="hidden lg:flex flex-col w-80 p-6 sticky top-0 h-screen gap-6">
                <div className="bg-dark-card border border-slate-800 rounded-xl p-6 shadow-xl">
                    <h3 className="font-black text-white mb-6 italic text-xs uppercase tracking-widest border-b border-slate-800 pb-2">
                        Coronaciones de Gloria
                    </h3>
                    {/* ... trends ... */}
                </div>
                <div className="px-6 text-[10px] text-slate-600 font-medium italic">
                    <p>© 2026 bolud.io · Ubuntu 24.04 LTS</p>
                </div>
            </aside>
        </div>
    );
}