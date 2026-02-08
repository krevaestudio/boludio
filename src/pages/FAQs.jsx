import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import { FAQ_DATA } from '../data/faqs'; // Importamos las preguntas

export default function FAQs() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        // Si hacés clic en la que ya está abierta, se cierra. Si no, se abre la nueva.
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-dark-azul flex flex-col items-center">
            <div className="flex w-full max-w-6xl flex-1">
                <Sidebar />
                
                <main className="flex-1 border-r border-slate-800 min-h-screen">
                    {/* Header de la Wiki */}
                    <header className="bg-dark-azul/80 backdrop-blur-md border-b border-slate-800 p-8 sticky top-0 z-50">
                        <h1 className="text-3xl font-black text-white italic tracking-tighter">Wiki de Bolud.io</h1>
                        <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Preguntas Frecuentes</p>
                    </header>

                    <div className="p-8 space-y-4">
                        {FAQ_DATA.map((faq, index) => (
                            <div key={faq.id} className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/10">
                                <button 
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-800/30 transition-colors group"
                                >
                                    <span className={`font-bold transition-colors ${openIndex === index ? 'text-celeste' : 'text-slate-200'}`}>
                                        {faq.question}
                                    </span>
                                    {/* Flechita que rota */}
                                    <span className={`text-celeste transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>
                                
                                {/* Contenido del acordeón con transición suave */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 p-5 border-t border-slate-800/50' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-slate-400 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            <div className="w-full border-t border-slate-800 bg-dark-azul">
                <Footer />
            </div>
        </div>
    );
}