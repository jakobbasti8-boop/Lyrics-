import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import lyricsData from '../public/lyrics.json';

type Word = { word: string; start: number; end: number };

// Fasst einzelne Wörter zu Zeilen zusammen (Pause > 0.6s oder Satzende = neue Zeile)
const buildLines = (words: Word[]): Word[][] => {
  const lines: Word[][] = [];
  let current: Word[] = [];

  words.forEach((w, i) => {
    current.push(w);
    const next = words[i + 1];
    const gap = next ? next.start - w.end : Infinity;
    const endsWithPunctuation = /[.!?]$/.test(w.word);

    if (gap > 0.6 || endsWithPunctuation || current.length >= 7) {
      lines.push(current);
      current = [];
    }
  });
  if (current.length) lines.push(current);
  return lines;
};

export const Lyrics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const lines = useMemo(() => buildLines(lyricsData as Word[]), []);

  const activeLineIndex = lines.findIndex(
    (line) => t >= line[0].start - 0.15 && t <= line[line.length - 1].end + 0.4,
  );

  if (activeLineIndex === -1) {
    return null;
  }

  const line = lines[activeLineIndex];
  const lineStart = line[0].start;
  const opacity = interpolate(t, [lineStart - 0.15, lineStart], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 420,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        padding: '0 120px',
      }}
    >
      <div
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 72,
          lineHeight: 1.2,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 20px',
        }}
      >
        {line.map((w, i) => {
          const isActive = t >= w.start && t <= w.end;
          const isPast = t > w.end;
          return (
            <span
              key={i}
              style={{
                color: isActive ? '#ffc371' : isPast ? '#ffffff' : 'rgba(255,255,255,0.45)',
                textShadow: isActive
                  ? '0 0 30px rgba(255,195,113,0.9)'
                  : '0 2px 8px rgba(0,0,0,0.6)',
                transition: 'color 0.1s linear',
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
