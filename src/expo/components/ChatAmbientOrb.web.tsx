import type { CSSProperties } from 'react';
import { Orb } from './Orb.web';
import type { OrbProps } from './Orb.types';

export function ChatAmbientOrb({ width, height, topInset, compact = false, ...props }: OrbProps & { width: number; height: number; topInset: number; compact?: boolean }) {
  const diameter = Math.min(width * 0.49, 190);
  const style = {
    width: diameter,
    height: diameter,
    left: (width - diameter) / 2,
    top: (height - diameter) / 2 - topInset,
    '--size': `${diameter}px`,
    '--compact-scale': 52 / diameter,
    // Header (60) + 12px clearance + half the compact disc (26).
    '--compact-y': `${98 - (height / 2 - topInset)}px`,
  } as CSSProperties;
  return <div className="orb-position" data-compact={compact} style={style} aria-hidden="true">
    <Orb {...props} />
  </div>;
}
