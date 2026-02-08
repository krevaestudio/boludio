import homeIcon from '../../assets/icons/home.svg';
import plusIcon from '../../assets/icons/plus.svg';
import searchIcon from '../../assets/icons/search.svg';
import bellIcon from '../../assets/icons/bell.svg';
import atIcon from '../../assets/icons/at.svg';
import settingsIcon from '../../assets/icons/settings.svg';
import followersIcon from '../../assets/icons/followers.svg';

const menuItems = [
    { name: 'Inicio', icon: homeIcon },
    { name: 'Crear post', icon: plusIcon },
    { name: 'Buscar', icon: searchIcon },
    { name: 'Notificaciones', icon: bellIcon },
    { name: 'Menciones', icon: atIcon },
    { name: 'Seguidores', icon: followersIcon },
    { name: 'Ajustes', icon: settingsIcon },
];

export default function Sidebar() {
    // Por ahora fijo, después vendrá de Supabase
    const userFlair = "Cebador Serial"; 

    return (
        <aside className="w-64 h-screen sticky top-0 flex flex-col border-r border-slate-800 p-4 bg-dark-azul">

            {/* Menú de Navegación */}
            <nav className="space-y-2">
                {menuItems.map((item) => (
                    <div 
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
                    </div>
                ))}

                {/* SECCIÓN DE PERFIL: Integrada directamente en el menú */}
               <div className="pt-4 mt-4 border-t border-slate-800/50">
    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-800/50 cursor-pointer transition-all border border-transparent hover:border-slate-700/50 group">
        <div className="relative flex-shrink-0"> {/* Agregamos flex-shrink-0 acá */}
            <img 
                src="/avatar-default.png" 
                alt="Mi Perfil" 
                className="w-11 h-11 aspect-square rounded-full object-cover shadow-lg transition-transform group-hover:scale-105"
                style={{
                    border: '2px solid #74ACDF',
                    minWidth: '2.75rem', // Esto es w-11 en rem para asegurar el tamaño
                    minHeight: '2.75rem'
                }}
            />
        </div>

        <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-white truncate">Perfil</span>
                <span className="text-[9px] bg-celeste/20 text-celeste px-1.5 py-0.5 rounded border border-celeste/30 font-black uppercase tracking-tighter shrink-0">
                    {userFlair}
                </span>
            </div>
            <span className="text-xs text-slate-500 truncate group-hover:text-slate-400 transition-colors">
                @boludo_pro
            </span>
        </div>
    </div>
</div>
            </nav>
        </aside>
    );
}