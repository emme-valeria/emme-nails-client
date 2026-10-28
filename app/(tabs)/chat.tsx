import { router } from 'expo-router';
import { ArrowUp, ArrowUpRight, Camera, ChevronDown, Menu, Plus, Sparkles } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions, type ColorValue, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { GlassContainer, GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { cancelAnimation, FadeInDown, FadeInUp, LinearTransition, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { BottomSheet } from '../../src/expo/components/BottomSheet';
import { ChatAmbientOrb } from '../../src/expo/components/ChatAmbientOrb';
import type { OrbState } from '../../src/expo/components/Orb.types';
import { sendExpoChatMessage } from '../../src/expo/api';
import { useExpoAuth } from '../../src/expo/AuthContext';
import { emmeTokens } from '../../src/expo/theme';

type Message = { id: string; sender: 'assistant' | 'user'; text: string; actionLabel?: string; actionRoute?: string; isError?: boolean };
const starterReplies = ['Ver diseños de uñas', 'Cotizar una foto', 'Agendar una cita'];

function welcomeMessages(firstName?: string): Message[] {
  return [{
    id: 'welcome',
    sender: 'assistant',
    text: `Hola${firstName ? `, ${firstName}` : ''}. ¿Qué te gustaría hacer con tus uñas hoy?`,
  }];
}

function actionForWidget(widgetType?: string) {
  if (widgetType === 'catalog') return { actionLabel: 'Explorar diseños', actionRoute: '/designs' };
  if (widgetType === 'photo_quote' || widgetType === 'nail_quote_customizer') return { actionLabel: 'Cotizar mi diseño', actionRoute: '/quotes' };
  if (widgetType === 'booking_flow' || widgetType === 'wizard_flow') return { actionLabel: 'Elegir un horario', actionRoute: '/booking' };
  return {};
}

function TypingDot({ delay }: { delay: number }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(withSequence(withDelay(delay, withTiming(1, { duration: 280 })), withTiming(0, { duration: 360 })), -1, false);
    return () => cancelAnimation(progress);
  }, [delay, progress]);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: 0.35 + progress.value * 0.65, transform: [{ translateY: -progress.value * 3 }] }));
  return <Animated.View style={[styles.typingDot, animatedStyle]} />;
}

function GlassBackdrop({ style, tintColor = 'rgba(255,255,255,0.18)', intensity = 84, interactive = false, large = false }: { style: StyleProp<ViewStyle>; tintColor?: ColorValue; intensity?: number; interactive?: boolean; large?: boolean }) {
  if (Platform.OS === 'ios' && isLiquidGlassAvailable()) {
    return <GlassView glassEffectStyle="regular" tintColor={tintColor} isInteractive={interactive} style={style} pointerEvents="none" />;
  }
  if (Platform.OS === 'web') return <View pointerEvents="none" style={[style, large ? webLiquidGlassLarge : webLiquidGlass]} />;
  return <View pointerEvents="none" style={style}>
    <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
    <LinearGradient colors={['rgba(255,255,255,0.58)', 'rgba(255,238,244,0.26)']} style={StyleSheet.absoluteFill} />
  </View>;
}

const webLiquidGlass = {
  backgroundColor: 'rgba(255,255,255,0.14)',
  backdropFilter: 'blur(14px) saturate(220%)',
  WebkitBackdropFilter: 'blur(14px) saturate(220%)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.5)',
  boxShadow: [
    'inset 0 1.5px 0 rgba(255,255,255,0.9)',
    'inset 0 -1px 0 rgba(255,255,255,0.25)',
    'inset 0 0 18px rgba(255,255,255,0.18)',
    '0 10px 30px rgba(170,50,110,0.14)',
  ].join(', '),
} as unknown as ViewStyle;

const webLiquidGlassLarge = {
  ...webLiquidGlass,
  backgroundColor: 'rgba(255,255,255,0.30)',
  backdropFilter: 'blur(28px) saturate(190%) brightness(1.05)',
  WebkitBackdropFilter: 'blur(28px) saturate(190%) brightness(1.05)',
} as unknown as ViewStyle;

