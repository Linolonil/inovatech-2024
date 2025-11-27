"use client"
import React, { useState } from 'react';
import { Heart, ArrowLeft, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function AuthSystem() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    // Validações
    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    // Simular chamada de API
    setTimeout(() => {
      // Aqui você faria a chamada real para sua API
      // const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email: loginEmail, password: loginPassword }) });
      
      // Simulação de sucesso
      console.log('Login realizado:', { email: loginEmail });
      alert('Login realizado com sucesso! Redirecionando para o dashboard...');
      setIsLoading(false);
      
      window.location.href = '/dashboard';
    }, 1500);
  };

  const handleRegister = (e: any) => {
    e.preventDefault();
    setRegisterError('');
    setIsLoading(true);

    // Validações
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setRegisterError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      setRegisterError('Por favor, insira um email válido');
      setIsLoading(false);
      return;
    }

    // Simular chamada de API
    setTimeout(() => {
      console.log('Conta criada:', { name: registerName, email: registerEmail });
      alert('Conta criada com sucesso! Redirecionando para o dashboard...');
      setIsLoading(false);
      
      window.location.href = '/dashboard';
    }, 1500);
  };

  const passwordStrength = (password:string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: 'Muito fraca', color: 'bg-red-500' },
      { strength: 1, label: 'Fraca', color: 'bg-orange-500' },
      { strength: 2, label: 'Razoável', color: 'bg-yellow-500' },
      { strength: 3, label: 'Boa', color: 'bg-blue-500' },
      { strength: 4, label: 'Forte', color: 'bg-green-500' },
      { strength: 5, label: 'Muito forte', color: 'bg-green-600' }
    ];

    return levels[strength];
  };

  const strength = passwordStrength(registerPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 shadow-xl">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
            EmoteTutor
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-blue-100">
            <button
              onClick={() => {
                setIsLogin(true);
                setLoginError('');
                setRegisterError('');
              }}
              className={`flex-1 py-4 text-center font-semibold transition-all ${
                isLogin
                  ? 'text-blue-900 border-b-2 border-blue-900 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setLoginError('');
                setRegisterError('');
              }}
              className={`flex-1 py-4 text-center font-semibold transition-all ${
                !isLogin
                  ? 'text-blue-900 border-b-2 border-blue-900 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <div className="p-8">
            {isLogin ? (
              // LOGIN FORM
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo de volta</h2>
                  <p className="text-gray-600">Entre com suas credenciais para continuar</p>
                </div>

                <div className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Senha
                      </label>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {loginError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-600">{loginError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Entrando...
                      </span>
                    ) : (
                      'Entrar'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // REGISTER FORM
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Criar sua conta</h2>
                  <p className="text-gray-600">Junte-se a nós e comece a transformar a comunicação</p>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength */}
                    {registerPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${strength.color} transition-all duration-300`}
                              style={{ width: `${(strength.strength / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{strength.label}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        placeholder="Repita a senha"
                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Match Indicator */}
                    {registerConfirmPassword && (
                      <div className="mt-2 flex items-center gap-2">
                        {registerPassword === registerConfirmPassword ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">As senhas coincidem</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">As senhas não coincidem</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {registerError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-600">{registerError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Criando conta...
                      </span>
                    ) : (
                      'Criar conta'
                    )}
                  </button>

                  {/* Terms */}
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Ao criar uma conta, você concorda com nossos{' '}
                    <button className="text-blue-600 hover:underline">Termos de Serviço</button>
                    {' '}e{' '}
                    <button className="text-blue-600 hover:underline">Política de Privacidade</button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}