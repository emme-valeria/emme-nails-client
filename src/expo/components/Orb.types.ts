export type OrbState = 'idle' | 'typing' | 'thinking' | 'responding' | 'error';

export type OrbProps = { state: OrbState; pulse?: number };
