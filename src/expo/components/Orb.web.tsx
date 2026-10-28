import type { OrbProps } from './Orb.types';
import './orb.css';

export type { OrbState } from './Orb.types';

export function Orb({ state, pulse = 0 }: OrbProps) {
  return <div className="orb" data-state={state} aria-hidden="true">
    <div className="orb__shake">
      <div className="orb__breath">
        <div className="orb__disc" />
        {/* Only the heartbeat remounts: colour drift keeps its current phase. */}
        <div className="orb__pulse" key={pulse} />
      </div>
    </div>
    <div className="orb__arc" />
  </div>;
}