function SuggestionPill({ text, nativeGlass, onPress }: { text: string; nativeGlass: boolean; onPress: () => void }) {
  return <Animated.View style={styles.suggestionShadow}>
    <Pressable onPress={onPress} style={({ pressed }) => [styles.suggestionTap, !nativeGlass && pressed && styles.suggestionPressed]} accessibilityRole="button">
      {nativeGlass ? <GlassView glassEffectStyle="regular" tintColor="rgba(166,62,104,0.16)" isInteractive style={[styles.suggestionGlass, styles.nativeSuggestionRim]}>
        <Text style={styles.suggestionText}>{text}</Text>
      </GlassView> : <View style={styles.suggestionGlass}>
        <GlassBackdrop style={StyleSheet.absoluteFill} tintColor="rgba(255,255,255,0.24)" intensity={64} />
        <Text style={styles.suggestionText}>{text}</Text>
      </View>}
    </Pressable>
  </Animated.View>;
}

export default function ChatScreen() {
  const { client } = useExpoAuth();
  const firstName = client?.name?.trim().split(' ')[0];
  const [messages, setMessages] = useState<Message[]>(() => welcomeMessages(firstName));
  const [suggestions, setSuggestions] = useState(starterReplies);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<'idle' | 'waiting' | 'streaming' | 'error'>('idle');
  const [pulse, setPulse] = useState(0);
  const lastInputPulse = useRef(-Infinity);
  const requestRef = useRef<AbortController | null>(null);
  const isSending = status === 'waiting' || status === 'streaming';
  const [showMenu, setShowMenu] = useState(false);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const nativeGlassAvailable = Platform.OS === 'ios' && isLiquidGlassAvailable();
  const composerScale = useSharedValue(1);
  const composerAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: composerScale.value }] }));
  const orbState: OrbState = status === 'error' ? 'error' : status === 'streaming' ? 'responding' : status === 'waiting' ? 'thinking' : draft.length > 0 ? 'typing' : 'idle';
  const compactOrb = messages.length > 1;

  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => {
    if (status !== 'error') return;
    const timer = setTimeout(() => setStatus('idle'), 2500);
    return () => clearTimeout(timer);
  }, [status]);

  const changeDraft = (text: string) => {
    setDraft(text);
    const now = Date.now();
    if (now - lastInputPulse.current >= 100) {
      lastInputPulse.current = now;
      setPulse((value) => value + 1);
    }
  };

  const resetConversation = () => {
    requestRef.current?.abort();
    requestRef.current = null;
    setStatus('idle');
    setPulse(0);
    lastInputPulse.current = -Infinity;
    setMessages(welcomeMessages(firstName));
    setSuggestions(starterReplies);
    setDraft('');
    setSuggestionsExpanded(true);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const send = async (text = draft) => {
    const message = text.trim();
    if (!message || requestRef.current) return;
    const request = new AbortController();
    requestRef.current = request;
    const assistantId = `${Date.now()}-assistant`;
    let streamedText = '';
    const userMessage: Message = { id: `${Date.now()}-user`, sender: 'user', text: message };
    const history = [...messages, userMessage].map(({ sender, text: value }) => ({ sender, text: value }));
    setMessages((previous) => [...previous, userMessage]);
    setDraft('');
    setSuggestions([]);
    setSuggestionsExpanded(false);
    setStatus('waiting');
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

    try {
      const response = await sendExpoChatMessage(message, history, undefined, {
        signal: request.signal,
        onChunk: (chunk) => {
          if (request.signal.aborted || !chunk) return;
          streamedText += chunk;
          const text = streamedText;
          setStatus('streaming');
          setPulse((value) => value + 1);
          setMessages((previous) => previous.some((item) => item.id === assistantId)
            ? previous.map((item) => item.id === assistantId ? { ...item, text } : item)
            : [...previous, { id: assistantId, sender: 'assistant', text }]);
        },
      });
      if (request.signal.aborted) return;
      const assistant: Message = { id: assistantId, sender: 'assistant', text: response.text, ...actionForWidget(response.widgetType) };
      setMessages((previous) => previous.some((item) => item.id === assistantId)
        ? previous.map((item) => item.id === assistantId ? assistant : item)
        : [...previous, assistant]);
      setStatus('idle');
      setSuggestions(response.suggestedReplies || []);
      setSuggestionsExpanded(true);
    } catch (error) {
      if (request.signal.aborted) return;
      setStatus('error');
      setMessages((previous) => [...previous, { id: `${Date.now()}-error`, sender: 'assistant', isError: true, text: error instanceof Error ? error.message : 'No pudimos preparar una respuesta. Inténtalo de nuevo.' }]);
      setSuggestions(['Intentar de nuevo', 'Ver diseños de uñas']);
      setSuggestionsExpanded(true);
    } finally {
      if (requestRef.current === request) requestRef.current = null;
      if (!request.signal.aborted) requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }
  };

  const openMenuRoute = (path: '/designs' | '/quotes' | '/booking') => {
    setShowMenu(false);
    router.push(path as never);
  };

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <LinearGradient pointerEvents="none" colors={['#FFFCFD', '#FFF9FB', '#FCF8FA']} locations={[0, 0.52, 1]} style={StyleSheet.absoluteFill} />
    <ChatAmbientOrb width={width} height={height} topInset={insets.top} state={orbState} pulse={pulse} compact={compactOrb} />
    <View style={styles.header}>
      <Pressable onPress={() => setShowMenu(true)} style={styles.headerButton} accessibilityRole="button" accessibilityLabel="Abrir opciones de Emme"><Menu size={21} color={emmeTokens.modes.neutral.foreground} /></Pressable>
      <View style={styles.brandLockup}><View style={styles.brandMark}><Sparkles size={15} color="#FFFFFF" /></View><Text style={styles.brandName}>emme</Text></View>
      <Pressable onPress={resetConversation} style={styles.headerButton} accessibilityRole="button" accessibilityLabel="Empezar un chat nuevo"><Plus size={22} color={emmeTokens.brand.primary} /></Pressable>
    </View>

    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <View style={[styles.messageArea, compactOrb && styles.compactMessageArea]}>
      <ScrollView ref={scrollRef} style={styles.messageViewport} contentContainerStyle={styles.messages} keyboardShouldPersistTaps="handled" onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: status !== 'streaming' })}>
        {messages.map((message, index) => <Animated.View key={message.id} entering={FadeInDown.delay(Math.min(index, 5) * 70).duration(320).springify().damping(18)} layout={LinearTransition.springify().damping(20)} style={[styles.messageRow, message.sender === 'user' && styles.userRow]}>
          <View style={[styles.bubble, message.sender === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <Text accessibilityRole={message.isError ? 'alert' : undefined} accessibilityLiveRegion={message.isError ? 'assertive' : undefined} style={[styles.messageText, message.sender === 'user' && styles.userText]}>{message.text}</Text>
            {message.actionLabel && message.actionRoute ? <Pressable onPress={() => router.push(message.actionRoute as never)} style={styles.actionLink} accessibilityRole="link">
              <Text style={styles.actionText}>{message.actionLabel}</Text><ArrowUpRight size={16} color={emmeTokens.brand.primary} />
            </Pressable> : null}
          </View>
        </Animated.View>)}
        {status === 'waiting' ? <Animated.View entering={FadeInUp.duration(180)} style={styles.messageRow}>
          <View style={[styles.bubble, styles.assistantBubble, styles.typingBubble]}><TypingDot delay={0} /><TypingDot delay={110} /><TypingDot delay={220} /><Text style={styles.typingText}>Emme está pensando</Text></View>
        </Animated.View> : null}
      </ScrollView>
      </View>

      <View style={[styles.bottomDock, { paddingBottom: insets.bottom + 94 }]}>
          <Pressable onPress={() => setSuggestionsExpanded((expanded) => !expanded)} style={styles.dockHandle} accessibilityRole="button" accessibilityLabel={suggestionsExpanded ? 'Ocultar sugerencias' : 'Mostrar sugerencias'} accessibilityState={{ expanded: suggestionsExpanded }}>
            <ChevronDown size={19} color={emmeTokens.modes.neutral.muted} style={suggestionsExpanded ? undefined : styles.handleFlipped} />
          </Pressable>
          {suggestionsExpanded && suggestions.length > 0 ? nativeGlassAvailable ? <GlassContainer spacing={10} style={styles.suggestions}>
            {suggestions.map((suggestion) => <SuggestionPill key={suggestion} text={suggestion} nativeGlass onPress={() => send(suggestion === 'Intentar de nuevo' ? messages[messages.length - 2]?.text || '' : suggestion)} />)}
          </GlassContainer> : <Animated.View entering={FadeInUp.duration(220)} layout={LinearTransition.springify()} style={styles.suggestions}>
            {suggestions.map((suggestion, index) => <Animated.View key={suggestion} entering={FadeInUp.delay(index * 50).duration(220).springify()}>
              <SuggestionPill text={suggestion} nativeGlass={false} onPress={() => send(suggestion === 'Intentar de nuevo' ? messages[messages.length - 2]?.text || '' : suggestion)} />
            </Animated.View>)}
          </Animated.View> : null}
          <Animated.View style={[styles.composerShadow, composerAnimatedStyle]}>
            <View style={styles.composer}>
              <GlassBackdrop style={StyleSheet.absoluteFill} tintColor="rgba(255,255,255,0.30)" intensity={82} interactive large />
              <Pressable onPress={() => router.push('/quotes')} style={styles.attachButton} accessibilityRole="button" accessibilityLabel="Añadir foto de referencia">
                <Camera size={19} color={emmeTokens.modes.neutral.secondary} />
              </Pressable>
              <TextInput value={draft} onChangeText={changeDraft} placeholder="Pregúntale a Emme…" placeholderTextColor="rgba(90,40,70,0.55)" multiline maxLength={1000} returnKeyType="send" onSubmitEditing={() => send()} onFocus={() => { composerScale.value = withSpring(1.015, { damping: 16, stiffness: 220 }); }} onBlur={() => { composerScale.value = withSpring(1, { damping: 16, stiffness: 220 }); }} style={styles.input} accessibilityLabel="Mensaje para Emme" />
              <Pressable onPress={() => send()} disabled={!draft.trim() || isSending} style={[styles.sendButton, (!draft.trim() || isSending) && styles.sendDisabled]} accessibilityRole="button" accessibilityLabel="Enviar mensaje" accessibilityState={{ disabled: !draft.trim() || isSending }}>
                <ArrowUp size={19} color={draft.trim() && !isSending ? '#FFFFFF' : emmeTokens.modes.neutral.muted} strokeWidth={2.4} />
              </Pressable>
            </View>
          </Animated.View>
      </View>
    </KeyboardAvoidingView>

    <BottomSheet visible={showMenu} title="¿Qué hacemos hoy?" onClose={() => setShowMenu(false)}>
      <Pressable onPress={() => openMenuRoute('/designs')} style={styles.menuOption}><Text style={styles.menuTitle}>Explorar diseños</Text><Text style={styles.menuSubtext}>Inspiración por técnica y estilo</Text></Pressable>
      <Pressable onPress={() => openMenuRoute('/quotes')} style={styles.menuOption}><Text style={styles.menuTitle}>Cotizar una referencia</Text><Text style={styles.menuSubtext}>Cuéntanos qué diseño tienes en mente</Text></Pressable>
      <Pressable onPress={() => openMenuRoute('/booking')} style={styles.menuOption}><Text style={styles.menuTitle}>Agendar una cita</Text><Text style={styles.menuSubtext}>Elige servicio, día y horario</Text></Pressable>
    </BottomSheet>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF8FA' },
  header: { zIndex: 1, height: 60, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.78)' },
  headerButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.72)' },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  brandMark: { width: 28, height: 28, borderRadius: 10, backgroundColor: emmeTokens.brand.primary, alignItems: 'center', justifyContent: 'center' },
  brandName: { color: emmeTokens.modes.neutral.foreground, fontSize: 18, fontWeight: '800', letterSpacing: -0.6 },
  keyboard: { zIndex: 1, flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center' },
  messageArea: { flex: 1, minHeight: 0 },
  compactMessageArea: { paddingTop: 84 },
  messageViewport: { flex: 1, minHeight: 0 },
  messages: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 25, paddingBottom: 24, gap: 15 },
  messageRow: { alignSelf: 'flex-start', maxWidth: '90%' },
  userRow: { alignSelf: 'flex-end', maxWidth: '84%' },
  bubble: { paddingHorizontal: 16, paddingVertical: 13, minHeight: 44 },
  assistantBubble: { backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 8 },
  userBubble: { backgroundColor: 'rgba(255,255,255,0.90)', borderRadius: 24, borderBottomRightRadius: 8, borderWidth: 1, borderColor: 'rgba(166,62,104,0.08)' },
  messageText: { color: '#382D31', fontSize: 16, lineHeight: 24 },
  userText: { color: '#382D31' },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  typingDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: emmeTokens.brand.primary },
  typingText: { color: emmeTokens.modes.neutral.secondary, fontSize: 12, marginLeft: 5 },
  actionLink: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  actionText: { color: emmeTokens.brand.primary, fontSize: 13, fontWeight: '700' },
  bottomDockShadow: { position: 'absolute', left: 0, right: 0, bottom: 0, shadowColor: '#A63E68', shadowOpacity: 0.17, shadowRadius: 24, shadowOffset: { width: 0, height: -8 }, elevation: 8 },
  bottomDock: { paddingHorizontal: 18, paddingTop: 8, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'rgba(255,244,248,0.38)', overflow: 'hidden' },
  dockHandle: { width: 48, height: 30, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  handleFlipped: { transform: [{ rotate: '180deg' }] },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 10, paddingTop: 5, paddingBottom: 14 },
  suggestionTap: { minHeight: 46, borderRadius: 23, overflow: 'hidden' },
  suggestionGlass: { position: 'relative', minHeight: 46, borderRadius: 23, justifyContent: 'center', paddingHorizontal: 15, overflow: 'hidden' },
  nativeSuggestionRim: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  suggestionShadow: { borderRadius: 23, shadowColor: '#8B5269', shadowOpacity: 0.13, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  suggestion: { position: 'relative', minHeight: 46, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.94)', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 23, paddingHorizontal: 15, overflow: 'hidden', maxWidth: '100%' },
  pillSpecular: { position: 'absolute', left: 12, right: 12, top: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.96)' },
  suggestionText: { color: '#382D31', fontSize: 13, fontWeight: '600' },
  suggestionPressed: { opacity: 0.68, transform: [{ scale: 0.98 }] },
  composerShadow: { marginHorizontal: 18, borderRadius: 31, shadowColor: '#8B5269', shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 4 },
  composer: { position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 62, borderRadius: 31, backgroundColor: 'transparent', overflow: 'hidden', paddingLeft: 8, paddingRight: 8 },
  attachButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  input: { position: 'relative', zIndex: 1, flex: 1, minHeight: 46, maxHeight: 100, paddingVertical: 10, color: emmeTokens.modes.neutral.foreground, fontSize: 15, lineHeight: 21 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4B292B', alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { backgroundColor: '#EAE2E3' },
  menuOption: { minHeight: 62, justifyContent: 'center', gap: 4, paddingHorizontal: 15, borderRadius: 17, backgroundColor: emmeTokens.modes.neutral.surface },
  menuTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '700' },
  menuSubtext: { color: emmeTokens.modes.neutral.secondary, fontSize: 12 },
});
