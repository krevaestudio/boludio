import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FAQs from './pages/FAQs';
import UserProfile from './pages/UserProfile';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Mentions from './pages/Mentions';


function App() {
  return (
    
    <div className="min-h-screen bg-dark-azul flex flex-col items-center selection:bg-celeste selection:text-dark-azul">
      {window.location.hostname === 'localhost' && (
    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded ml-2">DEV</span>
)}
      {/* SECCIÓN DE RUTAS DINÁMICAS */}
      {/* Agregamos px-4 en mobile para que el contenido no pegue a los bordes del celu */}
      <div className="flex-1 w-full flex justify-center px-0 sm:px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/u/:username" element={<UserProfile />} />
          <Route path="/mentions" element={<Mentions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<div className="text-white font-bold p-10 text-center">404 - Ruta no encontrada</div>} />
        </Routes>
      </div>

      {/* FOOTER GLOBAL */}
      {/* Lo ocultamos en pantallas muy chicas para que no moleste la lectura */}
      <div className="hidden sm:block w-full border-t border-slate-800 bg-dark-azul">
        <Footer />
      </div>
      
    </div>
  );
}

export default App;