export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop con Blur */}
            <div 
                className="absolute inset-0 bg-dark-azul/80 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Contenedor del Modal */}
            <div className="relative bg-dark-card border-2 border-red-500/50 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                    {/* Icono de Alerta */}
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.876c1.27 0 2.09-1.383 1.455-2.447l-6.938-12a2 2 0 00-3.464 0l-6.938 12c-.635 1.064.185 2.447 1.455 2.447z" />
                        </svg>
                    </div>

                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
                        {title || "¿ESTÁS SEGURO, BOLUDO?"}
                    </h2>
                    
                    <p className="text-slate-400 text-sm mt-2 font-medium leading-relaxed">
                        {message || "Si borrás esta boludez, no hay vuelta atrás. Desaparece para siempre de la faz de la tierra."}
                    </p>

                    <div className="flex flex-col w-full gap-3 mt-8">
                        <button 
                            onClick={onConfirm}
                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/20"
                        >
                            Sí, de una. Borrar.
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black uppercase tracking-widest text-xs rounded-xl transition-all"
                        >
                            No, mejor no
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}