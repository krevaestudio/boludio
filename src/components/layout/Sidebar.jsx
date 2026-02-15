import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import homeIcon from '../../assets/icons/home.svg';
import plusIcon from '../../assets/icons/plus.svg';
import searchIcon from '../../assets/icons/search.svg';
import bellIcon from '../../assets/icons/bell.svg';
import atIcon from '../../assets/icons/at.svg';
import settingsIcon from '../../assets/icons/settings.svg';
import followersIcon from '../../assets/icons/followers.svg';

const menuItems = [
    { name: 'Inicio', icon: homeIcon, path: '/' },
    { name: 'Buscar', icon: searchIcon, path: '/search' },
    { name: 'Notificaciones', icon: bellIcon, path: '/notifications' },
    { name: 'Menciones', icon: atIcon, path: '/mentions' },
    { name: 'Seguidores', icon: followersIcon, path: '/followers' },
    { name: 'Ajustes', icon: settingsIcon, path: '/settings' },
];

export default function Sidebar() {
    const { profile, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    const handleCreatePost = () => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const composer = document.getElementById('main-composer');
                composer?.focus();
            }, 100);
        } else {
            const composer = document.getElementById('main-composer');
            composer?.focus();
            composer?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <aside className="w-20 sm:w-64 h-screen sticky top-0 flex flex-col border-r border-slate-800/50 p-3 sm:p-5 bg-dark-azul/50 backdrop-blur-xl transition-all">
            
            {/* Espaciador superior (ya que quitamos el logo) */}
            <div className="h-4 sm:h-8" />

            <nav className="space-y-1 flex-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <Link 
                            to={item.path}
                            key={item.name}
                            className={`flex items-center justify-center sm:justify-start gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                                isActive 
                                ? 'bg-celeste/10 text-white' 
                                : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                            }`}
                        >
                            {/* Indicador lateral para el activo */}
                            {isActive && (
                                <div className="absolute left-0 w-1 h-6 bg-celeste rounded-r-full hidden sm:block shadow-[0_0_10px_#74ACDF]" />
                            )}
                            
                            <img 
                                src={item.icon} 
                                alt={item.name} 
                                className={`w-5 h-5 transition-all duration-300 ${
                                    isActive ? 'opacity-100 scale-110 brightness-125' : 'opacity-50 group-hover:opacity-100'
                                }`}
                            />
                            <span className={`hidden sm:block text-sm font-bold tracking-tight ${isActive ? 'translate-x-1' : ''}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}

                {/* BOTÓN "MANDALE MECHA" */}
                <div className="pt-6">
                    <button 
                        onClick={handleCreatePost}
                        className="w-full flex items-center justify-center sm:justify-start gap-4 px-4 py-4 rounded-2xl bg-celeste text-dark-azul shadow-[0_0_20px_rgba(116,172,223,0.3)] hover:shadow-celeste/50 hover:scale-[1.02] active:scale-95 transition-all group"
                    >
                        <img 
                            src={plusIcon} 
                            alt="Postear" 
                            className="w-5 h-5 invert brightness-0"
                        />
                        {/* Tipografía igualada al resto de los ítems: text-sm font-bold */}
                        <span className="hidden sm:block text-sm font-bold tracking-tight">
                            Mandale mecha
                        </span>
                    </button>
                </div>
            </nav>

            {/* CARD DE PERFIL / LOGIN */}
            <div className="pt-4 border-t border-slate-800/50">
                {loading ? (
                    <div className="p-3 animate-pulse flex items-center justify-center sm:justify-start gap-3 bg-slate-900/40 rounded-2xl">
                        <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
                        <div className="hidden sm:block h-3 w-20 bg-slate-800 rounded"></div>
                    </div>
                ) : profile ? (
                    <div className="bg-slate-900/40 p-2 sm:p-3 rounded-2xl border border-slate-800/50 group/profile">
                        <Link 
                            to={`/u/${profile.username}`}
                            className="flex items-center justify-center sm:justify-start gap-3 transition-all"
                        >
                            <img 
                                src={profile.avatar_url || "/avatar-default.png"} 
                                className="w-10 h-10 aspect-square rounded-xl object-cover border-2 border-slate-700 group-hover/profile:border-celeste transition-colors"
                            />
                            <div className="hidden sm:flex flex-col min-w-0">
                                <span className="text-xs font-bold text-white truncate">{profile.full_name}</span>
                                <span className="text-[10px] text-celeste font-mono font-bold">&{profile.username}</span>
                            </div>
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            className="w-full mt-2 text-[9px] text-slate-500 hover:text-red-400 font-black uppercase tracking-widest py-1 border-t border-slate-800/50 pt-2 transition-colors"
                        >
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                            <span className="sm:hidden text-xs">✕</span>
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="flex items-center justify-center sm:justify-between px-4 py-4 rounded-2xl bg-white text-dark-azul font-black text-xs hover:bg-celeste transition-all group">
                        <span className="hidden sm:inline uppercase tracking-tighter">Acceder</span>
                        <span className="text-lg sm:text-base">🔑</span>
                    </Link>
                )}
            </div>
        </aside>
    );
}