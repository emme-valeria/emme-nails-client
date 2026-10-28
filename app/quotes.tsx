import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { ArrowLeft, Camera, Check, ChevronRight, ImagePlus, Sparkles, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { Easing, interpolate, runOnJS, useAnimatedReaction, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import { analyzeExpoNailImage } from '../src/expo/api';
import { emmeTokens } from '../src/expo/theme';
import type { GeminiNailImageAnalysis } from '../src/shared/services/geminiService';
import { OptimizedImage } from '../src/expo/components/OptimizedImage';

const nailShapes: GeminiNailImageAnalysis['detectedShape'][] = ['Almendra', 'Cuadrada', 'Coffin', 'Stiletto', 'Ovalada', 'Natural'];
const nailLengths: GeminiNailImageAnalysis['detectedLength'][] = ['Corto (S)', 'Medio (M)', 'Largo (L)', 'Extra Largo (XL)'];
function NailAnalysisScan({ imageUri, onClose }: { imageUri: string; onClose: () => void }) {
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState(0);
  const diameter = Math.min(width - 48, 390);
  const scanProgress = useSharedValue(0);
  const player = useVideoPlayer(require('../public/nail-inspection.mp4'), (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = true;
    videoPlayer.timeUpdateEventInterval = 0.25;
  });

  useEffect(() => {
    // Start only after VideoView mounts; otherwise the web player has no media element to play.
    player.play();
    scanProgress.value = withTiming(1, { duration: 6000, easing: Easing.linear });
  }, [player, scanProgress]);

  useAnimatedReaction(
    () => scanProgress.value,
    (progress, previousProgress) => {
      const currentStage = progress < 0.3 ? 0 : progress < 0.7 ? 1 : 2;
      const previousStage = previousProgress == null ? 0 : previousProgress < 0.3 ? 0 : previousProgress < 0.7 ? 1 : 2;
      if (currentStage !== previousStage) runOnJS(setStage)(currentStage);
    },
  );

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scanProgress.value, [0, 1], [16, diameter - 16]) }],
  }));
  return <SafeAreaView style={scanStyles.safe} edges={['top', 'bottom']}>
    <View style={scanStyles.header}>
      <Pressable onPress={onClose} style={scanStyles.closeButton} accessibilityLabel="Cerrar análisis"><X size={21} color="#29252A" /></Pressable>
      <Text style={scanStyles.headerLabel}>EMME AI · NAIL SCAN</Text>
      <View style={scanStyles.headerSpacer} />
    </View>
    <View style={scanStyles.main}>
      <View style={[scanStyles.photoStage, { width: diameter, height: diameter }]}>
        <View style={[scanStyles.photoFrame, { width: diameter, height: diameter, borderRadius: diameter / 2 }]}>
          <OptimizedImage source={{ uri: imageUri }} fill />
          <LinearGradient colors={['rgba(22,18,24,0.02)', 'rgba(22,18,24,0.08)']} style={StyleSheet.absoluteFill} pointerEvents="none" />
          {!reduceMotion && <Animated.View style={[scanStyles.scanSweep, { width: diameter - 34 }, scanStyle]}>
            <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.78)', 'rgba(248,180,190,0.95)', 'rgba(255,255,255,0.78)', 'rgba(255,255,255,0)']} locations={[0, 0.3, 0.5, 0.7, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={scanStyles.scanLine} />
            <LinearGradient colors={['rgba(248,180,190,0)', 'rgba(248,180,190,0.16)', 'rgba(248,180,190,0)']} style={scanStyles.scanGlow} />
          </Animated.View>}
          <View style={[StyleSheet.absoluteFill, scanStyles.scanCorners]} pointerEvents="none">
            <View style={[scanStyles.corner, scanStyles.cornerTL]} /><View style={[scanStyles.corner, scanStyles.cornerTR]} />
            <View style={[scanStyles.corner, scanStyles.cornerBL]} /><View style={[scanStyles.corner, scanStyles.cornerBR]} />
          </View>
        </View>
      </View>
      <Text style={scanStyles.scanTitle}>{['Detectando forma y largo de uñas…', 'Identificando técnicas y decoración…', 'Calculando materiales y mano de obra…'][stage]}</Text>
      <Text style={scanStyles.scanDescription}>Emme está preparando tu cotización personalizada</Text>
    </View>
    <View style={scanStyles.assistant}>
      <View style={scanStyles.rabbitOverlay}>
        <VideoView
          player={player}
          style={scanStyles.rabbitVideo}
          contentFit="contain"
          nativeControls={false}
          accessibilityLabel="Emme, el conejito, inspecciona la foto de uñas con una lupa"
        />
      </View>
      <Text style={scanStyles.assistantText}>Emme está observando cada detalle</Text>
      <Text style={scanStyles.assistantSubtext}>Tu estimación estará lista en un momento</Text>
    </View>
  </SafeAreaView>;
}

