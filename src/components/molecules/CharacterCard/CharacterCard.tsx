import React from 'react';
import styles from './CharacterCard.module.css';
import { useToast } from '../../../context/ToastContext';
import { useModal } from '../../../context/ModalContext';
import { usePlayer } from '../../../context/PlayerContext';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../../atoms/StatusBar/StatusBar';

export type Character = {
  id: string;
  name: string;
  level?: number;
  stats?: Record<string, number>;
  avatarUrl?: string;
  last_pr_at?: string | null;
};

type Props = {
  character: Character;
  selected?: boolean;
  onSelect?: (id: string) => void;
  absorbed?: boolean;
};

export default function CharacterCard({ character, selected = false, onSelect, absorbed = false }: Props) {
  const initials = character.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const { notify } = useToast();
  const { showModal } = useModal();
  const { state } = usePlayer();
  const navigate = useNavigate();

  // compute days since last PR; if no date assume very old
  const now = Date.now();
  const lastPr = character.last_pr_at ? new Date(character.last_pr_at).getTime() : 0;
  const daysSince = lastPr ? Math.floor((now - lastPr) / (1000 * 60 * 60 * 24)) : 9999;
  const daysLimit = 30;
  const progress = Math.max(0, Math.min(100, Math.round(((daysLimit - Math.min(daysSince, daysLimit)) / daysLimit) * 100)));
  const willBeAbsorbed = daysSince >= daysLimit;

  function openView() {
    showModal({
      title: `${character.name} — Nivel ${character.level ?? 1}`,
      body: (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: 160, height: 160, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
            {character.avatarUrl ? <img src={character.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>{initials}</div>}
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Estadísticas</h4>
            {character.stats ? (
              <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                {Object.entries(character.stats).map(([k, v]) => (
                  <li key={k}>{k}: {v}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0 }}>Sin estadísticas disponibles.</p>
            )}

            <div style={{ marginTop: 12 }}>
              <StatusBar label="Tiempo hasta absorción" value={progress} max={100} color={willBeAbsorbed ? 'red' : 'blue'} />
              <p style={{ marginTop: 6, color: 'var(--muted)', fontSize: 13 }}>{willBeAbsorbed ? 'En riesgo: sin PR en 30 días' : `${Math.max(0, daysLimit - daysSince)} días restantes`}</p>
            </div>
          </div>
        </div>
      ),
      actions: [
        { label: 'Cerrar', variant: 'ghost' },
        { label: 'Ver ladder', onClick: () => { navigate('/progress'); }, variant: 'primary' },
        ...(state.userId === character.id ? [{ label: 'Editar', onClick: () => { navigate('/profile'); }, variant: 'primary' }] : []),
      ],
      allowClose: true,
    });
  }

  return (
    <div className={`${styles.wrapper} ${selected ? styles.selected : ''} ${absorbed ? styles.absorbed : ''}`}>
      <button
        type="button"
        className={styles.card}
        onClick={() => !absorbed && onSelect && onSelect(character.id)}
        aria-pressed={selected}
        aria-disabled={absorbed}
        disabled={absorbed}
      >
        <div className={styles.avatar} aria-hidden>
          {character.avatarUrl ? (
            <img src={character.avatarUrl} alt={`${character.name} avatar`} className={styles.avatarImage} />
          ) : (
            <div className={styles.avatarInner}>{initials}</div>
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.name}>{character.name}</div>
          <div className={styles.meta}>Nivel {character.level ?? 1}</div>
        </div>
      </button>

      <div className={styles.cardActions}>
        <button type="button" className={styles.viewBtn} onClick={openView}>Ver</button>
      </div>

      <div className={styles.absorbWrap}>
        <StatusBar label={willBeAbsorbed ? 'En riesgo' : 'Tiempo para absorción'} value={progress} max={100} color={willBeAbsorbed ? 'red' : 'blue'} />
      </div>
    </div>
  );
}
