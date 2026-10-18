import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp, type Appointment, type Service } from '@/app/AppContext';
import { Button } from '@emme/ui/button';
import { Input } from '@emme/ui/input';
import { Badge } from '@emme/ui/badge';
import { 
  Sparkles, Send, Mic, MicOff, Image as ImageIcon, Camera, Calendar, Clock, 
  CheckCircle2, AlertCircle, X, ChevronRight, Share2, MessageSquare, Bot, 
  User, RefreshCw, Star, Heart, DollarSign, Layers, ShieldCheck, Award, Wand2,
  Gift, CheckSquare, Upload, Maximize2, Minimize2, ArrowLeft, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@emme/ui/lib/utils';
import { StaffMember, STAFF_MEMBERS } from '@/features/staff';

import { useChatStore, WidgetType } from '../state/useChatStore';
import {
  ServiceCatalogChatWidget,
  StaffSelectorChatWidget,
  LoyaltyPerksChatWidget,
  StyleAdvisorChatWidget,
  AftercareGuideChatWidget,
  PhotoQuoteChatWidget,
  AppointmentBookingFlowChatWidget,
  AppointmentWizardChatWidget,
  ProposalAppointmentChatWidget,
  SecureDepositCheckoutChatWidget,
  ConfirmedBookingPassChatWidget,
  NailQuoteCustomizerWidget,
  LashSelectorChatWidget,
  GeminiMultimodalNailQuoteWidget
} from './chat-widgets';
import { useBookingStore } from '@/features/appointments/state/booking.store';
import { AppointmentWizardModal } from '@/features/appointments/components/AppointmentWizardModal';
import { NailCategoryExtractionCard } from '@/features/assisted-design/ui/NailCategoryExtractionCard';
import { 
  sendGeminiChatMessage, 
  analyzeNailReferenceWithGemini, 
  type GeminiNailImageAnalysis 
} from '@/shared/services/geminiService';
import { optimizeImageForAI } from '@/shared/utils/imageOptimizer';
import { triggerHaptic } from '@/shared/utils/haptics';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  type?: 'text' | 'voice' | 'image' | 'proposal' | 'widget';
  widgetType?: 'catalog' | 'staff' | 'booking_flow' | 'wizard_flow' | 'proposal_appointment' | 'secure_deposit' | 'confirmed_pass' | 'loyalty' | 'style_advisor' | 'aftercare' | 'photo_quote' | 'nail_quote_customizer' | 'lash_selector';
  suggestedReplies?: string[];
  audioUrl?: string;
  duration?: number;
  imageUrl?: string;
  passData?: any;
  geminiAnalysis?: GeminiNailImageAnalysis;
  imageAnalysis?: {
    style: string;
    complexity: string;
    durationMinutes: number;
    estimatedPrice: number;
    recommendedService: string;
  };
  proposal?: {
    serviceId: string;
    serviceName: string;
    dateStr: string;
    startTime: string;
    endTime: string;
    price: number;
    staffName?: string;
    confirmed?: boolean;
    appointmentId?: string;
  };
  checkoutData?: {
    serviceId: string;
    serviceName: string;
    staffName: string;
    dateStr: string;
    timeStr: string;
    totalPrice: number;
    depositAmount: number;
  };
}

