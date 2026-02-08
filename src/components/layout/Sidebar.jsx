import { Link } from 'react-router-dom';
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
    { name: 'Crear post', icon: plusIcon, path: '/' },
    { name: 'Buscar', icon: searchIcon, path: '/' },
    { name: 'Notificaciones', icon: bellIcon, path: '/' },
    { name: 'Menciones', icon: atIcon, path: '/' },
    { name: 'Seguidores', icon: followersIcon, path: '/' },
    { name: 'Ajustes', icon: settingsIcon, path: '/' },
];

export default function Sidebar() {
    const { profile, loading } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    return (
        <aside className="w-64 h-screen sticky top-0 flex flex-col border-r border-slate-800 p-4 bg-dark-azul">
            <nav className="space-y-2 flex-1">
                {menuItems.map((item) => (
                    <Link 
                        to={item.path}
                        key={item.name}
                        className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-slate-800/50 cursor-pointer transition-all group"
                    >
                        <img 
                            src={item.icon} 
                            alt={item.name} 
                            className="w-6 h-6 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all"
                        />
                        <span className="text-lg font-medium text-slate-300 group-hover:text-white">
                            {item.name}
                        </span>
                    </Link>
                ))}
            </nav>

            <div className="pt-4 border-t border-slate-800/50">
                {loading ? (
                    <div className="p-3 animate-pulse flex items-center gap-3">
                        <div className="w-11 h-11 bg-slate-800 rounded-full"></div>
                        <div className="h-3 w-20 bg-slate-800 rounded"></div>
                    </div>
                ) : profile ? (
                    <div className="space-y-3">
                        <Link 
                            to={`/u/${profile.username}`}
                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-800/50 cursor-pointer transition-all border border-transparent hover:border-slate-700/50 group"
                        >
                            <div className="relative flex-shrink-0">
                                <img 
                                    src={profile.avatar_url || "/avatar-default.png"} 
                                    className="w-11 h-11 aspect-square rounded-full object-cover shadow-lg border-2 border-celeste"
                                    style={{ minWidth: '2.75rem', minHeight: '2.75rem' }}
                                />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-white truncate">{profile.full_name}</span>
                                    <span className="text-[9px] bg-celeste/20 text-celeste px-1.5 py-0.5 rounded border border-celeste/30 font-black uppercase tracking-tighter">
                                        {profile.flair}
                                    </span>
                                </div>
                                <span className="text-xs text-celeste font-mono font-bold">&{profile.username}</span>
                            </div>
                        </Link>
                        <button onClick={handleLogout} className="w-full text-[10px] text-slate-600 hover:text-red-400 font-black uppercase tracking-widest py-2">
                            Cerrar Sesión
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2 p-2 text-center">
                        <Link to="/login" className="block w-full bg-celeste text-dark-azul font-black py-3 rounded-xl text-xs hover:bg-white transition-all">
                            INGRESAR
                        </Link>
                        <Link to="/register" className="block text-slate-500 font-bold text-[10px] hover:text-white uppercase tracking-widest mt-2">
                            Crear Cuenta
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
}