import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShieldCheck, ArrowRight, ChevronDown, Edit3, MessageCircle, AlertCircle, Search } from 'lucide-react';
import { triggerHapticFeedback } from '@/shared/utils/haptics';

interface OnboardingStepWhatsAppProps {
  clientContact: string;
  onUpdate: (updates: { clientContact: string }) => void;
  onAdvance: () => void;
  isDetectedFromLink?: boolean;
}

interface CountryOption {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
  placeholder: string;
  digitsLength: number;
}

const COUNTRIES: CountryOption[] = [
  { code: 'MX', dialCode: '+52', name: 'México', flag: '🇲🇽', placeholder: '55 1234 5678', digitsLength: 10 },
  { code: 'US', dialCode: '+1', name: 'Estados Unidos', flag: '🇺🇸', placeholder: '415 555 2671', digitsLength: 10 },
  { code: 'CO', dialCode: '+57', name: 'Colombia', flag: '🇨🇴', placeholder: '300 123 4567', digitsLength: 10 },
  { code: 'ES', dialCode: '+34', name: 'España', flag: '🇪🇸', placeholder: '612 345 678', digitsLength: 9 },
  { code: 'AR', dialCode: '+54', name: 'Argentina', flag: '🇦🇷', placeholder: '9 11 1234 5678', digitsLength: 10 },
  { code: 'CL', dialCode: '+56', name: 'Chile', flag: '🇨🇱', placeholder: '9 1234 5678', digitsLength: 9 },
  { code: 'GT', dialCode: '+502', name: 'Guatemala', flag: '🇬🇹', placeholder: '4123 4567', digitsLength: 8 }
];

// Mexico is strictly the primary default country
const DEFAULT_COUNTRY: CountryOption = COUNTRIES[0];

