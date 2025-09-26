import { Button } from '@/components/atoms/Button/Button';

import { useAudio } from '@/context/AudioContext';

import styles from '../Header/Header.module.css';

export const SettingsModalContent = () => {
  const audio = useAudio();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Button
          variant="plain"
          className={styles.playBtn}
          onClick={() => (audio.isPlaying ? audio.pause() : audio.play())}
          ariaLabel="Toggle music"
          title="Toggle music"
        >
          {audio.isPlaying ? '⏸' : '⏵'}
        </Button>
        <label className={styles.volumeLabel} htmlFor="volume-slider">
          Vol
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