export default function QuotesScreen() {
  const { width } = useWindowDimensions();
  const referenceFrameHeight = Math.min(Math.max(width * 0.68, 240), 360);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [analysis, setAnalysis] = useState<GeminiNailImageAnalysis | null>(null);
  const [selectedShape, setSelectedShape] = useState<GeminiNailImageAnalysis['detectedShape'] | null>(null);
  const [selectedLength, setSelectedLength] = useState<GeminiNailImageAnalysis['detectedLength'] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const selectReference = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso necesario', 'Permite el acceso a tus fotos para elegir una referencia.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.82 });

    if (result.canceled || !result.assets[0]) return;
    setIsAnalyzing(false);
    setAnalysis(null);
    setSelectedShape(null);
    setSelectedLength(null);
    setError('');
    setReferenceImage(result.assets[0].uri);
    try {
      const compressed = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true },
      );
      setImageBase64(compressed.base64 || null);
    } catch {
      setImageBase64(result.assets[0].base64 || null);
    }
  };

  const analyze = async () => {
    if (!imageBase64 && !notes.trim()) {
      setError('Selecciona una foto o describe el diseño para cotizarlo.');
      return;
    }
    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);
    setSelectedShape(null);
    setSelectedLength(null);
    const currentRequestId = ++requestId.current;
    const startedAt = Date.now();
    const keepScanVisible = async () => {
      // Let the six-second inspection clip finish once before revealing the estimate.
      const remaining = Math.max(0, 6000 - (Date.now() - startedAt));
      if (remaining) await new Promise((resolve) => setTimeout(resolve, remaining));
    };
    try {
      const result = await analyzeExpoNailImage(imageBase64 || '', 'image/jpeg', notes.trim() || undefined);
      await keepScanVisible();
      if (requestId.current === currentRequestId) {
        setAnalysis(result);
        setSelectedShape(result.detectedShape);
        setSelectedLength(result.detectedLength);
      }
    } catch (cause) {
      await keepScanVisible();
      if (requestId.current === currentRequestId) setError(cause instanceof Error ? cause.message : 'No pudimos analizar el diseño. Inténtalo de nuevo.');
    } finally {
      if (requestId.current === currentRequestId) setIsAnalyzing(false);
    }
  };

  if (isAnalyzing && referenceImage) {
    return <NailAnalysisScan imageUri={referenceImage} onClose={() => { requestId.current += 1; setIsAnalyzing(false); router.replace('/(tabs)'); }} />;
  }

  if (analysis) {
    const isNailDesign = analysis.nailsDetected !== false;
    const bookingServiceId = /soft\s*gel|gel-x/i.test(`${analysis.recommendedService} ${analysis.technique}`)
      ? 'soft-gel'
      : /acrílic|acrylic/i.test(`${analysis.recommendedService} ${analysis.technique}`)
        ? 'acrilico-escultural'
        : 'manicura-rusa-rubber';
    return <SafeAreaView style={styles.resultScreen} edges={['top', 'bottom']}>
      <View style={styles.resultNav}>
        <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={10} style={styles.resultBack} accessibilityRole="button" accessibilityLabel="Volver al inicio"><ArrowLeft size={19} color="#302A30" /></Pressable>
        <Text style={styles.resultNavTitle}>Tu cotización</Text>
        <View style={styles.resultBack} />
      </View>
      <ScrollView contentContainerStyle={styles.resultScreenContent} showsVerticalScrollIndicator={false}>
        {referenceImage && <View style={styles.resultImageFrame}><OptimizedImage source={{ uri: referenceImage }} fill style={styles.resultScreenImage} /><View style={styles.imageTag}><Sparkles size={12} color={emmeTokens.brand.primary} /><Text style={styles.imageTagText}>ANÁLISIS EMME</Text></View></View>}
        {isNailDesign ? <>
          <Text style={styles.resultScreenKicker}>DISEÑO IDENTIFICADO</Text>
          <Text style={styles.resultScreenTitle}>{analysis.recommendedService}</Text>
          <Text style={styles.resultScreenDescription}>{analysis.description}</Text>
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Detalles del diseño</Text>
            <Text style={styles.optionLabel}>Forma de uña</Text>
            <View style={styles.optionChips}>{nailShapes.map((shape) => <Pressable key={shape} onPress={() => setSelectedShape(shape)} accessibilityRole="button" accessibilityState={{ selected: selectedShape === shape }} style={[styles.optionChip, selectedShape === shape && styles.optionChipSelected]}><Text style={[styles.optionChipText, selectedShape === shape && styles.optionChipTextSelected]}>{shape}</Text></Pressable>)}</View>
            <Text style={styles.optionLabel}>Largo</Text>
            <View style={styles.optionChips}>{nailLengths.map((length) => <Pressable key={length} onPress={() => setSelectedLength(length)} accessibilityRole="button" accessibilityState={{ selected: selectedLength === length }} style={[styles.optionChip, selectedLength === length && styles.optionChipSelected]}><Text style={[styles.optionChipText, selectedLength === length && styles.optionChipTextSelected]}>{length}</Text></Pressable>)}</View>
            <View style={styles.detailsChips}><Text style={styles.detailChip}>{analysis.complexity}</Text></View>
            <View style={styles.detailLine}><Text style={styles.detailLabel}>Técnica</Text><Text style={styles.detailValue}>{analysis.technique}</Text></View>
            <View style={styles.detailLine}><Text style={styles.detailLabel}>Colores</Text><Text style={styles.detailValue}>{analysis.detectedColors.slice(0, 3).join(', ') || 'Por definir'}</Text></View>
            <View style={styles.estimateLine}><View><Text style={styles.estimateLabel}>Estimado desde</Text><Text style={styles.estimatePrice}>${analysis.totalEstimatedPrice.toLocaleString('es-MX')} <Text style={styles.currency}>MXN</Text></Text></View><View style={styles.duration}><Text style={styles.durationText}>◷  {analysis.estimatedDurationMinutes} min</Text></View></View>
          </View>
          {analysis.stylistTip ? <Text style={styles.resultTip}><Sparkles size={14} color="#E05286" />  {analysis.stylistTip}</Text> : null}
        </> : <View style={styles.notNailsCard}><Text style={styles.resultScreenKicker}>NO ENCONTRAMOS UÑAS</Text><Text style={styles.resultScreenTitle}>Probemos con otra imagen</Text><Text style={styles.resultScreenDescription}>{analysis.rejectionReason || 'Sube una referencia donde se vean las uñas o describe el diseño que tienes en mente.'}</Text></View>}
        {analysis.fallback ? <Text style={styles.fallbackNote}>Estimación orientativa; el análisis inteligente no está disponible ahora.</Text> : null}
      </ScrollView>
      <View style={styles.resultActions}>
        <Pressable onPress={() => setAnalysis(null)} style={styles.editAction}><Text style={styles.editActionText}>{isNailDesign ? 'Editar' : 'Otra foto'}</Text></Pressable>
        {isNailDesign && <Pressable onPress={() => router.push({ pathname: '/booking', params: { service: bookingServiceId } })} style={styles.bookAction}><Text style={styles.bookActionText}>Agendar este diseño</Text><ChevronRight size={18} color="#FFFFFF" /></Pressable>}
      </View>
    </SafeAreaView>;
  }

  return <SafeAreaView style={styles.safe} edges={['top']}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.quoteHeader}>
      <Pressable onPress={() => router.replace('/(tabs)')} style={styles.back} accessibilityRole="button" accessibilityLabel="Volver al inicio"><ArrowLeft size={19} color={emmeTokens.modes.neutral.foreground} /></Pressable>
      <View style={styles.quoteHeading}><Text style={styles.kicker}>COTIZACIÓN EMME</Text><Text style={styles.title}>Dale forma a tu idea</Text><Text style={styles.subtitle}>Una referencia nos ayuda a preparar una estimación.</Text></View>
    </View>
    <Pressable onPress={selectReference} style={[styles.referencePicker, { height: referenceFrameHeight }]} accessibilityRole="button" accessibilityLabel={referenceImage ? 'Cambiar foto de referencia' : 'Elegir una foto de referencia'}>
      {referenceImage ? <OptimizedImage source={{ uri: referenceImage }} fill /> : <View style={styles.referenceEmpty}>
        <View style={styles.referenceIcon}><ImagePlus size={25} color={emmeTokens.brand.primary} /></View>
        <Text style={styles.referenceTitle}>Añade una referencia</Text>
        <Text style={styles.referenceText}>Elige una foto de uñas que te inspire</Text>
        <View style={styles.choosePhoto}><Camera size={15} color={emmeTokens.brand.primary} /><Text style={styles.choosePhotoText}>Elegir foto</Text></View>
      </View>}
      {referenceImage ? <View style={styles.referenceImageTag}><Check size={13} color="#FFFFFF" /><Text style={styles.referenceImageTagText}>TU REFERENCIA</Text><View style={styles.changePhoto}><Text style={styles.changePhotoText}>Cambiar</Text></View></View> : null}
    </Pressable>
    <View style={styles.quoteFields}>
      <Text style={styles.label}>¿Qué te gustaría ajustar? <Text style={styles.optional}>(opcional)</Text></Text>
      <TextInput value={notes} onChangeText={setNotes} placeholder="Largo, forma, tonos o acabado…" placeholderTextColor={emmeTokens.modes.neutral.muted} multiline style={styles.notes} accessibilityLabel="Notas para la cotización" />
      <Pressable onPress={analyze} disabled={isAnalyzing || (!imageBase64 && !notes.trim())} style={({ pressed }) => [styles.analyzeButton, (isAnalyzing || (!imageBase64 && !notes.trim())) && styles.disabled, pressed && styles.buttonPressed]} accessibilityRole="button" accessibilityLabel="Analizar referencia" accessibilityState={{ disabled: isAnalyzing || (!imageBase64 && !notes.trim()) }}>
        <Text style={styles.analyzeText}>Analizar y cotizar</Text><ChevronRight size={18} color="#FFFFFF" />
      </Pressable>
    </View>
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  quoteHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }, quoteHeading: { flex: 1, gap: 3, paddingTop: 2 }, kicker: { color: emmeTokens.brand.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  optional: { color: emmeTokens.modes.neutral.muted, fontWeight: '400' },
  referencePicker: { width: '100%', borderRadius: 24, overflow: 'hidden', backgroundColor: emmeTokens.modes.neutral.surfaceSubtle, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border },
  referenceEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 22 },
  referenceIcon: { width: 54, height: 54, borderRadius: 19, backgroundColor: emmeTokens.brand.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 3 },
  referenceTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 17, fontWeight: '700' },
  referenceText: { color: emmeTokens.modes.neutral.secondary, fontSize: 13, textAlign: 'center' },
  choosePhoto: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, borderRadius: 22, backgroundColor: emmeTokens.modes.neutral.surface, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, marginTop: 4 },
  choosePhotoText: { color: emmeTokens.brand.primary, fontSize: 13, fontWeight: '700' },
  referenceImageTag: { position: 'absolute', left: 13, right: 13, top: 13, minHeight: 38, paddingHorizontal: 11, borderRadius: 19, backgroundColor: 'rgba(20,15,17,0.48)', flexDirection: 'row', alignItems: 'center', gap: 7 },
  referenceImageTagText: { flex: 1, color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  changePhoto: { minHeight: 32, paddingHorizontal: 10, justifyContent: 'center', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)' },
  changePhotoText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  quoteFields: { padding: 16, gap: 9, borderRadius: 22, backgroundColor: emmeTokens.modes.neutral.surface, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border },
  safe: { flex: 1, backgroundColor: emmeTokens.modes.neutral.background }, content: { padding: 20, paddingTop: 10, paddingBottom: 30, maxWidth: 560, width: '100%', alignSelf: 'center', gap: 16 },
  back: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 44, width: 44, borderRadius: 22, backgroundColor: emmeTokens.modes.neutral.surface }, backText: { color: emmeTokens.modes.neutral.secondary, fontSize: 13, fontWeight: '600' }, title: { color: emmeTokens.modes.neutral.foreground, fontSize: 30, fontWeight: '800', letterSpacing: -1 }, subtitle: { color: emmeTokens.modes.neutral.secondary, fontSize: 14, lineHeight: 21 },
  upload: { alignItems: 'center', backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 12, paddingVertical: 8, marginTop: 22 }, uploadIcon: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECEDEF', borderWidth: 1, borderColor: '#E0E1E4' }, preview: { backgroundColor: '#F6EDF1' },
  label: { color: emmeTokens.modes.neutral.foreground, fontSize: 13, fontWeight: '700' }, notes: { minHeight: 76, borderRadius: 17, borderWidth: 1, borderColor: emmeTokens.modes.neutral.border, backgroundColor: emmeTokens.modes.neutral.surfaceSubtle, padding: 13, color: emmeTokens.modes.neutral.foreground, fontSize: 14, textAlignVertical: 'top' }, analyzeButton: { minHeight: 52, borderRadius: 26, backgroundColor: emmeTokens.brand.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 3 }, analyzeText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }, disabled: { opacity: 0.5 }, buttonPressed: { transform: [{ scale: 0.98 }] }, error: { color: emmeTokens.semantic.error, fontSize: 12, lineHeight: 18, marginTop: 4 },
  result: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 17, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', marginTop: 17 }, resultPreview: { width: '100%', height: 190, borderRadius: 16, marginBottom: 17, backgroundColor: '#F5F5F7' }, resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 }, resultIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: '#EFF7F3', alignItems: 'center', justifyContent: 'center' }, resultKicker: { color: '#32866A', fontSize: 9, fontWeight: '800', letterSpacing: 1 }, resultTitle: { color: '#1D1D1F', fontSize: 15, fontWeight: '700', marginTop: 4 }, resultBody: { color: '#86868B', fontSize: 12, lineHeight: 19, marginTop: 12 }, priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0EAEE', marginTop: 14, paddingTop: 13 }, priceLabel: { color: '#86868B', fontSize: 12 }, price: { color: '#1D1D1F', fontSize: 19, fontWeight: '800' }, facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 }, fact: { overflow: 'hidden', color: '#70525F', backgroundColor: '#FAF0F4', borderRadius: 99, paddingVertical: 6, paddingHorizontal: 10, fontSize: 10, fontWeight: '600' }, tip: { color: '#695960', backgroundColor: '#F7F4F5', borderRadius: 12, padding: 10, fontSize: 11, lineHeight: 17, marginTop: 12 }, fallbackNote: { color: '#9A6C30', fontSize: 10, lineHeight: 15, marginTop: 10 },
  resultScreen: { flex: 1, backgroundColor: emmeTokens.modes.neutral.background }, resultNav: { height: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, resultBack: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: emmeTokens.modes.neutral.surface }, resultNavTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 14, fontWeight: '700' }, resultScreenContent: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  resultImageFrame: { width: '100%', height: 290, borderRadius: 24, overflow: 'hidden', backgroundColor: emmeTokens.modes.neutral.surfaceSubtle }, resultScreenImage: { width: '100%', height: '100%' }, imageTag: { position: 'absolute', left: 13, top: 13, minHeight: 34, paddingHorizontal: 11, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.94)', flexDirection: 'row', alignItems: 'center', gap: 6 }, imageTagText: { color: emmeTokens.modes.neutral.foreground, fontSize: 9, fontWeight: '800', letterSpacing: 0.7 },
  resultScreenKicker: { color: emmeTokens.brand.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 20 }, resultScreenTitle: { color: emmeTokens.modes.neutral.foreground, fontSize: 24, lineHeight: 30, fontWeight: '800', letterSpacing: -0.5, marginTop: 6 }, resultScreenDescription: { color: emmeTokens.modes.neutral.secondary, fontSize: 14, lineHeight: 21, marginTop: 7 },
  detailsCard: { marginTop: 17, padding: 16, borderRadius: 32, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(130,126,138,0.10)', shadowColor: '#34303A', shadowOpacity: 0.045, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 1 }, detailsTitle: { color: '#302A30', fontSize: 13, fontWeight: '800' }, optionLabel: { color: '#86868B', fontSize: 10, fontWeight: '700', marginTop: 15, marginBottom: 8 }, optionChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, optionChip: { borderRadius: 99, paddingHorizontal: 11, paddingVertical: 8, backgroundColor: '#F5F5F7', borderWidth: 1, borderColor: '#F5F5F7' }, optionChipSelected: { backgroundColor: 'rgba(224,82,134,0.1)', borderColor: '#F2C4CE' }, optionChipText: { color: '#6F686E', fontSize: 10, fontWeight: '600' }, optionChipTextSelected: { color: '#A94F63', fontWeight: '800' }, detailsChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 }, detailChip: { color: '#A94F63', backgroundColor: 'rgba(224,82,134,0.1)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6, fontSize: 10, fontWeight: '700' }, detailLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 12 }, detailLabel: { color: '#86868B', fontSize: 11 }, detailValue: { flex: 1, color: '#302A30', fontSize: 11, fontWeight: '600', textAlign: 'right' }, estimateLine: { marginTop: 15, paddingTop: 13, borderTopWidth: 1, borderTopColor: '#F0EDF0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, estimateLabel: { color: '#86868B', fontSize: 10 }, estimatePrice: { color: '#1D1D1F', fontSize: 23, fontWeight: '800', marginTop: 3 }, currency: { color: '#86868B', fontSize: 11, fontWeight: '600' }, duration: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 99, backgroundColor: '#F5F5F7' }, durationText: { color: '#6F686E', fontSize: 10, fontWeight: '700' }, resultTip: { color: '#6F686E', fontSize: 11, lineHeight: 16, marginTop: 13 }, notNailsCard: { padding: 18, marginTop: 14, backgroundColor: '#FFFFFF', borderRadius: 21 }, resultActions: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, backgroundColor: '#F5F5F7' }, editAction: { minHeight: 52, minWidth: 96, paddingHorizontal: 18, borderRadius: 16, borderWidth: 1, borderColor: '#D8D2D8', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }, editActionText: { color: '#5D555C', fontSize: 12, fontWeight: '700' }, bookAction: { flex: 1, minHeight: 52, borderRadius: 16, backgroundColor: '#E05286', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, shadowColor: '#E05286', shadowOpacity: 0.22, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }, bookActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});

const scanStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F7' },
  header: { height: 56, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.76)', alignItems: 'center', justifyContent: 'center' },
  headerLabel: { color: '#86868B', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 }, headerSpacer: { width: 42 },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  photoStage: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  photoFrame: { overflow: 'hidden', backgroundColor: '#DEDCE4', borderWidth: 5, borderColor: 'rgba(255,255,255,0.82)', shadowColor: '#29232B', shadowOpacity: 0.12, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 5 },
  rabbitOverlay: { width: 104, height: 184, alignSelf: 'center', marginBottom: 8, backgroundColor: '#FCEAF1' },
  rabbitVideo: { width: 104, height: 184 },
  scanSweep: { position: 'absolute', left: 17, height: 34, justifyContent: 'center' }, scanLine: { position: 'absolute', left: 0, right: 0, top: 15, height: 3, borderRadius: 2 }, scanGlow: { position: 'absolute', left: 0, right: 0, top: 0, height: 34, opacity: 0.9 },
  scanCorners: { margin: 24 },
  corner: { width: 24, height: 24, borderColor: 'rgba(255,255,255,0.78)', borderWidth: 2, position: 'absolute', borderRadius: 6 },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 }, cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 }, cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 }, cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanTitle: { color: '#242126', fontSize: 23, fontWeight: '800', letterSpacing: -0.55, marginTop: 30, textAlign: 'center' },
  scanDescription: { color: '#86868B', fontSize: 12, lineHeight: 18, marginTop: 7, textAlign: 'center' },
  assistant: { minHeight: 250, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 26, paddingHorizontal: 22 },
  assistantText: { color: '#302B31', fontSize: 13, fontWeight: '700', marginTop: 4 }, assistantSubtext: { color: '#9A939A', fontSize: 11, marginTop: 5 },
});
