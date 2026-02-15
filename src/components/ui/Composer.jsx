import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth'; 
import { validateBoludioPost } from '../../utils/validators';

export default function Composer({ onPostCreated }) {
    const { profile } = useAuth(); 
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setContent(value);
        if (error) setError(null);

        const words = value.split(/\s/);
        const lastWord = words[words.length - 1];

        if (lastWord.startsWith('&') && lastWord.length > 1) {
            const query = lastWord.slice(1);
            
            const { data } = await supabase
                .from('profiles')
                .select('username, full_name, avatar_url')
                .ilike('username', `${query}%`)
                .limit(5);
            
            setSuggestions(data || []);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectUser = (username) => {
        const words = content.split(/\s/);
        words[words.length - 1] = `&${username} `;
        setContent(words.join(' '));
        setShowSuggestions(false);
        document.getElementById('main-composer').focus();
    };

    const handlePost = async () => {
        const validation = validateBoludioPost(content);
        if (!validation.valid) {
            setError(validation.error);
            return;
        }

        setLoading(true);

        let postData = {
            content: content,
            image_url: imageUrl.trim() === '' ? null : imageUrl,
            solcitos: 0,
            nops: 0
        };

        if (profile) {
            postData.profile_id = profile.id;
            postData.username = profile.username;
            postData.is_anonymous = false;
        } else {
            const randomNum = Math.floor(Math.random() * (999999 - 1000 + 1)) + 1000;
            postData.username = `Boludo${randomNum}`;
            postData.is_anonymous = true;
        }

        const { error: supabaseError } = await supabase
            .from('posts')
            .insert([postData]);

        if (supabaseError) {
            console.error(supabaseError);
            setError("Se rompió todo, boludo.");
            setLoading(false);
        } else {
            setContent('');
            setImageUrl('');
            setShowImageInput(false);
            setLoading(false);
            if (onPostCreated) onPostCreated(); 
        }
    };

    return (
        /* CAMBIO: Eliminamos overflow-hidden y usamos overflow-visible */
        <div className="bg-dark-card border border-slate-700 rounded-xl shadow-2xl max-w-xl mx-auto mt-6 overflow-visible relative">
            
            <div className="flex items-center gap-3 px-4 pt-4">
                <img 
                    src={profile?.avatar_url || "/avatar-default.png"} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">
                    {profile ? `Posteando como &${profile.username}` : "Modo Anónimo"}
                </span>
            </div>

            <div className="relative">
                <textarea
                    id="main-composer"
                    className="w-full h-28 p-4 text-lg bg-transparent text-white border-none focus:ring-0 resize-none placeholder-slate-500 outline-none"
                    placeholder={profile ? `¿Qué onda, ${profile.full_name}?` : "¿Qué onda, boludo?"}
                    value={content}
                    disabled={loading}
                    onChange={handleInputChange}
                />

                {/* --- DROPDOWN DE SUGERENCIAS CORREGIDO --- */}
                {showSuggestions && suggestions.length > 0 && (
                    <div 
                        className="absolute left-4 z-[999] bg-slate-900 border border-slate-700 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] w-64 overflow-hidden animate-in fade-in zoom-in duration-200"
                        /* CAMBIO: Usamos 'top' para que aparezca debajo de lo que escribes y no tape */
                        style={{ top: '100%' }} 
                    >
                        <div className="p-2 border-b border-slate-800 bg-slate-800/30 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            Sugerencias de boludos
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            {suggestions.map((u) => (
                                <button 
                                    key={u.username}
                                    type="button"
                                    onClick={() => selectUser(u.username)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-celeste/10 transition-colors text-left border-b border-slate-800/50 last:border-0"
                                >
                                    <img src={u.avatar_url || "/avatar-default.png"} className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold text-white truncate">{u.full_name}</span>
                                        <span className="text-[10px] text-celeste font-mono font-bold">&{u.username}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {showImageInput && (
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <input
                        type="url"
                        className="w-full p-2 bg-slate-800 text-white rounded-md border border-slate-700 focus:outline-none focus:ring-1 focus:ring-celeste placeholder-slate-600 text-sm"
                        placeholder="Pegá la URL de la imagen, boludo"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        disabled={loading}
                    />
                    {imageUrl && (
                        <div className="mt-3 relative">
                            <img src={imageUrl} alt="Previsualización" className="w-full max-h-48 object-contain rounded-md border border-slate-700" />
                            <button 
                                onClick={() => setImageUrl('')} 
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 shadow-lg"
                            >
                                X
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-between items-center px-4 py-3 border-t border-slate-700 bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowImageInput(!showImageInput)}
                        className={`p-2 rounded-full transition-colors ${showImageInput ? 'text-celeste bg-celeste/10' : 'text-slate-400 hover:bg-slate-700 hover:text-celeste'}`}
                        title="Adjuntar imagen"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <span className={`text-[10px] font-black tracking-widest ${content.length > 200 ? 'text-red-400' : 'text-slate-500'}`}>
                        {content.length}/220
                    </span>
                </div>
                
                <button
                    onClick={handlePost}
                    disabled={loading || content.length === 0}
                    className="bg-celeste hover:bg-white disabled:opacity-50 text-dark-azul font-black py-2 px-6 rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/10 uppercase text-xs tracking-widest"
                >
                    {loading ? 'Mandando...' : 'Mandale mecha'}
                </button>
            </div>

            {error && (
                <div className="mx-4 mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
}