export function EmmeAiChatWidget({ isFloating = false, onClose }: { isFloating?: boolean; onClose?: () => void }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { services, clients, appointments, addAppointment, profile } = useApp();
  const { 
    activeWidget, 
    setActiveWidget, 
    reservation,
    selectService, 
    selectStaff, 
    selectDateTime, 
    prefillFromProposal, 
    applyLoyaltyPoints,
    confirmDirectBooking,
    resetReservation 
  } = useChatStore();
  const [isWizardModalOpen, setIsWizardModalOpen] = useState(false);
  const [expandedWidgetIds, setExpandedWidgetIds] = useState<Record<string, boolean>>({});

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      timestamp: format(new Date(), 'HH:mm'),
      type: 'text',
      text: `¡Hola! 🌸 Soy tu asistente IA de emme studio.`
    }
  ]);

  const welcomeTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const startWelcomeSequence = () => {
    welcomeTimeoutsRef.current.forEach(clearTimeout);
    welcomeTimeoutsRef.current = [];

    setMessages([
      {
        id: 'welcome-1',
        sender: 'assistant',
        timestamp: format(new Date(), 'HH:mm'),
        type: 'text',
        text: `¡Hola! 🌸 Soy tu asistente IA de emme studio.`
      }
    ]);
    setIsThinking(false);

    const t1 = setTimeout(() => {
      setIsThinking(true);
    }, 450);

    const t2 = setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => {
        if (prev.some(m => m.id === 'welcome-2')) return prev;
        return [
          ...prev,
          {
            id: 'welcome-2',
            sender: 'assistant',
            timestamp: format(new Date(), 'HH:mm'),
            type: 'text',
            text: `Puedo ayudarte a agendar en segundos o cotizar tu diseño. ¿Qué nos hacemos hoy? 💅🏻`
          }
        ];
      });
    }, 1700);

    welcomeTimeoutsRef.current.push(t1, t2);
  };

  // Initial animated message sequence (Message 1 -> Typing "..." -> Message 2)
  useEffect(() => {
    startWelcomeSequence();
    return () => {
      welcomeTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Deep-link mode handler from navigation or submenus
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'aftercare') {
      setMessages(prev => {
        if (prev.some(m => m.widgetType === 'aftercare')) return prev;
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: 'assistant',
            timestamp: format(new Date(), 'HH:mm'),
            type: 'widget',
            widgetType: 'aftercare',
            text: '💡 **Guía de Cuidados de Uñas:**\nAquí tienes las recomendaciones profesionales para mantener tus uñas impecables por más de 3 semanas:',
            suggestedReplies: [
              'Quiero agendar mi retoque para dentro de 21 días',
              'Ver catálogo de servicios',
              'Ver mis Puntos Emme Club'
            ]
          }
        ];
      });
    } else if (mode === 'quote') {
      setMessages(prev => {
        if (prev.some(m => m.widgetType === 'photo_quote')) return prev;
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: 'assistant',
            timestamp: format(new Date(), 'HH:mm'),
            type: 'widget',
            widgetType: 'photo_quote',
            text: '📸 **Cotizador Inteligente con Foto & Nail Art:**\nSube una foto de Instagram o Pinterest o personaliza tu diseño a continuación:',
            suggestedReplies: [
              'Ver catálogo de servicios',
              'Elegir mi especialista',
              'Reserva guiada por pasos'
            ]
          }
        ];
      });
    }
  }, [searchParams]);

  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTimer(0);
    timerRef.current = setInterval(() => {
      setRecordingTimer(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    
    const transcribedText = "Quiero agendar una Manicura Rusa para mañana a las 11:00 AM";
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      timestamp: format(new Date(), 'HH:mm'),
      type: 'voice',
      text: transcribedText,
      duration: recordingTimer || 4
    };

    setMessages(prev => [...prev, newMsg]);
    setRecordingTimer(0);
    setIsThinking(true);

    setTimeout(() => {
      processAiResponse(transcribedText);
    }, 700);
  };

  const handleSendMessage = (textToSend?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalQuery = textToSend || inputValue.trim();
    if (!finalQuery) return;

    // Trigger file picker if user requested photo quoting explicitly
    const textLower = finalQuery.toLowerCase();
    if (textLower.includes('cotizar foto') || textLower.includes('foto de mi galería') || textLower.includes('subir foto')) {
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 300);
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      timestamp: format(new Date(), 'HH:mm'),
      type: 'text',
      text: finalQuery
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      processAiResponse(finalQuery);
    }, 700);
  };

  const processAiResponse = (userText: string) => {
    setIsThinking(true);
    const textLower = userText.toLowerCase();

    // Helper to detect and sync entities with reservation store reducer
    const detectAndSyncReservationEntities = () => {
      // 1. Match Service
      const matchedService = services.find(s => 
        textLower.includes(s.name.toLowerCase()) || 
        (textLower.includes('rusa') && s.name.toLowerCase().includes('rusa')) ||
        (textLower.includes('soft gel') && s.name.toLowerCase().includes('soft')) ||
        (textLower.includes('acrílica') && s.name.toLowerCase().includes('acrílic')) ||
        (textLower.includes('acrilica') && s.name.toLowerCase().includes('acrílic')) ||
        (textLower.includes('pedicure') && s.name.toLowerCase().includes('pedicure')) ||
        (textLower.includes('spa') && s.name.toLowerCase().includes('spa'))
      );
      if (matchedService) {
        selectService({
          id: matchedService.id,
          name: matchedService.name,
          category: matchedService.category,
          price: matchedService.price,
          duration: matchedService.duration
        });
      }

      // 2. Match Staff
      const matchedStaff = STAFF_MEMBERS.find(st => 
        textLower.includes(st.name.toLowerCase()) ||
        (textLower.includes('valeria') && st.name.toLowerCase().includes('valeria')) ||
        (textLower.includes('sofia') && st.name.toLowerCase().includes('sofia')) ||
        (textLower.includes('camila') && st.name.toLowerCase().includes('camila')) ||
        (textLower.includes('elena') && st.name.toLowerCase().includes('elena'))
      );
      if (matchedStaff) {
        selectStaff({
          id: matchedStaff.id,
          name: matchedStaff.name,
          role: matchedStaff.role,
          avatar: matchedStaff.avatar
        });
      }

      // 3. Match Date
      let resolvedDate = reservation.dateStr || format(addDays(new Date(), 1), 'yyyy-MM-dd');
      if (textLower.includes('hoy')) {
        resolvedDate = format(new Date(), 'yyyy-MM-dd');
      } else if (textLower.includes('mañana') || textLower.includes('manana')) {
        resolvedDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');
      } else if (textLower.includes('pasado mañana')) {
        resolvedDate = format(addDays(new Date(), 2), 'yyyy-MM-dd');
      }

      // 4. Match Time
      const timeMatch = textLower.match(/(\d{1,2}:\d{2})|(\d{1,2}\s*(am|pm))/i);
      let resolvedTime = reservation.timeStr || '11:30';
      if (timeMatch) {
        if (timeMatch[1]) {
          resolvedTime = timeMatch[1].padStart(5, '0');
        } else if (timeMatch[2]) {
          const rawHour = parseInt(timeMatch[0], 10);
          const isPm = textLower.includes('pm');
          const hour24 = isPm && rawHour < 12 ? rawHour + 12 : rawHour;
          resolvedTime = `${String(hour24).padStart(2, '0')}:00`;
        }
      }

      selectDateTime(resolvedDate, resolvedTime);

      return {
        service: matchedService || services.find(s => s.id === reservation.serviceId) || services[1] || services[0],
        staff: matchedStaff || STAFF_MEMBERS.find(st => st.id === reservation.staffId) || STAFF_MEMBERS[0],
        date: resolvedDate,
        time: resolvedTime
      };
    };

    // 1. Booking flow (Step-by-step Zustand widget)
    if (textLower.includes('pasos') || textLower.includes('guiada') || textLower.includes('reserva guiada') || textLower.includes('paso a paso')) {
      detectAndSyncReservationEntities();
      setActiveWidget('booking_flow');
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'booking_flow',
          text: '✨ **Reserva Interactiva Guiada por Pasos:**\nCompleta la selección de tu tratamiento, especialista y horario en este widget interactivo:',
          suggestedReplies: [
            'Ver catálogo de servicios',
            'Elegir especialista',
            'Cotizar foto de mi galería'
          ]
        }]);
      }, 800);
      return;
    }

    // 2. Catalog request
    if (textLower.includes('catálogo') || textLower.includes('servicios') || textLower.includes('tratamientos') || textLower.includes('precios')) {
      setActiveWidget('catalog');
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'catalog',
          text: 'Aquí tienes nuestro catálogo interactivo de servicios. Puedes filtrar por categoría o agendar directamente:',
          suggestedReplies: [
            'Reserva guiada por pasos',
            '¿Quién me puede atender?',
            'Recomiéndame un estilo'
          ]
        }]);
      }, 800);
      return;
    }

    // 3. Staff / Specialists request
    if (textLower.includes('especialista') || textLower.includes('quién') || textLower.includes('quien') || textLower.includes('staff') || textLower.includes('valeria') || textLower.includes('emme')) {
      setActiveWidget('staff');
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'staff',
          text: 'Conoce a nuestro equipo de manicuristas y especialistas en Nail Art:',
          suggestedReplies: [
            'Agendar con Valeria Arriaza',
            'Ver catálogo de servicios',
            'Reserva guiada por pasos'
          ]
        }]);
      }, 800);
      return;
    }

    // 3. Loyalty points request
    if (textLower.includes('puntos') || textLower.includes('fidelidad') || textLower.includes('canjear') || textLower.includes('club') || textLower.includes('descuento')) {
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'loyalty',
          text: '🎁 **Estado de tu Membresía Emme Club:**\nSelecciona el beneficio que deseas aplicar a tu próxima cita:',
          suggestedReplies: [
            'Agendar cita aplicando mis puntos',
            'Ver cuidados de uñas',
            'Elegir especialista'
          ]
        }]);
      }, 800);
      return;
    }

    // 3b. Lashes selector request
    if (textLower.includes('pestaña') || textLower.includes('pestana') || textLower.includes('lash') || textLower.includes('lifting') || textLower.includes('volumen ruso') || textLower.includes('híbrida') || textLower.includes('hibrida')) {
      setActiveWidget('lash_selector');
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'lash_selector',
          text: '👁️ **Selector Inteligente de Pestañas (Lashes):**\nSelecciona el estilo que buscas y confirma en 1 clic:',
          suggestedReplies: [
            'Pagar depósito seguro',
            'Ver catálogo de servicios',
            'Elegir mi especialista'
          ]
        }]);
      }, 700);
      return;
    }

    // 4. Style advisor request
    if (textLower.includes('recomiéndame') || textLower.includes('recomiendame') || textLower.includes('estilo') || textLower.includes('sugerencia') || textLower.includes('forma') || textLower.includes('diseña')) {
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'style_advisor',
          text: '✨ **Configurador de Estilo AI:**\nSelecciona tu forma favorita y efecto deseado para cotizar al instante:',
          suggestedReplies: [
            'Agendar este estilo',
            'Ver catálogo completo',
            'Cotizar foto de mi galería'
          ]
        }]);
      }, 800);
      return;
    }

    // 5. Aftercare & Durability request
    if (textLower.includes('cuidar') || textLower.includes('duración') || textLower.includes('durabilidad') || textLower.includes('cuidados') || textLower.includes('mantenimiento') || textLower.includes('retoque')) {
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'aftercare',
          text: '🧴 **Guía de Mantenimiento y Cuidados Post-Servicio:**',
          suggestedReplies: [
            'Agendar retoque para en 21 días',
            'Ver catálogo de servicios',
            'Consultar puntos acumulados'
          ]
        }]);
      }, 800);
      return;
    }

    // 6. Photo quoting widget request
    if (textLower.includes('cotizar') || textLower.includes('foto') || textLower.includes('galería') || textLower.includes('galeria') || textLower.includes('diseño') || textLower.includes('imagen')) {
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'photo_quote',
          text: '📷 **Cotizador por Visión AI:**\nPuedes subir una foto directamente de tu dispositivo o seleccionar una inspiración para cotizar:',
          suggestedReplies: [
            'Ver catálogo de servicios',
            'Elegir mi especialista',
            'Recomiéndame un estilo'
          ]
        }]);
      }, 800);
      return;
    }

    // 6b. Wizard App Flow inline widget request
    if (textLower.includes('wizard') || textLower.includes('wizard app flow') || textLower.includes('pasos') || textLower.includes('reserva guiada')) {
      setActiveWidget('wizard_flow');
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'wizard_flow',
          text: '🪄 **Wizard de Citas Interactivo en Chat (App Flow):**\nSigue los 5 pasos interactivos directamente en esta conversación para configurar tu cita ideal:',
          suggestedReplies: [
            'Pagar depósito seguro',
            'Ver mis Puntos Emme Club',
            'Ver catálogo de servicios'
          ]
        }]);
      }, 800);
      return;
    }

    // 7. Proposal Widget request
    if (textLower.includes('propuesta') || textLower.includes('propuesta de cita')) {
      const entityData = detectAndSyncReservationEntities();
      setActiveWidget('proposal_appointment');
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'proposal_appointment',
          text: `📋 **Propuesta Inteligente de Cita AI para ${entityData.service.name}:**\nAjusta la fecha, hora o especialista según tus preferencias antes de confirmar:`,
          suggestedReplies: [
            'Pagar depósito seguro',
            'Reserva guiada por pasos',
            'Ver catálogo de servicios'
          ]
        }]);
      }, 800);
      return;
    }

    // 8. Deposit / Checkout Widget request
    if (textLower.includes('depósito') || textLower.includes('deposito') || textLower.includes('pago') || textLower.includes('anticipo') || textLower.includes('checkout')) {
      const entityData = detectAndSyncReservationEntities();
      setActiveWidget('secure_deposit');
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'secure_deposit',
          text: '💳 **Checkout de Depósito Seguro Studio:**\nPara garantizar tu espacio en la agenda, puedes realizar el anticipo a continuación:',
          checkoutData: {
            serviceId: entityData.service.id,
            serviceName: entityData.service.name,
            staffName: entityData.staff.name,
            dateStr: entityData.date,
            timeStr: entityData.time,
            totalPrice: entityData.service.price,
            depositAmount: 150
          },
          suggestedReplies: [
            'Ver mis Puntos Emme Club',
            'Ver cuidados de uñas',
            'Consultar catálogo de servicios'
          ]
        }]);
      }, 800);
      return;
    }

    // 9. Standard Booking Proposal
    if (textLower.includes('agendar') || textLower.includes('cita') || textLower.includes('reservar') || textLower.includes('mañana') || textLower.includes('viernes')) {
      const entityData = detectAndSyncReservationEntities();
      
      setTimeout(() => {
        setIsThinking(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'widget',
          widgetType: 'proposal_appointment',
          text: `✨ **He generado esta propuesta personalizada para ti:**\nTratamiento: **${entityData.service.name}** con **${entityData.staff.name}** el **${entityData.date}** a las **${entityData.time} hrs**.`,
          suggestedReplies: [
            'Pagar depósito seguro',
            'Reserva guiada por pasos',
            'Ver catálogo de servicios'
          ]
        }]);
      }, 900);
      return;
    }

    // Fallback response with Gemini Live API Integration
    (async () => {
      try {
        const historyForGemini = messages.slice(-6).map((m) => ({
          sender: m.sender,
          text: m.text || '',
        }));

        const geminiRes = await sendGeminiChatMessage(userText, historyForGemini, {
          selectedService: reservation.serviceName || undefined,
        });

        setIsThinking(false);

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: 'assistant',
            timestamp: format(new Date(), 'HH:mm'),
            type: geminiRes.widgetType ? 'widget' : 'text',
            widgetType: geminiRes.widgetType as any,
            text: geminiRes.text,
            suggestedReplies: geminiRes.suggestedReplies || [
              'Ver catálogo de servicios',
              'Cotizar foto de mi galería',
              'Conocer a las especialistas',
              'Agendar cita express',
            ],
          },
        ]);
      } catch (err) {
        console.error('Error contacting Gemini API:', err);
        setIsThinking(false);
        let reply = `En ${(profile as any)?.salonName || 'EmmeStudio'} ofrecemos manicura rusa, soft gel, acrílicas y spa de pies con la mejor atención.`;
        if (textLower.includes('hola') || textLower.includes('buenas')) {
          reply = `¡Hola hermosa! ✨ ¿Cómo puedo ayudarte hoy? Puedes explorar nuestros servicios, subir una foto para cotizar o agendar tu cita.`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: 'assistant',
            timestamp: format(new Date(), 'HH:mm'),
            type: 'text',
            text: reply,
            suggestedReplies: [
              'Ver catálogo de servicios',
              'Cotizar foto de mi galería',
              'Conocer a las especialistas',
              'Agendar cita express',
            ],
          },
        ]);
      }
    })();
  };

  const handleConfirmProposal = (msgId: string) => {
    const targetMsg = messages.find(m => m.id === msgId);
    if (!targetMsg || !targetMsg.proposal || targetMsg.proposal.confirmed) return;

    const prop = targetMsg.proposal;
    const firstClient = clients[0] || { id: 'c1', name: 'Clienta de Chat' };

    addAppointment({
      clientId: firstClient.id,
      serviceId: prop.serviceId,
      date: prop.dateStr,
      startTime: prop.startTime,
      endTime: prop.endTime,
      status: 'confirmed',
      notes: `Reservado a través del Asistente EMME AI Chat con ${prop.staffName || 'Especialista Studio'}`
    });

    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.proposal) {
        return {
          ...m,
          proposal: {
            ...m.proposal,
            confirmed: true
          }
        };
      }
      return m;
    }));

    toast.success('¡Cita Agendada con Éxito! 🎉', {
      description: `${prop.serviceName} el ${format(new Date(prop.dateStr + 'T00:00:00'), "d 'de' MMMM", { locale: es })} a las ${prop.startTime} hrs`,
      icon: <CheckCircle2 className="size-5 text-emerald-500" />
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    triggerHaptic('selection');

    try {
      // 1. Instant client-side compression & dimension scaling (from 10MB to ~80KB)
      const optimized = await optimizeImageForAI(file, 1024, 0.82);
      const url = optimized.dataUrl;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'user',
        timestamp: format(new Date(), 'HH:mm'),
        type: 'image',
        imageUrl: url,
        text: 'He subido este diseño de uñas para análisis y cotización multimodal con Gemini.'
      };
      setMessages(prev => [...prev, userMsg]);

      // 2. High-speed Multimodal Gemini Analysis (<1.5s)
      const analysis = await analyzeNailReferenceWithGemini(
        optimized.base64,
        optimized.mimeType || 'image/jpeg',
        'Referencia de diseño de uñas subida por clienta'
      );

      setIsAnalyzingImage(false);
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'image',
          imageUrl: url,
          text: `✨ **Análisis Multimodal Gemini Completado:**\n\n📌 **Técnica Detectada:** ${analysis.technique} (${analysis.complexity})\n🎨 **Estilo:** ${analysis.detectedStyle}\n\nSelecciona a continuación tu **Silueta** y **Largo** deseados para calcular el presupuesto final exacto:`,
          geminiAnalysis: analysis,
          suggestedReplies: [
            'Confirmar este diseño y agendar',
            'Ver catálogo de servicios',
            'Elegir especialista'
          ]
        }
      ]);
    } catch (err) {
      console.error('Error analyzing image with Gemini:', err);
      setIsAnalyzingImage(false);

      const fallbackAnalysis: GeminiNailImageAnalysis = {
        technique: 'Soft Gel / Nivelación Rusa',
        detectedStyle: 'Efecto Glazed Nacarado & Nail Art Minimalista',
        complexity: 'Intermedio',
        detectedShape: 'Almendra',
        detectedLength: 'Medio (M)',
        detectedColors: ['Nude Rosé', 'Polvo Hailey Chrome'],
        detectedExtras: [{ name: 'Efecto Glazed Mirror', estimatedCost: 120 }],
        estimatedDurationMinutes: 75,
        basePrice: 550,
        artPrice: 120,
        totalEstimatedPrice: 670,
        recommendedService: 'Manicura Rusa + Soft Gel con Acabado Glazed',
        stylistTip: 'Excelente para eventos y uso diario. Alarga visualmente las manos.',
        description: 'Nivelación con rubber base de alta resistencia y acabado perlado reflectivo.'
      };

      const fallbackUrl = URL.createObjectURL(file);
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'assistant',
          timestamp: format(new Date(), 'HH:mm'),
          type: 'image',
          imageUrl: fallbackUrl,
          text: '✨ **Análisis de Visión AI completado:** Selecciona tu silueta y tamaño para cotizar:',
          geminiAnalysis: fallbackAnalysis,
          suggestedReplies: [
            'Confirmar este diseño y agendar',
            'Ver catálogo de servicios',
            'Elegir especialista'
          ]
        }
      ]);
    }
  };

  const handleSelectSampleInspo = (sample: {
    title: string;
    url: string;
    style: string;
    complexity: string;
    durationMinutes: number;
    estimatedPrice: number;
    recommendedService: string;
  }) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      timestamp: format(new Date(), 'HH:mm'),
      type: 'text',
      text: `Quiero cotizar la inspiración "${sample.title}"`
    };
    setMessages(prev => [...prev, userMsg]);

    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      const sampleAnalysis: GeminiNailImageAnalysis = {
        technique: sample.recommendedService.includes('Soft') ? 'Soft Gel' : 'Manicura Rusa',
        detectedStyle: sample.style,
        complexity: (sample.complexity as any) || 'Intermedio',
        detectedShape: 'Almendra',
        detectedLength: 'Medio (M)',
        detectedColors: ['Tono Diseñado', 'Acabado Pro'],
        detectedExtras: [{ name: 'Efecto & Nail Art', estimatedCost: sample.estimatedPrice * 2 }],
        estimatedDurationMinutes: sample.durationMinutes,
        basePrice: sample.estimatedPrice * 8,
        artPrice: sample.estimatedPrice * 2,
        totalEstimatedPrice: sample.estimatedPrice * 10,
        recommendedService: sample.recommendedService,
        stylistTip: 'Diseño en tendencia de alta durabilidad en cabina.',
        description: sample.style
      };

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender: 'assistant',
        timestamp: format(new Date(), 'HH:mm'),
        type: 'image',
        imageUrl: sample.url,
        text: `✨ **Cotización Inteligente para "${sample.title}":**\nConfigura la forma y el largo deseados para tu cita:`,
        geminiAnalysis: sampleAnalysis,
        suggestedReplies: [
          `Agendar ${sample.recommendedService}`,
          'Elegir mi especialista',
          'Ver catálogo de servicios'
        ]
      }]);
    }, 800);
  };

  const getWidgetMetadata = (widgetType?: string) => {
    switch (widgetType) {
      case 'booking_flow':
        return { title: 'Reserva Guiada de Cita', subtitle: 'Configuración de cita por pasos', icon: Calendar };
      case 'catalog':
        return { title: 'Catálogo de Tratamientos', subtitle: 'Menú de servicios del salón', icon: Layers };
      case 'staff':
        return { title: 'Selección de Especialista', subtitle: 'Staff profesional seleccionado', icon: User };
      case 'loyalty':
        return { title: 'Beneficios Club VIP', subtitle: 'Puntos y recompensas', icon: Award };
      case 'style_advisor':
        return { title: 'Asesoría de Estilo & Forma', subtitle: 'Recomendaciones de diseño', icon: Sparkles };
      case 'wizard_flow':
        return { title: 'Wizard Integral de Citas', subtitle: 'Paso a paso personalizado', icon: Calendar };
      case 'proposal_appointment':
        return { title: 'Propuesta de Cita AI', subtitle: 'Disponibilidad y cotización', icon: CheckCircle2 };
      case 'secure_deposit':
        return { title: 'Depósito Seguro & Checkout', subtitle: 'Apartado de turno', icon: ShieldCheck };
      case 'confirmed_pass':
        return { title: 'Pase Digital de Cita Confirmada', subtitle: 'Ticket con Google Calendar', icon: CheckSquare };
      case 'aftercare':
        return { title: 'Guía de Cuidados de Uñas', subtitle: 'Recomendaciones post-servicio', icon: Heart };
      case 'photo_quote':
        return { title: 'Cotizador con Foto', subtitle: 'Análisis de visión AI y cotización', icon: Camera };
      case 'nail_quote_customizer':
        return { title: 'Personalizador de Nail Art', subtitle: 'Largo, diseño y adicionales', icon: Wand2 };
      default:
        return { title: 'Widget Interactivo', subtitle: 'Acción completada', icon: Sparkles };
    }
  };

  const latestWidgetIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].widgetType) {
        return i;
      }
    }
    return -1;
  })();

  return (
    <div className={cn(
      "flex flex-col bg-white/80 dark:bg-[#18181B]/80 backdrop-blur-[24px] overflow-hidden transition-all duration-300",
      isFloating 
        ? "w-[calc(100vw-1.5rem)] max-w-[440px] h-[580px] sm:h-[640px] fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] right-3 sm:right-6 lg:bottom-6 z-[120] rounded-[32px] border border-white/40 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)]" 
        : "w-full h-full min-h-0 flex-1 max-w-none rounded-none lg:rounded-[32px] border-0 lg:border lg:border-white/40 dark:lg:border-white/10 shadow-none lg:shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
    )}>
      {/* Header (Only shown when floating popover mode is active) */}
      {isFloating && (
        <div className="px-5 sm:px-6 py-3.5 bg-white/70 dark:bg-white/[0.04] backdrop-blur-[20px] border-b border-black/[0.06] dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0 relative shadow-2xs">
              <Sparkles className="size-5 stroke-[2] text-primary" />
              <div className="size-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-white dark:ring-[#18181B]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-sm sm:text-base text-[#1D1D1F] dark:text-white truncate leading-tight">
                Asistente Emme AI
              </h3>
              <p className="text-xs text-[#86868B] dark:text-[#A1A1A6] truncate flex items-center gap-1.5 mt-0.5 font-medium">
                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                <span>En línea</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                startWelcomeSequence();
                toast.success('Conversación reiniciada');
              }}
              title="Reiniciar conversación"
              className="size-8 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className="size-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                if (onClose) onClose();
                navigate('/chat');
              }}
              title="Abrir en pantalla completa"
              className="size-8 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-[#86868B] hover:text-primary transition-all cursor-pointer"
            >
              <Maximize2 className="size-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} title="Cerrar chat" className="size-8 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer text-[#86868B]">
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <div ref={messagesContainerRef} className="flex-1 p-3.5 sm:p-5 lg:p-6 pb-24 lg:pb-6 overflow-y-auto space-y-4 sm:space-y-5 bg-[#FBFBFD] dark:bg-[#141416] custom-scrollbar">
        {messages.map((msg, msgIndex) => {
          const isUser = msg.sender === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className={cn("flex items-start gap-2.5 sm:gap-3", isUser ? "flex-row-reverse" : "flex-row")}
            >
              <div className={cn(
                "size-8 sm:size-9 rounded-xl sm:rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs border",
                isUser 
                  ? "bg-primary text-white border-transparent" 
                  : "bg-primary text-white border-primary/20"
              )}>
                {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
              </div>

              <div className={cn("max-w-[88%] sm:max-w-[82%] space-y-2", isUser ? "items-end text-right" : "items-start text-left")}>
                {msg.type === 'voice' && (
                  <div className="p-3.5 rounded-2xl bg-primary text-white space-y-2 shadow-md max-w-sm">
                    <div className="flex items-center gap-2">
                      <Mic className="size-4 text-primary animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">Nota de Voz ({msg.duration}s)</span>
                    </div>
                    <div className="flex items-center gap-1.5 h-4">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{ height: `${Math.max(4, (i % 5) * 4 + 4)}px` }} />
                      ))}
                    </div>
                    {msg.text && (
                      <p className="text-xs text-white/90 italic pt-1.5 border-t border-white/10">"{msg.text}"</p>
                    )}
                  </div>
                )}

                {msg.text && msg.type !== 'voice' && (
                  <div className={cn(
                    "p-3.5 sm:p-4 rounded-2xl text-[13px] sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs font-sans antialiased tracking-normal",
                    isUser 
                      ? "bg-gradient-to-br from-[#1D1D1F] to-[#2C2C2E] text-white rounded-tr-xs font-medium" 
                      : "bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 text-[#1D1D1F] dark:text-[#F5F5F7] rounded-tl-xs font-normal"
                  )}>
                    <p className="m-0 p-0 text-[13px] sm:text-sm leading-relaxed font-normal text-inherit">{msg.text}</p>
                  </div>
                )}

                {/* Interactive Widgets rendering with Single Active Widget Enforcement */}
                {msg.widgetType && (() => {
                  const isLatest = msgIndex === latestWidgetIndex;
                  const isExpanded = isLatest || !!expandedWidgetIds[msg.id];
                  const meta = getWidgetMetadata(msg.widgetType);
                  const MetaIcon = meta.icon;

                  if (!isExpanded) {
                    return (
                      <div className="w-full max-w-md my-1.5 p-3 rounded-2xl bg-white border border-black/[0.06] text-xs flex items-center justify-between shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="size-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                            <MetaIcon className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-[#1D1D1F] truncate block">{meta.title}</span>
                            <span className="text-[10px] text-[#86868B] font-medium truncate block">{meta.subtitle}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedWidgetIds(prev => ({ ...prev, [msg.id]: true }))}
                          className="text-[11px] font-bold text-primary hover:underline px-2.5 py-1 rounded-lg hover:bg-primary/5 cursor-pointer whitespace-nowrap shrink-0 ml-2"
                        >
                          Ver opción
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="w-full space-y-2">
                      {!isLatest && (
                        <div className="flex items-center justify-between px-1 text-[11px] text-[#86868B]">
                          <span className="font-medium">Widget de paso previo</span>
                          <button
                            type="button"
                            onClick={() => setExpandedWidgetIds(prev => ({ ...prev, [msg.id]: false }))}
                            className="font-bold text-primary hover:underline cursor-pointer"
                          >
                            Minimizar
                          </button>
                        </div>
                      )}

                      {msg.widgetType === 'booking_flow' && (
                        <AppointmentBookingFlowChatWidget 
                          onCompleteBooking={(summary) => {
                            setIsThinking(true);
                            setTimeout(() => {
                              setIsThinking(false);
                              setMessages(prev => [...prev, {
                                id: crypto.randomUUID(),
                                sender: 'assistant',
                                timestamp: format(new Date(), 'HH:mm'),
                                type: 'text',
                                text: `🎉 **¡Cita Confirmada con Éxito desde el Widget Guiado!**\n\n📌 **Tratamiento:** ${summary.serviceName}\n👤 **Especialista:** ${summary.staffName}\n📅 **Fecha & Hora:** ${summary.dateStr} a las ${summary.timeStr} hrs\n💳 **Total Estimado:** $${summary.price} MXN\n\nTu cita ya fue registrada en tu portal. ¡Te esperamos en Emme Studio! ✨`,
                                suggestedReplies: [
                                  'Ver mis Puntos Emme Club',
                                  'Ver cuidados de uñas',
                                  'Consultar catálogo de servicios'
                                ]
                              }]);
                            }, 600);
                          }}
                        />
                      )}

                      {msg.widgetType === 'catalog' && (
                        <ServiceCatalogChatWidget 
                          services={services}
                          onSelectService={(service) => {
                            handleSendMessage(`Quiero agendar ${service.name}`);
                          }}
                        />
                      )}

                      {msg.widgetType === 'staff' && (
                        <StaffSelectorChatWidget 
                          onSelectStaff={(staff) => {
                            handleSendMessage(`Quiero agendar mi cita con ${staff.name}`);
                          }}
                        />
                      )}

                      {msg.widgetType === 'loyalty' && (
                        <LoyaltyPerksChatWidget 
                          userPoints={250}
                          onApplyPerk={(perkTitle, discount) => {
                            handleSendMessage(`Quiero aplicar mi beneficio de "${perkTitle}" en mi cita`);
                          }}
                        />
                      )}

                      {msg.widgetType === 'style_advisor' && (
                        <StyleAdvisorChatWidget 
                          onSelectDesign={(design) => {
                            handleSendMessage(`Quiero agendar estilo forma ${design.shape} con ${design.finish}`);
                          }}
                        />
                      )}

                      {msg.widgetType === 'wizard_flow' && (
                        <AppointmentWizardChatWidget 
                          onCompleteBooking={(summary) => {
                            setIsThinking(true);
                            setTimeout(() => {
                              setIsThinking(false);
                              setMessages(prev => [
                                ...prev, 
                                {
                                  id: crypto.randomUUID(),
                                  sender: 'assistant',
                                  timestamp: format(new Date(), 'HH:mm'),
                                  type: 'text',
                                  text: `📋 **Información del Wizard recibida con éxito.** He generado tu **Propuesta Conversacional de Cita** a continuación:`,
                                },
                                {
                                  id: crypto.randomUUID(),
                                  sender: 'assistant',
                                  timestamp: format(new Date(), 'HH:mm'),
                                  type: 'widget',
                                  widgetType: 'proposal_appointment',
                                  text: '📋 **Propuesta Conversacional de Cita:**',
                                  suggestedReplies: [
                                    'Pagar depósito seguro',
                                    'Reserva guiada por pasos',
                                    'Ver catálogo de servicios'
                                  ]
                                }
                              ]);
                            }, 600);
                          }}
                          onProceedToDeposit={(summary) => {
                            setIsThinking(true);
                            setTimeout(() => {
                              setIsThinking(false);
                              setMessages(prev => [...prev, {
                                id: crypto.randomUUID(),
                                sender: 'assistant',
                                timestamp: format(new Date(), 'HH:mm'),
                                type: 'widget',
                                widgetType: 'secure_deposit',
                                text: '💳 **Checkout de Depósito Seguro:**\nLiquida tu anticipo de $150 MXN a continuación para apartado inmediato:',
                                checkoutData: {
                                  serviceId: 's1',
                                  serviceName: summary.serviceName,
                                  staffName: summary.staffName,
                                  dateStr: summary.dateStr,
                                  timeStr: summary.timeStr,
                                  totalPrice: summary.totalPrice,
                                  depositAmount: summary.depositAmount || 150
                                }
                              }]);
                            }, 600);
                          }}
                        />
                      )}

                      {msg.widgetType === 'proposal_appointment' && (
                        <ProposalAppointmentChatWidget
                          onAcceptProposal={(proposal) => {
                            addAppointment({
                              clientId: clients[0]?.id || 'c1',
                              serviceId: proposal.serviceId,
                              date: proposal.dateStr,
                              startTime: proposal.timeStr,
                              endTime: '12:30',
                              status: 'confirmed',
                              notes: `Cita confirmada desde Propuesta AI con ${proposal.staff.name}`
                            });

                            setIsThinking(true);
                            setTimeout(() => {
                              setIsThinking(false);
                              setMessages(prev => [...prev, {
                                id: crypto.randomUUID(),
                                sender: 'assistant',
                                timestamp: format(new Date(), 'HH:mm'),
                                type: 'text',
                                text: `🎉 **¡Cita Agendada y Registrada!**\n\n📌 **Tratamiento:** ${proposal.serviceName}\n👤 **Atendida por:** ${proposal.staff.name}\n📅 **Fecha & Hora:** ${proposal.dateStr} a las ${proposal.timeStr} hrs\n💳 **Total Est.:** $${proposal.servicePrice} MXN\n\n¡Tu espacio en Emme Studio está asegurado! ✨`,
                                suggestedReplies: [
                                  'Pagar depósito de anticipo seguro',
                                  'Ver mis Puntos Emme Club',
                                  'Ver cuidados de uñas'
                                ]
                              }]);
                            }, 600);
                          }}
                          onProceedToDeposit={(proposal) => {
                            setIsThinking(true);
                            setTimeout(() => {
                              setIsThinking(false);
                              setMessages(prev => [...prev, {
                                id: crypto.randomUUID(),
                                sender: 'assistant',
                                timestamp: format(new Date(), 'HH:mm'),
                                type: 'widget',
                                widgetType: 'secure_deposit',
                                text: '💳 **Checkout de Depósito Seguro:**\nLiquida tu anticipo de $150 MXN a continuación para apartar este slot:',
                                checkoutData: {
                                  serviceId: proposal.serviceId,
                                  serviceName: proposal.serviceName,
                                  staffName: proposal.staff.name,
                                  dateStr: proposal.dateStr,
                                  timeStr: proposal.timeStr,
                                  totalPrice: proposal.servicePrice,
                                  depositAmount: proposal.depositRequired || 150
                                }
                              }]);
                            }, 600);
                          }}
                          onRequestAlternative={() => {
                            handleSendMessage('Sugerir otro horario disponible');
                          }}
                        />
                      )}

                      {msg.widgetType === 'secure_deposit' && (
                        <SecureDepositCheckoutChatWidget
                          checkoutData={msg.checkoutData}
                          onPaymentSuccess={(receipt) => {
                            setIsThinking(true);
                            setTimeout(() => {
                              setIsThinking(false);
                              setMessages(prev => [
                                ...prev, 
                                {
                                  id: crypto.randomUUID(),
                                  sender: 'assistant',
                                  timestamp: format(new Date(), 'HH:mm'),
                                  type: 'text',
                                  text: `🎉 **¡Pago Verificado & Depósito Autorizado!**\n\nAquí tienes tu pase oficial **Confirmed Salon Booking Pass**. Toca en el botón verde a continuación para **sincronizar tu cita directamente a tu Google Calendar o Apple Calendar**:`,
                                  suggestedReplies: [
                                    'Ver mis Puntos Emme Club',
                                    'Ver cuidados de uñas',
                                    'Consultar catálogo de servicios'
                                  ]
                                },
                                {
                                  id: crypto.randomUUID(),
                                  sender: 'assistant',
                                  timestamp: format(new Date(), 'HH:mm'),
                                  type: 'widget',
                                  widgetType: 'confirmed_pass',
                                  passData: {
                                    bookingRef: receipt.bookingRef,
                                    serviceName: receipt.serviceName,
                                    staffName: receipt.staffName,
                                    dateStr: receipt.dateStr,
                                    timeStr: receipt.timeStr,
                                    depositPaid: receipt.depositPaid,
                                    remainingBalance: receipt.remainingBalance
                                  }
                                }
                              ]);
                            }, 600);
                          }}
                        />
                      )}

                      {msg.widgetType === 'confirmed_pass' && (
                        <ConfirmedBookingPassChatWidget
                          passData={msg.passData}
                          onReschedule={() => {
                            handleSendMessage('Wizard App Flow');
                          }}
                        />
                      )}

                      {msg.widgetType === 'aftercare' && (
                        <AftercareGuideChatWidget 
                          onScheduleRetouch={() => {
                            handleSendMessage('Quiero agendar mi retoque para dentro de 21 días');
                          }}
                        />
                      )}

                      {msg.widgetType === 'photo_quote' && (
                        <div className="space-y-3">
                          <PhotoQuoteChatWidget 
                            onOpenGallery={() => fileInputRef.current?.click()}
                            onSelectSample={handleSelectSampleInspo}
                          />
                          <NailQuoteCustomizerWidget
                            onQuoteApplied={() => {
                              handleSendMessage('Continuar con especialista en Wizard App Flow');
                            }}
                          />
                        </div>
                      )}

                      {msg.widgetType === 'nail_quote_customizer' && (
                        <NailQuoteCustomizerWidget
                          onQuoteApplied={() => {
                            handleSendMessage('Continuar con especialista en Wizard App Flow');
                          }}
                        />
                      )}

                      {msg.widgetType === 'lash_selector' && (
                        <LashSelectorChatWidget />
                      )}
                    </div>
                  );
                })()}

                {msg.imageUrl && msg.geminiAnalysis && (
                  <div className="w-full max-w-md my-1.5 animate-in fade-in duration-200">
                    <GeminiMultimodalNailQuoteWidget
                      imageUrl={msg.imageUrl}
                      analysis={msg.geminiAnalysis}
                      onProceedToBooking={(summary) => {
                        handleSendMessage(`Quiero agendar ${summary.serviceName} por $${summary.totalPrice} MXN`);
                      }}
                    />
                  </div>
                )}

                {msg.imageUrl && msg.imageAnalysis && !msg.geminiAnalysis && (
                  <div className="w-full max-w-md my-1.5 animate-in fade-in duration-200">
                    <NailCategoryExtractionCard
                      imageUrl={msg.imageUrl}
                      imageDescription={msg.imageAnalysis.style}
                      variant="chat"
                      onApplyToQuote={(analysis) => {
                        handleSendMessage(`Aplicar cotización estimada de $${analysis.estimateRange.likelyPrice} MXN para ${analysis.layers.structure.label}`);
                      }}
                      onBookAppointment={(analysis) => {
                        handleSendMessage(`Quiero agendar ${analysis.layers.structure.label} con diseño ${analysis.layers.nailArt.complexity}`);
                      }}
                    />
                  </div>
                )}

                {msg.proposal && (
                  <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm text-left max-w-md my-1.5 animate-in fade-in duration-200 divide-y divide-black/[0.05]">
                    <div className="px-4 py-2.5 flex items-center justify-between bg-white">
                      <span className="text-[10.5px] font-bold text-emerald-700 flex items-center gap-1">
                        <Sparkles className="size-3.5" /> Propuesta de Cita Express
                      </span>
                      <span className="text-xs font-bold text-[#1D1D1F]">${msg.proposal.price} MXN</span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <p className="font-bold text-xs sm:text-sm text-[#1D1D1F]">{msg.proposal.serviceName}</p>
                      <div className="flex items-center gap-3 text-[11px] text-[#86868B]">
                        <span className="flex items-center gap-1"><Calendar className="size-3 text-primary" /> {msg.proposal.dateStr}</span>
                        <span className="flex items-center gap-1"><Clock className="size-3 text-primary" /> {msg.proposal.startTime} - {msg.proposal.endTime}</span>
                      </div>
                      {msg.proposal.staffName && (
                        <p className="text-[11px] font-medium text-primary pt-0.5">Atendida por: {msg.proposal.staffName}</p>
                      )}
                    </div>

                    {msg.proposal.confirmed ? (
                      <div className="p-3 bg-emerald-50 text-emerald-700 flex items-center gap-2 text-xs font-bold">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        <span>¡Cita Agendada y Confirmada en tu Portal!</span>
                      </div>
                    ) : (
                      <div className="p-3 flex items-center gap-2 bg-[#FBFBFD]">
                        <Button 
                          onClick={() => handleConfirmProposal(msg.id)}
                          className="flex-1 h-9.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                        >
                          Confirmar Cita Ahora
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleSendMessage('Cambiar hora de la propuesta')}
                          className="h-9.5 rounded-xl text-xs font-semibold border-black/10 hover:bg-white cursor-pointer"
                        >
                          Cambiar
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested Reply Chips below Assistant Messages */}
                {!isUser && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {msg.suggestedReplies.map((replyText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(replyText)}
                        className="group px-3 py-1 rounded-full bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 text-[11.5px] font-medium transition-all duration-150 active:scale-95 active:bg-pink-500 active:text-white active:border-pink-500 text-left flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Lightbulb className="size-3 text-pink-500 dark:text-pink-400 group-active:text-white shrink-0 transition-colors" />
                        <span className="group-active:text-white">{replyText}</span>
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-[#86868B] block px-1">{msg.timestamp}</span>
              </div>
            </motion.div>
          );
        })}

        {isThinking && (
          <motion.div
            key="typing-indicator"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="flex items-start gap-2.5 sm:gap-3"
          >
            <div className="size-8 sm:size-9 rounded-xl sm:rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs border bg-primary text-white border-primary/20">
              <Bot className="size-4" />
            </div>
            <div className="max-w-[88%] sm:max-w-[82%] space-y-2">
              <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-2xs flex items-center gap-1.5 h-10 w-fit">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-2 rounded-full bg-primary"
                    animate={{
                      y: [0, -3.5, 0],
                      opacity: [0.35, 1, 0.35],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9,
                      ease: "easeInOut",
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {isAnalyzingImage && (
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
            <RefreshCw className="size-4 animate-spin text-rose-600" />
            <span>Analizando diseño con Inteligencia Artificial Visión...</span>
          </div>
        )}
      </div>

      {/* Quick Action Chips Bar */}
      <div className="px-3.5 py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth shrink-0 bg-white/50 dark:bg-black/20 backdrop-blur-xs border-t border-black/[0.04] dark:border-white/[0.04]">
        {/* Primary Action Chip */}
        <button 
          type="button" 
          onClick={() => handleSendMessage('Reserva guiada por pasos')}
          className="group h-8 px-3.5 rounded-full bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100/80 dark:hover:bg-pink-900/50 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800/60 text-[12px] font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 active:bg-pink-500 active:text-white active:border-pink-500 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
        >
          <Sparkles className="size-3.5 text-pink-600 dark:text-pink-400 group-active:text-white transition-colors" />
          <span className="group-active:text-white">Agendar Cita</span>
        </button>

        {/* Secondary Action Chips */}
        <button 
          type="button"
          onClick={() => {
            fileInputRef.current?.click();
            handleSendMessage('Cotizar foto de mi galería');
          }}
          className="group h-8 px-3.5 rounded-full bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 text-[12px] font-medium whitespace-nowrap transition-all duration-150 active:scale-95 active:bg-pink-500 active:text-white active:border-pink-500 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
        >
          <Camera className="size-3.5 text-neutral-600 dark:text-neutral-300 group-active:text-white transition-colors" />
          <span className="group-active:text-white">Cotizar Foto</span>
        </button>

        <button 
          type="button" 
          onClick={() => handleSendMessage('Ver catálogo de servicios')}
          className="group h-8 px-3.5 rounded-full bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 text-[12px] font-medium whitespace-nowrap transition-all duration-150 active:scale-95 active:bg-pink-500 active:text-white active:border-pink-500 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
        >
          <Layers className="size-3.5 text-neutral-600 dark:text-neutral-300 group-active:text-white transition-colors" />
          <span className="group-active:text-white">Servicios</span>
        </button>

        <button 
          type="button" 
          onClick={() => handleSendMessage('Ver especialistas de studio')}
          className="group h-8 px-3.5 rounded-full bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 text-[12px] font-medium whitespace-nowrap transition-all duration-150 active:scale-95 active:bg-pink-500 active:text-white active:border-pink-500 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
        >
          <User className="size-3.5 text-neutral-600 dark:text-neutral-300 group-active:text-white transition-colors" />
          <span className="group-active:text-white">Especialistas</span>
        </button>

        <button 
          type="button" 
          onClick={() => handleSendMessage('Recomiéndame un estilo de uñas')}
          className="group h-8 px-3.5 rounded-full bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 text-[12px] font-medium whitespace-nowrap transition-all duration-150 active:scale-95 active:bg-pink-500 active:text-white active:border-pink-500 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
        >
          <Wand2 className="size-3.5 text-neutral-600 dark:text-neutral-300 group-active:text-white transition-colors" />
          <span className="group-active:text-white">Estilos AI</span>
        </button>

        <button 
          type="button" 
          onClick={() => handleSendMessage('Mis Puntos Emme Club')}
          className="group h-8 px-3.5 rounded-full bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 text-[12px] font-medium whitespace-nowrap transition-all duration-150 active:scale-95 active:bg-pink-500 active:text-white active:border-pink-500 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
        >
          <Award className="size-3.5 text-neutral-600 dark:text-neutral-300 group-active:text-white transition-colors" />
          <span className="group-active:text-white">Puntos Club</span>
        </button>

        <button 
          type="button" 
          onClick={() => handleSendMessage('¿Cómo puedo cuidar mis uñas de Soft Gel?')}
          className="group h-8 px-3.5 rounded-full bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 border border-neutral-200/80 dark:border-white/10 text-[12px] font-medium whitespace-nowrap transition-all duration-150 active:scale-95 active:bg-pink-500 active:text-white active:border-pink-500 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
        >
          <ShieldCheck className="size-3.5 text-neutral-600 dark:text-neutral-300 group-active:text-white transition-colors" />
          <span className="group-active:text-white">Cuidados</span>
        </button>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Input Form Footer (Always docked safely above bottom nav on mobile) */}
      <div className={cn(
        "bg-white/60 dark:bg-white/[0.03] backdrop-blur-[20px] border-t border-white/40 dark:border-white/10 shrink-0",
        !isFloating ? "pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] lg:pb-0" : ""
      )}>
        <form 
          onSubmit={(e) => handleSendMessage(undefined, e)} 
          className="p-3 sm:p-4 flex items-center gap-2.5"
        >
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={() => fileInputRef.current?.click()}
            title="Subir foto de diseño para cotizar"
            className="size-11 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-[#86868B] shrink-0 cursor-pointer active:scale-95"
          >
            <Camera className="size-5" />
          </Button>

          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isRecording ? `Grabando voz... (${recordingTimer}s)` : "Escribe tu consulta o pide agendar..."}
            disabled={isRecording}
            className="flex-1 min-h-[44px] rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-white/40 dark:border-white/10 text-xs sm:text-sm px-4 focus-visible:ring-2 focus-visible:ring-primary/20 text-foreground"
          />

          {isRecording ? (
            <Button 
              type="button"
              onClick={stopRecording}
              className="size-11 rounded-full bg-rose-500 hover:bg-rose-600 text-white animate-pulse shrink-0 cursor-pointer active:scale-95"
            >
              <MicOff className="size-5" />
            </Button>
          ) : (
            <Button 
              type="button"
              onClick={startRecording}
              variant="ghost"
              size="icon"
              title="Grabar nota de voz"
              className="size-11 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-[#86868B] shrink-0 cursor-pointer active:scale-95"
            >
              <Mic className="size-5" />
            </Button>
          )}

          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isRecording}
            className="size-11 rounded-full bg-primary text-white hover:brightness-105 shadow-[0_4px_14px_rgba(224,82,134,0.3)] shrink-0 cursor-pointer active:scale-95 transition-all disabled:opacity-40"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>

      <AppointmentWizardModal
        isOpen={isWizardModalOpen}
        onOpenChange={setIsWizardModalOpen}
      />
    </div>
  );
}
