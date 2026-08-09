import React from 'react';
import { useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

export const Waveform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(staticFile('audio.mp3'));

  if (!audioData) {
    return null;
  }

  const NUM_BARS = 64;
  const frequencies = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: NUM_BARS * 2, // Power of 2, wir nutzen die untere Hälfte
  });

  const bars = frequencies.slice(0, NUM_BARS);
  const maxBarHeight = 260;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 180,
        left: 0,
        right: 0,
        height: maxBarHeight,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      {bars.map((v, i) => {
        const height = Math.max(4, v * maxBarHeight * 4);
        return (
          <div
            key={i}
            style={{
              width: 14,
              height,
              borderRadius: 4,
              background:
                'linear-gradient(180deg, #ff5f6d 0%, #ffc371 100%)',
              boxShadow: '0 0 12px rgba(255, 95, 109, 0.6)',
            }}
          />
        );
      })}
    </div>
  );
};
