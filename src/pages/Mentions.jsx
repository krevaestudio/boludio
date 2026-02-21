import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/feed/PostCard';
import Sidebar from '../components/layout/Sidebar';

export default function Mentions() {
  const { profile, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMentions = async () => {
    if (!profile?.username) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
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
        .ilike('content', `%&${profile.username}%`) // Filtro de mención
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error cargando menciones:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
  };

  useEffect(() => {
    if (!authLoading && profile) {
      fetchMentions();
    }
  }, [authLoading, profile]);

  return (
    <div className="flex w-full max-w-6xl flex-1">
        {/* COLUMNA IZQUIERDA */}
        <Sidebar />
        
        {/* COLUMNA CENTRAL */}
        <main className="flex-1 border-r border-slate-800 min-h-screen">
          <header className="bg-dark-azul/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-50">
            <h1 className="text-2xl font-black text-celeste text-center tracking-tighter italic uppercase">
              Menciones
            </h1>
          </header>

          <div className="px-4 pb-20">
            {/* No ponemos el Composer acá porque son menciones, no la home */}
            
            <div className="max-w-xl mx-auto mt-6 space-y-4">
              {loading || authLoading ? (
                <div className="text-center py-20">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-celeste border-t-transparent rounded-full"></div>
                  <p className="text-slate-500 mt-2 font-medium italic tracking-widest uppercase text-xs">Buscando dónde te nombraron...</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onDelete={handleDeletePost}
                  />
                ))
              ) : (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/10 px-6">
                  <p className="text-slate-500 text-center font-mono text-sm uppercase tracking-tighter">
                    _ SILENCIO TOTAL _ <br/>
                    <span className="text-[10px] mt-2 block opacity-50 font-sans italic">Nadie te mencionó todavía. Capaz sos muy perfil bajo o no te quiere nadie.</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* COLUMNA DERECHA (TENDENCIAS) */}
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
                    {/* Podés copiar los otros trends acá para que sea idéntico a la Home */}
                </div>
            </div>

            <div className="bg-linear-to-br from-celeste/10 to-transparent border border-celeste/20 rounded-xl p-6 relative overflow-hidden group">
                <p className="text-celeste text-sm italic leading-relaxed relative z-10">
                    "Si te mencionan mucho, es que algo estás haciendo bien. O muy mal."
                </p>
                <p className="text-slate-500 text-[9px] mt-3 font-bold uppercase tracking-widest italic">
                    — Consejo Boludo
                </p>
            </div>
            
            <div className="px-6 text-[10px] text-slate-600 font-medium">
                <p>© 2026 bolud.io · Menciones con carpincho-vibe.</p>
            </div>
        </aside>
    </div>
  );
}