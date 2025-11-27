"use client"
import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, Smartphone, MessageCircleHeart, Users, ArrowRight, Zap, BookOpen, CheckCircle, Star, PlayCircle, Wifi, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function EmoteTutorLanding() {
  const [activeCombo, setActiveCombo] = useState(0);
  const router = useRouter(); 

  const handleLogin = () => {
    router.push('/auth'); 
  };
  const featuredCombos = [
    { sequence: [1, 1], message: 'Olá!', category: 'Saudações' },
    { sequence: [3, 2], message: 'Estou com fome', category: 'Necessidades' },
    { sequence: [2, 1], message: 'Estou feliz!', category: 'Emoções' },
    { sequence: [6, 4], message: 'Quero um abraço', category: 'Pessoas' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCombo((prev) => (prev + 1) % featuredCombos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                  EmoteTutor
                </span>
                <p className="text-xs text-gray-500">Comunicação com amor</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <a href="#como-funciona" className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
                Como funciona
              </a>
              <a href="#recursos" className="text-gray-600 hover:text-blue-900 transition-colors font-medium">
                Recursos
              </a>
                <Button
                    onClick={handleLogin} // Chame a função de navegação no clique
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Login 
                  </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 via-transparent to-transparent" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg mb-8 border border-blue-100">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Dispositivo físico com sistema inteligente de combinações
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-900 via-blue-700 to-sky-600 bg-clip-text text-transparent">
                Dando voz
              </span>
              <br />
              <span className="text-gray-800">
                a cada criança
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
              Dispositivo de comunicação assistiva com <strong className="text-blue-900">6 botões físicos</strong> e 
              sistema de combos inteligente que transforma sequências em mensagens expressivas 
              para crianças autistas não verbais
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200">
                Começar gratuitamente
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 border-blue-200">
                <PlayCircle className="h-5 w-5" />
                Ver demonstração
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-gray-600">
                  <strong className="text-blue-900">6 botões</strong> físicos coloridos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-gray-600">
                  <strong className="text-blue-900">50+</strong> combos pré-configurados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-gray-600">
                  <strong className="text-blue-900">WebSocket</strong> tempo real
                </span>
              </div>
            </div>
          </div>

          {/* Device Image Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-400 rounded-3xl blur-3xl opacity-20" />
            <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-12 border-2 border-blue-100">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-blue-300">
          <div className=" rounded-2xl overflow-hidden shadow-xl border-2 border-blue-200">
                <img 
                  src="/device.jpeg" 
                  alt="Dispositivo EmoteTutor com 6 botões coloridos"
                  className="w-full h-full object-cover ob"
                  
                />
              </div>
              </div>

              {/* Combo Display */}
              <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Exemplo de Combo</span>
                  </div>
                  <span className="text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-full font-medium border border-blue-200">
                    {featuredCombos[activeCombo].category}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    {featuredCombos[activeCombo].sequence.map((num, idx) => (
                      <React.Fragment key={idx}>
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md">
                          Botão {num}
                        </div>
                        {idx < featuredCombos[activeCombo].sequence.length - 1 && (
                          <span className="text-blue-400 font-bold text-xl">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="text-blue-400 font-bold text-xl">=</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  "{featuredCombos[activeCombo].message}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Como o EmoteTutor funciona?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistema simples e poderoso baseado em hardware físico
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="h-8 w-8" />,
                title: 'Dispositivo Físico',
                description: '6 botões coloridos (Vermelho, Branco 1, Azul, Verde, Branco 2 e Preto) em um dispositivo compacto baseado em ESP8266. A criança pressiona sequências para se comunicar.',
                color: 'from-blue-600 to-blue-800'
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: 'Sistema de Combos',
                description: 'Cada sequência de botões forma uma mensagem. Exemplo: Botão 1 + Botão 1 = "Olá!". Mais de 50 combinações organizadas em 8 categorias diferentes.',
                color: 'from-sky-500 to-blue-600'
              },
              {
                icon: <Wifi className="h-8 w-8" />,
                title: 'Conexão WebSocket',
                description: 'O dispositivo se conecta via WiFi e envia as interações em tempo real para o painel dos pais. Notificações instantâneas quando a criança se expressa.',
                color: 'from-blue-700 to-sky-600'
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl blur-xl" />
                <div className="relative bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-blue-200 hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Specs */}
          <div className="mt-16 bg-gradient-to-br from-blue-50 to-sky-50 rounded-3xl p-8 border-2 border-blue-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Especificações Técnicas</h3>
              <p className="text-gray-600">Hardware robusto e confiável</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: 'Microcontrolador', value: 'ESP8266' },
                { label: 'Botões', value: '6 físicos' },
                { label: 'Conectividade', value: 'WiFi + WebSocket' },
                { label: 'Tempo de resposta', value: '< 1.5s' }
              ].map((spec, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 text-center shadow-md">
                  <p className="text-sm text-gray-500 mb-1">{spec.label}</p>
                  <p className="text-xl font-bold text-blue-900">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="py-24 bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Recursos do Painel Web
            </h2>
            <p className="text-xl text-gray-600">
              Controle total através da interface web dos pais
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <Settings />, title: 'Gerenciamento de Dispositivos', description: 'Cadastre e gerencie múltiplos dispositivos EmoteTutor através do painel web' },
              { icon: <MessageCircleHeart />, title: 'Personalização de Combos', description: 'Crie, edite e delete combinações de botões com mensagens personalizadas' },
              { icon: <BookOpen />, title: '8 Categorias Organizadas', description: 'Saudações, Emoções, Necessidades, Respostas, Atividades, Pessoas, Expressões e Urgências' },
              { icon: <Star />, title: 'Histórico Completo', description: 'Veja todas as interações da criança com timestamps, categorias e sequências usadas' },
              { icon: <Wifi />, title: 'Monitoramento em Tempo Real', description: 'Receba notificações instantâneas quando a criança pressionar os botões' },
              { icon: <Shield />, title: 'Dados Locais e Seguros', description: 'Todas as configurações ficam salvas localmente por segurança e privacidade' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para transformar a comunicação?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Acesse o painel e comece a configurar seus dispositivos
          </p>
          <Button onClick={handleLogin} className="px-10 py-5 bg-white text-blue-900 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-200">
            Acessar Painel de Controle
          </Button>
          <p className="mt-6 text-sm opacity-75">
            Configuração rápida • Suporte completo • 100% personalizável
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-xl font-bold text-white">EmoteTutor</span>
                <p className="text-xs text-gray-400">Comunicação com amor</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Desenvolvido pela turma ENGECO221N01            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}