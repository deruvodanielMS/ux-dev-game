import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button/Button';

import { useAudio } from '@/context/AudioContext';

import styles from './AudioControls.module.css';

export const AudioControls: React.FC = () => {
  const audio = useAudio();
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <Button
          variant="plain"
          className={styles.playBtn}
          onClick={() => (audio.isPlaying ? audio.pause() : audio.play())}
          ariaLabel={t('audio.toggle')}
          title={t('audio.toggle')}
        >
          {audio.isPlaying ? '⏸' : '⏵'}
        </Button>
        <label className={styles.volumeLabel} htmlFor="volume-slider">
          {t('audio.volume')}
        </label>
        <input
          id="volume-slider"
          className={styles.volume}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={audio.volume}
          onChange={(e) => audio.setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
};