export function OnboardingStepWhatsApp({
  clientContact,
  onUpdate,
  onAdvance,
  isDetectedFromLink
}: OnboardingStepWhatsAppProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Parse incoming clientContact to separate country code from local digits with Mexico as primary default
  const parseInitialNumber = () => {
    const raw = (clientContact || '').trim();
    if (!raw) {
      return { country: DEFAULT_COUNTRY, local: '', hasInitial: false };
    }

    // Check with leading + (e.g. +52, +1, +57)
    for (const c of COUNTRIES) {
      if (raw.startsWith(c.dialCode)) {
        let remaining = raw.slice(c.dialCode.length).trim();
        // Handle Mexico legacy mobile prefix (+52 1 ...)
        if (c.code === 'MX' && remaining.startsWith('1') && remaining.length > 10) {
          remaining = remaining.slice(1).trim();
        }
        return { country: c, local: remaining, hasInitial: remaining.replace(/\D/g, '').length >= 7 };
      }
    }

    // Check without leading + (e.g. 5255..., 52155...)
    for (const c of COUNTRIES) {
      const bareDial = c.dialCode.replace('+', '');
      if (raw.startsWith(bareDial)) {
        let remaining = raw.slice(bareDial.length).trim();
        if (c.code === 'MX' && remaining.startsWith('1') && remaining.length > 10) {
          remaining = remaining.slice(1).trim();
        }
        return { country: c, local: remaining, hasInitial: remaining.replace(/\D/g, '').length >= 7 };
      }
    }

    // Default to Mexico for any standard 10-digit number
    const digitsOnly = raw.replace(/\D/g, '');
    return { country: DEFAULT_COUNTRY, local: digitsOnly, hasInitial: digitsOnly.length >= 7 };
  };

  const initialParsed = parseInitialNumber();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(initialParsed.country);
  const [localNumber, setLocalNumber] = useState<string>(initialParsed.local);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(!initialParsed.hasInitial);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');

  const triggerShake = () => {
    setIsShaking(true);
    triggerHapticFeedback(40);
    setTimeout(() => setIsShaking(false), 500);
    inputRef.current?.focus();
  };

  // Format phone number into clean spaces: e.g. "55 1234 5678"
  const formatLocalNumber = (val: string, country: CountryOption) => {
    const digits = val.replace(/\D/g, '').slice(0, country.digitsLength);
    if (country.code === 'MX' || country.code === 'US' || country.code === 'CO') {
      if (digits.length <= 2) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    }
    if (country.code === 'GT') {
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)} ${digits.slice(4, 8)}`;
    }
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  // Check validation: at least minimum digits for that country
  const digitsOnly = localNumber.replace(/\D/g, '');
  const isValid = digitsOnly.length >= (selectedCountry.digitsLength <= 8 ? selectedCountry.digitsLength : 10);

  // Sync back to parent whenever country or local number changes with intelligent cursor preservation
  const handleLocalNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError('');
    const rawText = e.target.value;
    const inputEl = e.target;
    const prevCursorPos = inputEl.selectionStart || 0;
    
    // Count how many digits were before the cursor in the unformatted string
    const digitsBeforeCursor = rawText.slice(0, prevCursorPos).replace(/\D/g, '').length;

    const formatted = formatLocalNumber(rawText, selectedCountry);
    setLocalNumber(formatted);
    const fullNumber = formatted ? `${selectedCountry.dialCode} ${formatted}` : '';
    onUpdate({ clientContact: fullNumber });

    // Restore cursor position corresponding to the digit count
    requestAnimationFrame(() => {
      if (inputRef.current) {
        let newPos = 0;
        let count = 0;
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) {
            count++;
          }
          if (count === digitsBeforeCursor) {
            newPos = i + 1;
            break;
          }
        }
        // If cursor was at beginning or no digits before cursor
        if (digitsBeforeCursor === 0) {
          newPos = 0;
        } else if (newPos === 0 && count < digitsBeforeCursor) {
          newPos = formatted.length;
        }
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    });

    // Auto-dismiss numeric keyboard and auto-focus Continue button when completing digits
    const digits = rawText.replace(/\D/g, '');
    if (digits.length >= selectedCountry.digitsLength) {
      // 1. Hide on-screen mobile numeric keyboard by blurring input
      inputRef.current?.blur();
      
      // 2. Programmatically focus Continue button to accelerate booking flow
      setTimeout(() => {
        continueButtonRef.current?.focus();
        triggerHapticFeedback(12);
      }, 50);
    }
  };

  const handleCountrySelect = (country: CountryOption) => {
    setSelectedCountry(country);
    setIsCountryPickerOpen(false);
    setCountrySearchQuery('');
    setError('');
    const formatted = formatLocalNumber(localNumber, country);
    setLocalNumber(formatted);
    const fullNumber = formatted ? `${country.dialCode} ${formatted}` : '';
    onUpdate({ clientContact: fullNumber });

    const digits = formatted.replace(/\D/g, '');
    if (digits.length >= country.digitsLength) {
      inputRef.current?.blur();
      setTimeout(() => {
        continueButtonRef.current?.focus();
      }, 50);
    }
  };

  const handleConfirmDetected = () => {
    const formatted = formatLocalNumber(localNumber, selectedCountry);
    const fullNumber = formatted ? `${selectedCountry.dialCode} ${formatted}` : `${selectedCountry.dialCode} ${localNumber}`;
    onUpdate({ clientContact: fullNumber });
    onAdvance();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isValid) {
      if (digitsOnly.length === 0) {
        setError(`Ingresa tu número de WhatsApp (${selectedCountry.digitsLength} dígitos)`);
      } else {
        const remaining = selectedCountry.digitsLength - digitsOnly.length;
        setError(`Faltan ${remaining} ${remaining === 1 ? 'dígito' : 'dígitos'} (${digitsOnly.length} de ${selectedCountry.digitsLength})`);
      }
      triggerShake();
      return;
    }
    setError('');
    onAdvance();
  };

  const filteredCountries = useMemo(() => {
    const query = countrySearchQuery.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(
      c => c.name.toLowerCase().includes(query) || c.dialCode.includes(query)
    );
  }, [countrySearchQuery]);

  useEffect(() => {
    if (isCountryPickerOpen) {
      // Focus after a short delay to allow the animation to start and the element to render
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isCountryPickerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCountryPickerOpen) {
        setIsCountryPickerOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCountryPickerOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as any, stiffness: 350, damping: 25 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="w-full max-w-md mx-auto space-y-3.5 sm:space-y-4 text-[#1D1D1F]"
    >
      <motion.div variants={itemVariants} className="space-y-1 text-left">
        <h2 className="text-lg sm:text-2xl font-black text-[#1D1D1F] tracking-tight">
          Tu número de WhatsApp
        </h2>
        <p className="text-xs text-[#86868B] leading-relaxed">
          Requerido para enviarte la confirmación y recordatorio de tu cita.
        </p>
      </motion.div>

      {/* 1-Tap Confirmation Card when prefilled/detected from link or profile */}
      <AnimatePresence mode="wait">
        {!isEditing && initialParsed.hasInitial ? (
          <motion.div 
            key="confirmation-card"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="p-3.5 sm:p-4.5 rounded-2xl bg-white border border-pink-100/90 shadow-md space-y-3"
          >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="size-10 sm:size-11 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-sm flex items-center justify-center border border-emerald-200 shrink-0 shadow-sm">
              <MessageCircle className="size-5" />
            </div>

            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9.5px] sm:text-[10px] text-[#86868B] font-bold uppercase tracking-wider">
                  WhatsApp detectado
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  {isDetectedFromLink ? 'Desde Enlace' : 'Verificado'}
                </span>
              </div>
              <span className="text-sm sm:text-base font-black text-[#1D1D1F] flex items-center gap-1.5 mt-0.5 truncate">
                <span className="text-base leading-none shrink-0">{selectedCountry.flag}</span>
                <span className="truncate">{selectedCountry.dialCode} {formatLocalNumber(localNumber, selectedCountry)}</span>
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsEditing(true)}
              className="size-10 min-h-[44px] min-w-[44px] rounded-xl bg-pink-50/80 hover:bg-pink-100 text-[#E05286] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Cambiar WhatsApp"
            >
              <Edit3 className="size-4" />
            </motion.button>
          </div>

          {/* Quick 1-Tap Confirmation Action with full 44px min-height */}
          <div className="flex items-center gap-2 pt-1">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: '#d04377' }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleConfirmDetected}
              className="flex-1 min-h-[44px] h-11 rounded-xl bg-[#E05286] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Check className="size-4 stroke-[3]" />
              <span className="truncate">Sí, confirmar WhatsApp</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setIsEditing(true)}
              className="min-h-[44px] h-11 px-3.5 sm:px-4 rounded-xl bg-white border border-pink-200 text-[#86868B] hover:text-[#1D1D1F] font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              Cambiar
            </motion.button>
          </div>
        </motion.div>
      ) : (
        /* Manual Entry / Change view with inline Flag dropdown and Number input */
        <motion.form 
          key="edit-form"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          onSubmit={handleSubmit} 
          className="space-y-3 text-left"
        >
          {/* Input Container with Shake Animation on invalid submission */}
          <motion.div
            animate={isShaking ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition-all duration-200 space-y-3 relative ${
              error ? 'border-red-300 ring-2 ring-red-100 shadow-md' : 'border-pink-100 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="whatsapp-local-input" className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block">
                WhatsApp de contacto *
              </label>
              <span className="text-[10px] font-semibold text-[#86868B]">
                {digitsOnly.length}/{selectedCountry.digitsLength} dígitos
              </span>
            </div>

            {/* Unified Row: Country Flag & Code + Local Phone Input */}
            <div className="flex items-center gap-2">
              {/* Country Selector Button */}
              <div className="relative shrink-0">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsCountryPickerOpen(prev => !prev)}
                  className="min-h-[44px] h-11 px-2.5 sm:px-3 rounded-xl bg-pink-50/70 hover:bg-pink-100/80 border border-pink-100 text-[#1D1D1F] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0"
                  title={`Cambiar país (${selectedCountry.name})`}
                >
                  <span className="text-base leading-none">{selectedCountry.flag}</span>
                  <span className="font-extrabold text-neutral-800">{selectedCountry.dialCode}</span>
                  <ChevronDown className={`size-3 text-[#86868B] transition-transform duration-200 ${isCountryPickerOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Country Picker Dropdown with accessible touch items */}
                <AnimatePresence>
                  {isCountryPickerOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsCountryPickerOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring" as any, stiffness: 350, damping: 25 }}
                        className="absolute left-0 top-12 z-50 w-60 sm:w-68 max-w-[calc(100vw-2.5rem)] rounded-2xl bg-white border border-pink-100 shadow-xl py-1.5 max-h-60 overflow-y-auto custom-scrollbar"
                      >
                        <div className="sticky top-0 bg-white z-10 px-3 pb-2 pt-3 border-b border-pink-50 shadow-sm">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[#86868B]" />
                            <input
                              ref={searchInputRef}
                              type="text"
                              value={countrySearchQuery}
                              onChange={(e) => setCountrySearchQuery(e.target.value)}
                              placeholder="Buscar país o código..."
                              className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-all text-[#1D1D1F] placeholder:text-neutral-400"
                              autoFocus
                            />
                          </div>
                        </div>
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => handleCountrySelect(c)}
                              className={`w-full min-h-[44px] px-3.5 py-2.5 text-left flex items-center justify-between text-xs sm:text-sm transition-colors cursor-pointer ${
                                selectedCountry.code === c.code
                                  ? 'bg-pink-50/80 font-black text-[#E05286]'
                                  : 'hover:bg-neutral-50 text-[#1D1D1F] font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                <span className="text-base leading-none shrink-0">{c.flag}</span>
                                <span className="truncate">{c.name}</span>
                              </div>
                              <span className="text-[11px] font-mono text-[#86868B] font-bold shrink-0">{c.dialCode}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-3.5 py-4 text-center text-xs text-[#86868B]">
                            No se encontraron resultados
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Local Phone Input with iOS zoom-prevention font size and 44px min-height */}
              <div className="flex-1 min-w-0 relative flex items-center">
                <input
                  ref={inputRef}
                  id="whatsapp-local-input"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="tel"
                  value={localNumber}
                  onChange={handleLocalNumberChange}
                  placeholder={selectedCountry.placeholder}
                  autoFocus
                  className={`w-full min-h-[44px] h-11 px-3 sm:px-3.5 rounded-xl border text-base font-black placeholder:text-neutral-300 focus:outline-none transition-all duration-300 tracking-wider ${
                    error
                      ? 'bg-red-50/40 border-red-300 focus:border-red-500 focus:bg-white text-red-950 ring-2 ring-red-100'
                      : isValid
                        ? 'bg-emerald-50/30 border-emerald-400 focus:border-emerald-500 focus:bg-white text-[#1D1D1F] ring-2 ring-emerald-300/60 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                        : 'bg-neutral-50 border-pink-100/80 focus:border-[#E05286] focus:bg-white text-[#1D1D1F]'
                  }`}
                />
                <AnimatePresence>
                  {isValid && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }} 
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-3 size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/30"
                    >
                      <Check className="size-3 stroke-[3]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* High-visibility animated error alert */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-200 shadow-xs"
                >
                  <AlertCircle className="size-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-[#86868B] pt-2 border-t border-neutral-100">
              <ShieldCheck className="size-3.5 text-[#E05286] shrink-0" />
              <span>Tus datos son 100% privados y solo para uso de tu cita.</span>
            </div>
          </motion.div>

          <motion.button
            ref={continueButtonRef}
            id="whatsapp-continue-button"
            whileHover={isValid ? { scale: 1.02, backgroundColor: '#d04377' } : { scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            animate={
              isValid 
                ? { 
                    scale: [1, 1.02, 1], 
                    boxShadow: [
                      "0 4px 6px -1px rgba(236, 72, 153, 0.1), 0 2px 4px -1px rgba(236, 72, 153, 0.06)",
                      "0 10px 15px -3px rgba(236, 72, 153, 0.3), 0 4px 6px -2px rgba(236, 72, 153, 0.15)",
                      "0 4px 6px -1px rgba(236, 72, 153, 0.1), 0 2px 4px -1px rgba(236, 72, 153, 0.06)"
                    ]
                  } 
                : { scale: 1, boxShadow: "none" }
            }
            transition={
              isValid 
                ? { 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  } 
                : {}
            }
            type="submit"
            className={`w-full min-h-[44px] h-11 sm:h-12 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E05286] focus-visible:ring-offset-2 ${
              isValid
                ? 'bg-[#E05286] text-white'
                : 'bg-pink-50/80 text-[#E05286] hover:bg-pink-100/90 border border-pink-200/80'
            }`}
          >
            <span>Continuar</span>
            <ArrowRight className="size-3.5 stroke-[3]" />
          </motion.button>
        </motion.form>
      )}
      </AnimatePresence>
    </motion.div>
  );
}
