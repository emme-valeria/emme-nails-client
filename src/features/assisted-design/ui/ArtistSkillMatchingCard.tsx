import React, { useState } from 'react';
import {
  ArtistSkillMatcher,
  ArtistSkillMatrix,
  SkillMatchResult,
  SALON_EMME_ARTISTS
} from '@/domain/quotes/services/artist-skill-matcher';
import { 
  Users, 
  Award, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Star 
} from 'lucide-react';
import { cn } from '@emme/ui/lib/utils';

export interface ArtistSkillMatchingCardProps {
  requiredSkills?: {
    handPaintingMin?: number;
    charmsMin?: number;
    russianPrepMin?: number;
    acrylicSculptingMin?: number;
    catEyeAirbrushMin?: number;
  };
  baseDurationMinutes?: number;
  selectedArtistId?: string;
  onSelectArtist?: (artist: ArtistSkillMatrix, adjustedMinutes: number) => void;
  className?: string;
}

export const ArtistSkillMatchingCard: React.FC<ArtistSkillMatchingCardProps> = ({
  requiredSkills = { handPaintingMin: 4, charmsMin: 3, russianPrepMin: 5, acrylicSculptingMin: 4 },
  baseDurationMinutes = 90,
  selectedArtistId,
  onSelectArtist,
  className,
}) => {
  const [selectedId, setSelectedId] = useState<string>(selectedArtistId || 'art_valeria');

  const matches: SkillMatchResult[] = React.useMemo(() => {
    return ArtistSkillMatcher.matchArtists(requiredSkills, baseDurationMinutes, SALON_EMME_ARTISTS);
  }, [requiredSkills, baseDurationMinutes]);

  const handleSelect = (result: SkillMatchResult) => {
    setSelectedId(result.artist.artistId);
    onSelectArtist?.(result.artist, result.adjustedDurationMinutes);
  };

  return (
    <div id="artist-skill-matching-card" className={cn("bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
              Especialistas Cualificadas para este Set
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Emparejamiento según destreza en manicura rusa, mano alzada y esculpido
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-semibold border border-primary/20">
          <Award className="w-3.5 h-3.5" />
          <span>Matriz de Competencia Emme</span>
        </div>
      </div>

      {/* Artist List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {matches.map(m => {
          const isSelected = m.artist.artistId === selectedId;
          return (
            <div
              key={m.artist.artistId}
              onClick={() => handleSelect(m)}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                  : "border-border/60 hover:border-border bg-card"
              )}
            >
              <div className="flex items-center gap-3">
                <img
                  src={m.artist.avatarUrl}
                  alt={m.artist.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-border shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground truncate">{m.artist.name}</p>
                    {m.artist.tier === 'Master Artist' && (
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.artist.tier} • Cabina #{m.artist.cabinStationNumber}</p>
                </div>
              </div>

              {/* Match Details */}
              <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Compatibilidad Técnica:</span>
                  <span className={cn("font-semibold", m.matchScorePercent >= 90 ? "text-emerald-600" : "text-amber-600")}>
                    {m.matchScorePercent}% Match
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tiempo Estimado en Cabina:</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    ~{m.adjustedDurationMinutes} min
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground pt-1">
                  {m.recommendationReason}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className={cn(
                  "text-[11px] font-medium px-2 py-0.5 rounded-full",
                  m.isFullyQualified ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"
                )}>
                  {m.isFullyQualified ? '100% Calificada' : 'Requiere Asistencia'}
                </span>

                <button
                  type="button"
                  className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-lg transition-all",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  {isSelected ? 'Seleccionada' : 'Elegir'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
