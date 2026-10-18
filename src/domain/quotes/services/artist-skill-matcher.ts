// Domain Service: Artist Skill Matching & Cabin Assignment
// Matches technical requirements of a quote against salon artists' skill matrix

export interface ArtistSkillMatrix {
  artistId: string;
  name: string;
  avatarUrl: string;
  tier: 'Junior Artist' | 'Senior Specialist' | 'Master Artist' | 'Creative Director';
  speedMultiplier: number; // 0.85 = faster, 1.2 = slower/more meticulous
  skills: {
    handPainting: number; // 1 to 5
    charmsAndGems: number; // 1 to 5
    russianPrep: number; // 1 to 5
    acrylicSculpting: number; // 1 to 5
    gelOverlays: number; // 1 to 5
    catEyeAirbrush: number; // 1 to 5
  };
  isActive: boolean;
  cabinStationNumber: number;
}

export const SALON_EMME_ARTISTS: ArtistSkillMatrix[] = [
  {
    artistId: 'art_valeria',
    name: 'Valeria Montes',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    tier: 'Master Artist',
    speedMultiplier: 0.9,
    skills: {
      handPainting: 5,
      charmsAndGems: 5,
      russianPrep: 5,
      acrylicSculpting: 5,
      gelOverlays: 5,
      catEyeAirbrush: 5,
    },
    isActive: true,
    cabinStationNumber: 1,
  },
  {
    artistId: 'art_sofia',
    name: 'Sofía Navarro',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    tier: 'Senior Specialist',
    speedMultiplier: 1.0,
    skills: {
      handPainting: 4,
      charmsAndGems: 4,
      russianPrep: 5,
      acrylicSculpting: 4,
      gelOverlays: 5,
      catEyeAirbrush: 4,
    },
    isActive: true,
    cabinStationNumber: 2,
  },
  {
    artistId: 'art_camila',
    name: 'Camila Reyes',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    tier: 'Senior Specialist',
    speedMultiplier: 1.05,
    skills: {
      handPainting: 3,
      charmsAndGems: 4,
      russianPrep: 5,
      acrylicSculpting: 3,
      gelOverlays: 5,
      catEyeAirbrush: 4,
    },
    isActive: true,
    cabinStationNumber: 3,
  },
  {
    artistId: 'art_elena',
    name: 'Elena Garza',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    tier: 'Junior Artist',
    speedMultiplier: 1.15,
    skills: {
      handPainting: 2,
      charmsAndGems: 3,
      russianPrep: 4,
      acrylicSculpting: 2,
      gelOverlays: 4,
      catEyeAirbrush: 3,
    },
    isActive: true,
    cabinStationNumber: 4,
  },
];

export interface SkillMatchResult {
  artist: ArtistSkillMatrix;
  matchScorePercent: number; // 0 to 100
  isFullyQualified: boolean;
  adjustedDurationMinutes: number;
  unqualifiedSkills: string[];
  recommendationReason: string;
}

export class ArtistSkillMatcher {
  public static matchArtists(
    requiredSkills: {
      handPaintingMin?: number;
      charmsMin?: number;
      russianPrepMin?: number;
      acrylicSculptingMin?: number;
      catEyeAirbrushMin?: number;
    },
    baseDurationMinutes: number,
    artists = SALON_EMME_ARTISTS
  ): SkillMatchResult[] {
    const results: SkillMatchResult[] = artists.map(artist => {
      let matchedPoints = 0;
      let totalRequiredPoints = 0;
      const unqualified: string[] = [];

      if (requiredSkills.handPaintingMin) {
        totalRequiredPoints += requiredSkills.handPaintingMin;
        if (artist.skills.handPainting >= requiredSkills.handPaintingMin) {
          matchedPoints += requiredSkills.handPaintingMin;
        } else {
          matchedPoints += artist.skills.handPainting;
          unqualified.push(`Nail art a mano alzada (Requiere nivel ${requiredSkills.handPaintingMin}, artista tiene ${artist.skills.handPainting})`);
        }
      }

      if (requiredSkills.charmsMin) {
        totalRequiredPoints += requiredSkills.charmsMin;
        if (artist.skills.charmsAndGems >= requiredSkills.charmsMin) {
          matchedPoints += requiredSkills.charmsMin;
        } else {
          matchedPoints += artist.skills.charmsAndGems;
          unqualified.push(`Joyería 3D / Pedrería (Requiere nivel ${requiredSkills.charmsMin}, artista tiene ${artist.skills.charmsAndGems})`);
        }
      }

      if (requiredSkills.acrylicSculptingMin) {
        totalRequiredPoints += requiredSkills.acrylicSculptingMin;
        if (artist.skills.acrylicSculpting >= requiredSkills.acrylicSculptingMin) {
          matchedPoints += requiredSkills.acrylicSculptingMin;
        } else {
          matchedPoints += artist.skills.acrylicSculpting;
          unqualified.push(`Esculpido de estructura (Requiere nivel ${requiredSkills.acrylicSculptingMin}, artista tiene ${artist.skills.acrylicSculpting})`);
        }
      }

      if (requiredSkills.russianPrepMin) {
        totalRequiredPoints += requiredSkills.russianPrepMin;
        if (artist.skills.russianPrep >= requiredSkills.russianPrepMin) {
          matchedPoints += requiredSkills.russianPrepMin;
        } else {
          matchedPoints += artist.skills.russianPrep;
          unqualified.push(`Manicura rusa de precisión`);
        }
      }

      const score = totalRequiredPoints > 0
        ? Math.round((matchedPoints / totalRequiredPoints) * 100)
        : 100;

      const isQualified = unqualified.length === 0;
      const adjustedMinutes = Math.round(baseDurationMinutes * artist.speedMultiplier);

      let reason = 'Especialista perfectamente cualificada para el set completo.';
      if (!isQualified) {
        reason = `Requiere supervisión en: ${unqualified.join(', ')}`;
      } else if (artist.tier === 'Master Artist') {
        reason = 'Máxima destreza en técnica avanzada y tiempo óptimo.';
      }

      return {
        artist,
        matchScorePercent: score,
        isFullyQualified: isQualified,
        adjustedDurationMinutes: adjustedMinutes,
        unqualifiedSkills: unqualified,
        recommendationReason: reason,
      };
    });

    // Sort by best match score descending, then by speed
    return results.sort((a, b) => b.matchScorePercent - a.matchScorePercent || a.adjustedDurationMinutes - b.adjustedDurationMinutes);
  }
}
