import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { Waveform } from './Waveform';
import { Lyrics } from './Lyrics';

type Props = {
  title: string;
};

export const LyricVideo: React.FC<Props> = ({ title }) => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 30%, #1a1a2e 0%, #0a0a12 100%)',
      }}
    >
      <Audio src={staticFile('audio.mp3')} />

      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 900,
          fontSize: 48,
          letterSpacing: 4,
          color: 'rgba(255,255,255,0.85)',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>

      <Waveform />
      <Lyrics />
    </AbsoluteFill>
  );
};
