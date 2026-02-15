import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import replyIcon from '../../assets/icons/replies.svg';
import solIcon from '../../assets/icons/solcitos.svg';
import shareIcon from '../../assets/icons/shares.svg';
import nopIcon from '../../assets/icons/nop.svg';

// Agregamos onDelete como prop para actualizar el feed en vivo
export default function PostCard({ post, onDelete }) {
    const { profile } = useAuth();
    const [hasSolcito, setHasSolcito] = useState(false);
    
    const [solcitosCount, setSolcitosCount] = useState(() => Math.max(0, Number(post.solcitos) || 0));

    // Verificamos si el boludo que mira el post es el autor
    const isOwner = profile && profile.id === post.profile_id;

    const isAnon = post.is_anonymous || !post.profiles;
    const userProfile = post.profiles || {};
    const displayAvatar = isAnon ? "/avatar-default.png" : (userProfile.avatar_url || "/avatar-default.png");
    const displayFlair = isAnon ? "Fantasma" : (userProfile.flair || "User");
    const displayName = isAnon ? post.username : (userProfile.full_name || post.username);

    // FUNCIÓN PARA ELIMINAR EL POST
    const handleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que querés borrar esta boludez? No hay vuelta atrás.");
        if (!confirmDelete) return;

        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', post.id);

            if (error) throw error;
            
            // Si el feed nos pasó la función, la ejecutamos para que desaparezca la card
            if (onDelete) onDelete(post.id);
        } catch (error) {
            alert("No se pudo borrar, se rompió algo: " + error.message);
        }
    };

    const renderContent = (text) => {
        if (!text) return null;
        const mentionRegex = /(&[a-zA-Z0-9_]+)/g;
        const parts = text.split(mentionRegex);

        return parts.map((part, i) => {
            if (part.startsWith('&')) {
                const username = part.slice(1);
                return (
                    <Link 
                        key={i} 
                        to={`/u/${username}`} 
                        className="text-celeste font-bold hover:underline decoration-celeste/30 transition-all"
                    >
                        {part}
                    </Link>
                );
            }
            return part;
        });
    };

    useEffect(() => {
        setSolcitosCount(Math.max(0, Number(post.solcitos) || 0));
    }, [post.id]);

    useEffect(() => {
        if (profile) {
            const checkIfVoted = async () => {
                const { data } = await supabase
                    .from('solcitos')
                    .select('id')
                    .eq('post_id', post.id)
                    .eq('profile_id', profile.id)
                    .maybeSingle();
                
                if (data) setHasSolcito(true);
                else setHasSolcito(false);
            };
            checkIfVoted();
        }
    }, [profile, post.id]);

    const handleSolcito = async () => {
        if (!profile) return alert("¡Tenés que estar logueado para tirar solcitos, boludo!");
        const previousState = hasSolcito;
        const previousCount = solcitosCount;
        setHasSolcito(!previousState);
        setSolcitosCount(prev => previousState ? Math.max(0, prev - 1) : prev + 1);

        try {
            if (previousState) {
                await supabase.from('solcitos').delete().eq('post_id', post.id).eq('profile_id', profile.id);
            } else {
                await supabase.from('solcitos').insert({ post_id: post.id, profile_id: profile.id });
            }
        } catch (error) {
            setHasSolcito(previousState);
            setSolcitosCount(previousCount);
        }
    };

    const getYoutubeEmbed = (text) => {
        const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n]+)/;
        const match = text.match(regExp);
        return match ? match[1] : null;
    };

    const videoId = getYoutubeEmbed(post.content);

    return (
        <div className={`bg-dark-card border p-4 rounded-xl max-w-xl mx-auto mt-4 transition-all hover:border-slate-600 shadow-md ${isAnon ? 'border-dashed border-slate-700' : 'border-slate-700'}`}>
            <div className="flex gap-3">
                <img 
                    src={displayAvatar} 
                    alt="Avatar" 
                    className={`h-10 w-10 rounded-full object-cover border flex-shrink-0 ${isAnon ? 'border-slate-600 opacity-50' : 'border-celeste/40'}`} 
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold hover:text-celeste cursor-pointer transition-colors truncate max-w-[150px] ${isAnon ? 'text-slate-400' : 'text-white'}`}>
                            {displayName}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-black uppercase tracking-tighter shrink-0 ${isAnon ? 'bg-white/5 text-slate-500 border-white/10' : 'bg-celeste/10 text-celeste border-celeste/20'}`}>
                            {displayFlair}
                        </span>
                        <span className="text-slate-600 font-mono text-[10px] truncate italic">&{post.username}</span>
                        
                        {/* HORA Y BOTÓN DE BORRAR */}
                        <div className="ml-auto flex items-center gap-3">
                            <span className="text-slate-500 text-[10px]">
                                {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            
                            {isOwner && (
                                <button 
                                    onClick={handleDelete}
                                    className="p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Borrar boludez"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <p className="text-slate-200 mt-2 leading-relaxed break-words text-sm sm:text-base whitespace-pre-wrap">
                        {renderContent(post.content)}
                    </p>

                    {videoId ? (
                        <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-slate-700 shadow-2xl">
                            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube video player" frameBorder="0" allowFullScreen></iframe>
                        </div>
                    ) : post.image_url && (
                        <div className="mt-3 rounded-lg border border-slate-800 overflow-hidden bg-slate-900/50">
                            <img src={post.image_url} alt="Post content" className="max-h-96 w-full object-contain mx-auto shadow-sm" />
                        </div>
                    )}

                    <div className="flex justify-between mt-5 text-slate-500 max-w-md">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 hover:text-celeste transition-all group">
                                <img src={replyIcon} className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" alt="Reply" />
                                <span className="text-[10px] font-black font-mono">0</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-green-400 transition-all group">
                                <img src={shareIcon} className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" alt="Share" />
                                <span className="text-[10px] font-black font-mono">0</span>
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={handleSolcito}
                                className={`flex items-center gap-2 transition-all group px-2 py-1 rounded-lg hover:bg-yellow-400/5 ${hasSolcito ? 'text-yellow-400 opacity-100' : 'text-slate-500 opacity-60 hover:opacity-100'}`}
                            >
                                <img src={solIcon} className={`w-4 h-4 transition-transform duration-200 ${hasSolcito ? 'scale-125' : 'group-active:scale-90'}`} alt="Sol" />
                                <span className="text-[10px] font-black font-mono">{solcitosCount}</span>
                            </button>

                            <button className="flex items-center gap-2 hover:text-red-500 transition-all group">
                                <img src={nopIcon} className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" alt="Nop" />
                                <span className="text-[10px] font-black font-mono">{post.nops || 0}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}