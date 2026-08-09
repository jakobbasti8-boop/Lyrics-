import React from 'react';
import { Composition, staticFile } from 'remotion';
import { getAudioDurationInSeconds } from '@remotion/media-utils';
import { LyricVideo } from './LyricVideo';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LyricVideo"
        component={LyricVideo}
        fps={FPS}
        width={1920}
        height={1080}
        // Fallback-Dauer für die Vorschau in Remotion Studio; beim Render
        // überschreibt calculateMetadata das mit der echten Audiolänge.
        durationInFrames={30 * FPS}
        defaultProps={{ title: 'Untitled' }}
        calculateMetadata={async ({ props }) => {
          const durationInSeconds = await getAudioDurationInSeconds(
            staticFile('audio.mp3'),
          );
          return {
            durationInFrames: Math.ceil(durationInSeconds * FPS) + FPS, // +1s Outro-Puffer
            props,
          };
        }}
      />
    </>
  );
};
