export default function Footer() {
    return (
        <footer className="mt-10 border-t border-slate-800 p-8 text-slate-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-xl mx-auto text-xs">
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-300 uppercase tracking-widest">Legal</span>
                    <a href="#" className="hover:text-celeste transition-colors">Términos de Bardo</a>
                    <a href="#" className="hover:text-celeste transition-colors">Privacidad Fantasma</a>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-300 uppercase tracking-widest">Soporte</span>
                    <a href="/faqs" className="hover:text-celeste transition-colors">Wiki de Ayuda</a>
                    <a href="#" className="hover:text-celeste transition-colors">Reportar un infeliz</a>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-300 uppercase tracking-widest">Comunidad</span>
                    <a href="#" className="hover:text-celeste transition-colors">Ranking de Sols</a>
                    <a href="#" className="hover:text-celeste transition-colors">Próceres</a>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-300 uppercase tracking-widest">Hecho en</span>
                    <span className="flex items-center gap-1">🇦🇷 Argentina</span>
                    <span className="opacity-50">v1.0.2-beta</span>
                </div>
            </div>
            <div className="text-center mt-8 opacity-30 text-[10px]">
                © 2026 bolud.io - No nos hacemos responsables por la pérdida de neuronas durante la utilización de esta plataforma.
            </div>
        </footer>
    );
}