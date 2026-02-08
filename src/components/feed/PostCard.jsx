import replyIcon from '../../assets/icons/replies.svg';
import solIcon from '../../assets/icons/solcitos.svg';
import shareIcon from '../../assets/icons/shares.svg';
import nopIcon from '../../assets/icons/nop.svg';

export default function PostCard({ post }) {
    // Es anónimo si se marcó como tal o si no tiene un perfil asociado
    const isAnon = post.is_anonymous || !post.profiles;

    // Extraemos la info del perfil si existe (data del Join de Supabase)
    const userProfile = post.profiles || {};
    const displayAvatar = isAnon ? "/avatar-default.png" : (userProfile.avatar_url || "/avatar-default.png");
    const displayFlair = isAnon ? "Fantasma" : (userProfile.flair || "User");
    const displayName = isAnon ? post.username : (userProfile.full_name || post.username);

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

                        {/* FLAIR DINÁMICO */}
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-black uppercase tracking-tighter shrink-0 ${
                            isAnon 
                            ? 'bg-white/5 text-slate-500 border-white/10' 
                            : 'bg-celeste/10 text-celeste border-celeste/20'
                        }`}>
                            {displayFlair}
                        </span>

                        <span className="text-slate-600 font-mono text-[10px] truncate italic">
                            @{post.username}
                        </span>

                        <span className="text-slate-500 text-[10px] ml-auto">
                            {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <p className="text-slate-200 mt-2 leading-relaxed break-words text-sm sm:text-base">
                        {post.content}
                    </p>

                    {/* Multimedia */}
                    {videoId ? (
                        <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-slate-700 shadow-2xl">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : post.image_url && (
                        <div className="mt-3 rounded-lg border border-slate-800 overflow-hidden bg-slate-900/50">
                            <img
                                src={post.image_url}
                                alt="Post content"
                                className="max-h-96 w-full object-contain mx-auto shadow-sm"
                            />
                        </div>
                    )}

                    {/* Acciones */}
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
                            <button className="flex items-center gap-2 hover:text-yellow-400 transition-all group text-yellow-500/60">
                                <img src={solIcon} className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" alt="Sol" />
                                <span className="text-[10px] font-black font-mono">{post.solcitos || 0}</span>
                            </button>

                            <button className="flex items-center gap-2 hover:text-red-500 transition-all group">
                                <img 
                                    src={nopIcon} 
                                    className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" 
                                    alt="Nop" 
                                />
                                <span className="text-[10px] font-black font-mono">{post.nops || 0}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}