import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FAQs from './pages/FAQs';
import UserProfile from './pages/UserProfile';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="min-h-screen bg-dark-azul flex flex-col items-center selection:bg-celeste selection:text-dark-azul">
      
      {/* SECCIÓN DE RUTAS DINÁMICAS */}
      <div className="flex-1 w-full flex justify-center">
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/faqs" element={<FAQs />} />
  <Route path="/u/:username" element={<UserProfile />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Routes>
      </div>

      {/* FOOTER GLOBAL AL 100% */}
      <div className="w-full border-t border-slate-800 bg-dark-azul">
        <Footer />
      </div>
      
    </div>
  );
}

export default App;