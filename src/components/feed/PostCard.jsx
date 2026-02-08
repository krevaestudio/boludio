import replyIcon from '../../assets/icons/replies.svg';
import solIcon from '../../assets/icons/solcitos.svg';
import shareIcon from '../../assets/icons/shares.svg';
import nopIcon from '../../assets/icons/nop.svg';

export default function PostCard({ post }) {
    const isAnon = post.is_anonymous;

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
                    src={post.avatar_url || "/avatar-default.png"} 
                    alt="Avatar" 
                    className="h-10 w-10 rounded-full object-cover border border-slate-600 flex-shrink-0" 
                />

                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold hover:text-celeste cursor-pointer transition-colors ${isAnon ? 'text-slate-300' : 'text-white'}`}>
                            {post.username}
                        </span>

                        {/* FLAIR: Si no es anon, muestra su flair o "User" por defecto */}
                        {!isAnon && (
                            <span className="text-[10px] bg-celeste/10 text-celeste px-2 py-0.5 rounded border border-celeste/20 font-medium uppercase tracking-tighter">
                                {post.user_flair || "User"}
                            </span>
                        )}
                        
                        {isAnon && (
                            <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full border border-gray-400/30 font-black uppercase tracking-tighter">
                                Fantasma
                            </span>
                        )}

                        <span className="text-slate-500 text-sm">
                            · {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <p className="text-slate-200 mt-2 leading-relaxed break-words">
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
                        <img
                            src={post.image_url}
                            alt="Post content"
                            className="mt-3 rounded-lg border border-slate-700 max-h-96 w-full object-cover shadow-sm"
                        />
                    )}

                    {/* Acciones */}
                    <div className="flex justify-between mt-5 text-slate-500 max-w-md">
                        <div className="flex gap-4">
                            {!isAnon && (
                                <>
                                    <button className="flex items-center gap-2 hover:text-celeste transition-all group">
                                        <img src={replyIcon} className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" alt="Reply" />
                                        <span className="text-xs font-bold font-mono">0</span>
                                    </button>

                                    <button className="flex items-center gap-2 hover:text-green-400 transition-all group">
                                        <img src={shareIcon} className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" alt="Share" />
                                        <span className="text-xs font-bold font-mono">0</span>
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 hover:text-yellow-400 transition-all group text-yellow-500/80">
                                <img src={solIcon} className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" alt="Sol" />
                                <span className="text-xs font-bold font-mono">{post.solcitos || 0}</span>
                            </button>

                            <button className="flex items-center gap-2 hover:text-red-500 transition-all group">
                                <img 
                                    src={nopIcon} 
                                    className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" 
                                    alt="Nop" 
                                />
                                <span className="text-xs font-bold font-mono">{post.nops || 0}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}