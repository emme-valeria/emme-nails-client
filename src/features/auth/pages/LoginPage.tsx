import React, { useState, useEffect } from 'react';
import { useApp } from '@/app/AppContext';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function LoginPage() {
  const { loginWithProvider, loginWithWhatsApp } = useApp();
  
  const [viewMode, setViewMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [countryCode, setCountryCode] = useState('+52');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [phoneError, setPhoneError] = useState(false);
  const [otpError, setOtpError] = useState(false);

  useEffect(() => {
    // Detect country by IP
    const detectCountry = async () => {
      try {
        const response = await fetch('https://get.geojs.io/v1/ip/country.json');
        const data = await response.json();
        
        const countryToDialCode: Record<string, string> = {
          'MX': '+52',
          'US': '+1',
          'ES': '+34',
          'AR': '+54',
          'CO': '+57',
          'CL': '+56',
          'PE': '+51'
        };
        
        if (data.country && countryToDialCode[data.country]) {
          setCountryCode(countryToDialCode[data.country]);
        }
      } catch (error) {
        // Silently fail and keep default +52
        console.error('Failed to detect country by IP', error);
      }
    };
    
    detectCountry();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOTPInput && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTPInput, resendTimer]);

  const handleProviderLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      await loginWithProvider(provider);
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanNumber.length !== 10) {
      setPhoneError(true);
      setTimeout(() => setPhoneError(false), 600); // Reset animation class after it plays
      return;
    }
    
    setLoading(true);
    setPhoneError(false);
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowOTPInput(true);
      setResendTimer(30);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendTimer(30);
      setOtpCode('');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 600); // Reset animation class
      return;
    }
    
    setLoading(true);
    setOtpError(false);
    try {
      // Pass the full phone number to context, removing visual spaces
      await loginWithWhatsApp(`${countryCode}${phoneNumber.replace(/\D/g, '')}`);
    } finally {
      setLoading(false);
      setShowOTPInput(false);
      setShowPhoneInput(false);
      setOtpCode('');
      setPhoneNumber('');
      setResendTimer(0);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#A81F4E] flex flex-col relative overflow-hidden font-sans">
      {/* Top Section with Mascot & gradient ending at the white card */}
      <div className="h-[30vh] sm:h-[35vh] flex flex-col items-center justify-end relative pb-0 z-30 bg-gradient-to-b from-[#F26B9D] via-[#E05286] to-[#A81F4E] shrink-0">
        {/* Mascot bunny peeking over and resting in front of the card */}
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 -mb-6 sm:-mb-8 shrink-0 filter drop-shadow-2xl">
          <img 
            src="/rabbit.png" 
            alt="Mascot Bunny" 
            className="w-full h-full object-contain object-bottom select-none pointer-events-none"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.endsWith('/rabbit.svg')) {
                target.src = '/rabbit.svg';
              }
            }}
          />
        </div>
      </div>

      {/* Bottom White Card expanded to cover more screen */}
      <div className="flex-1 bg-white w-full rounded-t-[40px] sm:rounded-t-[48px] px-8 sm:px-10 pt-10 pb-16 sm:pt-12 sm:pb-20 z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col items-center justify-between relative">
        {(showPhoneInput || showOTPInput) && (
          <button 
            onClick={() => {
              if (showOTPInput) {
                setShowOTPInput(false);
                setOtpCode('');
                setShowPhoneInput(true);
              } else {
                setShowPhoneInput(false);
              }
            }}
            className="absolute top-6 left-6 p-2 text-zinc-400 hover:text-zinc-600 transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="w-full max-w-sm flex flex-col items-center mt-2 sm:mt-4">
          {/* Header */}
          <div className="text-center mb-6 w-full">
            {showOTPInput || showPhoneInput ? (
              <h1 className="text-3xl sm:text-[36px] font-extrabold tracking-tight leading-tight">
                <span className="text-gray-900">emme </span>
                <span className="text-[#D64771]">studio</span>
              </h1>
            ) : (
              <>
                <h1 className="text-2xl sm:text-[32px] font-extrabold text-gray-900 tracking-tight leading-tight">
                  {viewMode === 'register' ? 'Crea tu cuenta en' : 'Bienvenida tu cita en'} <br />
                  <span className="text-[#D64771]">emme studio</span>
                </h1>
                <p className="mt-2 text-sm text-[#6E6E73] font-medium">
                  Cotiza y agenda tu cita en 3 taps
                </p>
              </>
            )}
          </div>

          {/* Action Buttons: Iniciar sesión con Google y WhatsApp */}
          <div className="w-full mt-6 relative">
            <AnimatePresence mode="wait">
              {showOTPInput ? (
                <motion.form 
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  onSubmit={verifyOTP} 
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3 mb-2 px-1">
                    <div className="w-10 h-10 shrink-0 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[15px] text-[#1D1D1F] font-semibold leading-tight">
                        Ingresa tu código
                      </p>
                      <p className="text-[14px] text-zinc-600 mt-0.5">
                        Enviado a {countryCode} {phoneNumber}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <input 
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="- - - - - -"
                      className={`w-full h-[52px] sm:h-14 px-5 rounded-[24px] border focus:outline-none focus:ring-1 text-[#1D1D1F] text-center text-xl tracking-[0.5em] font-bold placeholder:text-gray-300 placeholder:tracking-normal transition-colors
                        ${otpError 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50/50 animate-shake' 
                          : 'border-gray-200 focus:border-[#25D366] focus:ring-[#25D366]'
                        }`}
                      value={otpCode}
                      onChange={(e) => {
                        setOtpError(false);
                        setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                      }}
                      autoFocus
                    />
                    {otpError && (
                      <p className="text-red-500 text-[13px] font-medium text-center animate-in fade-in slide-in-from-top-1 mt-2">
                        El código debe tener 6 dígitos.
                      </p>
                    )}
                  </div>
                  <div className="mt-1 w-full">
                    <button
                      type="submit"
                      disabled={otpCode.length < 4 || loading}
                      className="w-full h-[48px] bg-gradient-to-r from-[#D84C7B] to-[#F26B9D] hover:from-[#C23C67] hover:to-[#E05286] text-white rounded-full font-semibold disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-white/20 active:scale-[0.98]"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Verificar"
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || loading}
                    className="w-full h-[48px] mt-1 rounded-full text-[#6E6E73] hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    {resendTimer > 0 ? `Reenviar código en ${resendTimer}s` : "Reenviar código"}
                  </button>
                </motion.form>
              ) : showPhoneInput ? (
                <motion.form 
                  key="phone-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  onSubmit={requestOTP} 
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3 mb-1 px-1">
                    <div className="w-10 h-10 shrink-0 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[15px] text-[#1D1D1F] font-semibold leading-tight">
                        Tu número de WhatsApp
                      </p>
                      <p className="text-[14px] text-zinc-600 mt-0.5">
                        Para enviarte un código de seguridad
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center w-full mt-2 rounded-[24px] border bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#D84C7B]/30 focus-within:border-[#D84C7B] overflow-hidden ${phoneError ? 'border-red-500 bg-red-50/50 animate-shake focus-within:ring-red-500/30 focus-within:border-red-500' : 'border-zinc-200'}`}>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-[52px] sm:h-14 pl-4 pr-6 bg-transparent border-none focus:ring-0 text-[#1D1D1F] text-[14px] sm:text-[15px] appearance-none cursor-pointer outline-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236E6E73\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '16px' }}
                    >
                      <option value="+52">🇲🇽 +52</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+54">🇦🇷 +54</option>
                      <option value="+57">🇨🇴 +57</option>
                      <option value="+56">🇨🇱 +56</option>
                      <option value="+51">🇵🇪 +51</option>
                    </select>
                    
                    <div className="w-px h-6 bg-zinc-200 mx-1"></div>
                    
                    <input 
                      type="tel"
                      autoComplete="tel-national"
                      placeholder="Tu número"
                      className="flex-1 min-w-0 w-full h-[52px] sm:h-14 px-3 bg-transparent border-none focus:ring-0 text-[#1D1D1F] text-[15px] outline-none"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneError(false); // Clear error on typing
                        let val = e.target.value;
                        
                        // Check if user pasted a number with a known country code
                        if (val.trim().startsWith('+')) {
                          const knownCodes = ['+52', '+1', '+34', '+54', '+57', '+56', '+51'];
                          const matchedCode = knownCodes.find(code => val.trim().startsWith(code));
                          
                          if (matchedCode) {
                            setCountryCode(matchedCode);
                            val = val.trim().substring(matchedCode.length);
                          } else {
                            // If unknown + code, just strip it to avoid duplication
                            val = val.replace(/^\+\d{1,3}\s?/, '');
                          }
                        } else if (val.includes(countryCode)) {
                          // Fallback: clean country code if it matches current selection without +
                          val = val.replace(countryCode, '');
                        }
                        
                        // Extraer solo números
                        let cleaned = val.replace(/\D/g, '');
                        
                        // Formatear agrupando de a 3 y 4 dígitos (ej: 123 456 7890)
                        let formatted = cleaned;
                        if (cleaned.length > 6) {
                          formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
                        } else if (cleaned.length > 3) {
                          formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
                        }
                        
                        setPhoneNumber(formatted.trim());
                      }}
                      autoFocus
                    />
                  </div>
                  {phoneError && (
                    <p className="text-red-500 text-[13px] font-medium px-2 animate-in fade-in slide-in-from-top-1 mt-1">
                      El número debe tener exactamente 10 dígitos.
                    </p>
                  )}
                  <div className="mt-1 w-full">
                    <button
                      type="submit"
                      disabled={!phoneNumber || loading}
                      className="w-full h-[48px] bg-gradient-to-r from-[#D84C7B] to-[#F26B9D] hover:from-[#C23C67] hover:to-[#E05286] text-white rounded-full font-semibold disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-white/20 active:scale-[0.98]"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Continuar"
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="login-buttons"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex flex-col gap-4"
                >
                  <button
                    type="button"
                    onClick={() => handleProviderLogin('google')}
                    disabled={loading}
                    className="w-full h-[52px] sm:h-14 bg-gradient-to-r from-[#D84C7B] to-[#F26B9D] hover:from-[#C23C67] hover:to-[#E05286] text-white rounded-full font-semibold text-[15px] sm:text-[16px] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60 border border-white/20"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>{viewMode === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}</span>
                  </button>
  
                  <button
                    type="button"
                    onClick={() => setShowPhoneInput(true)}
                    disabled={loading}
                    className="w-full h-[52px] sm:h-14 bg-gradient-to-r from-[#D84C7B] to-[#F26B9D] hover:from-[#C23C67] hover:to-[#E05286] text-white rounded-full font-semibold text-[15px] sm:text-[16px] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60 border border-white/20"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>{viewMode === 'login' ? 'Continuar con WhatsApp' : 'Registrarse con WhatsApp'}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="w-full max-w-sm mt-8 mb-2 border-t border-gray-100 pt-6 text-center text-[14px] sm:text-[15px] text-[#6E6E73] font-medium">
          {viewMode === 'login' ? (
            <>
              ¿No tienes una cuenta?{' '}
              <button 
                onClick={() => setViewMode('register')}
                className="text-[#D84C7B] font-bold hover:text-[#C23C67] hover:underline transition-colors"
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes una cuenta?{' '}
              <button 
                onClick={() => setViewMode('login')}
                className="text-[#D84C7B] font-bold hover:text-[#C23C67] hover:underline transition-colors"
              >
                Iniciar Sesión
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
