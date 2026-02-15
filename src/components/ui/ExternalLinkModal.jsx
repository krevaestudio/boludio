export default function ExternalLinkModal({ isOpen, onClose, url }) {
    if (!isOpen) return null;

    const handleProceed = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-dark-azul/90 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-dark-card border-2 border-celeste/30 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(116,172,223,0.1)] animate-in fade-in zoom-in duration-200">
                <div className="text-center">
                    <div className="text-4xl mb-4">🚀</div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Ojo, estás saliendo</h2>
                    <p className="text-slate-400 text-sm mt-3 font-medium leading-relaxed">
                        Este link te lleva a: <br/>
                        <span className="text-celeste break-all block mt-2 text-xs font-mono">{url}</span>
                    </p>
                    <div className="flex flex-col w-full gap-3 mt-8">
                        <button onClick={handleProceed} className="w-full py-3 bg-celeste text-dark-azul font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all">
                            Ir al sitio
                        </button>
                        <button onClick={onClose} className="w-full py-3 bg-slate-800 text-slate-300 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-700 transition-all">
                            Quedarme acá
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}