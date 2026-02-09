import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth'; // Traemos tu identidad
import { validateBoludioPost } from '../../utils/validators';

export default function Composer({ onPostCreated }) {
    const { profile } = useAuth(); // Obtenemos el perfil real
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showImageInput, setShowImageInput] = useState(false);

    const handlePost = async () => {
        const validation = validateBoludioPost(content);
        if (!validation.valid) {
            setError(validation.error);
            return;
        }

        setLoading(true);

        // Lógica de Identidad
        let postData = {
            content: content,
            image_url: imageUrl.trim() === '' ? null : imageUrl,
            solcitos: 0,
            nops: 0
        };

        if (profile) {
            // Si hay perfil, usamos la data real
            postData.profile_id = profile.id;
            postData.username = profile.username;
            postData.is_anonymous = false;
        } else {
            // Si no hay perfil, generamos el boludo random de siempre
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
        <div className="bg-dark-card border border-slate-700 rounded-xl shadow-2xl max-w-xl mx-auto mt-6 overflow-hidden">
            {/* Header del Composer con Avatar Real si existe */}
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

            <textarea
            id="main-composer"
                className="w-full h-28 p-4 text-lg bg-transparent text-white border-none focus:ring-0 resize-none placeholder-slate-500 outline-none"
                placeholder={profile ? `¿Qué onda, ${profile.full_name}?` : "¿Qué onda, boludo?"}
                value={content}
                disabled={loading}
                onChange={(e) => {
                    setContent(e.target.value);
                    if (error) setError(null);
                }}
            />
            
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