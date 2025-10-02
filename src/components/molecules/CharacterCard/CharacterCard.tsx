import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { CharacterCardProps } from '@/types/components-character-card';

import { StatusBar } from '@/components/atoms/StatusBar/StatusBar';

import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { useModal } from '@/context/ModalContext';
import { resolvePlayerAvatar } from '@/services/avatarResolve';

import styles from './CharacterCard.module.css';

export const CharacterCard = ({
  character,
  selected = false,
  absorbed = false,
  interactive = true,
  onSelect,
}: CharacterCardProps) => {
  const initials = character.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const auth = useAuth();
  const { t } = useTranslation();
  const derivedAvatarUrl = resolvePlayerAvatar({
    avatarUrl: character.avatarUrl,
    avatarPath: (character as { avatarPath?: string | null }).avatarPath,
    legacyAvatar: (character as { avatar?: string | null }).avatar,
    authPicture: auth?.user?.picture || null,
  });

  const { showModal } = useModal();
  const { state } = useGame();
  const navigate = useNavigate();

  // compute days since last PR; if no date assume very old
  const now = Date.now();
  const lastPr = character.last_pr_at
    ? new Date(character.last_pr_at).getTime()
    : 0;
  const daysSince = lastPr
    ? Math.floor((now - lastPr) / (1000 * 60 * 60 * 24))
    : 9999;
  const daysLimit = 30;
  const riskProgress = Math.max(
    0,
    Math.min(
      100,
      Math.round((Math.min(daysSince, daysLimit) / daysLimit) * 100),
    ),
  );
  const willBeAbsorbed = daysSince >= daysLimit;

  const aiLevel = character.ai_level ?? character.stats?.ai_level ?? 0;

  const determineColor = (): 'green' | 'blue' | 'red' | 'orange' => {
    // if at risk, prefer orange (highlight), but very high ai_level overrides to red
    if (willBeAbsorbed) {
      return aiLevel >= 7 ? 'red' : 'orange';
    }
    if (aiLevel >= 7) return 'red';
    if (aiLevel >= 4) return 'orange';
    return 'blue';
  };

  const openView = () => {
    showModal({
      title: `${character.name} — Nivel ${character.level ?? 1}`,
      body: (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 12,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {derivedAvatarUrl ? (
              <img
                src={derivedAvatarUrl}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                {initials}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Estadísticas</h4>
            {character.stats ? (
              <div
                style={{
                  display: 'grid',
                  gap: '0.5rem',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))',
                  margin: 0,
                }}
              >
                {Object.entries(character.stats).map(([rawKey, v]) => {
                  const key = rawKey as string;
                  const labelMap: Record<string, string> = {
                    battles_won: 'Batallas Ganadas',
                    battles_lost: 'Batallas Perdidas',
                    damage_dealt: 'Daño Infligido',
                    damage_taken: 'Daño Recibido',
                    enemies_defeated: 'Enemigos Derrotados',
                    last_updated: 'Actualizado',
                    ai_level: 'Nivel IA',
                  };
                  const label = labelMap[key] || key.replace(/_/g, ' ');
                  const valueDisplay =
                    key === 'last_updated' && typeof v === 'number'
                      ? new Date(v).toLocaleString('es-ES', {
                          hour12: false,
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : String(v);
                  return (
                    <div
                      key={key}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '6px 8px',
                        borderRadius: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        minHeight: 54,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          letterSpacing: 0.5,
                          textTransform: 'uppercase',
                          opacity: 0.7,
                        }}
                      >
                        {label}
                      </span>
                      <strong style={{ fontSize: 14 }}>{valueDisplay}</strong>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ margin: 0 }}>Sin estadísticas disponibles.</p>
            )}

            <div style={{ marginTop: 12 }}>
              <StatusBar
                label="Tiempo hasta absorción"
                current={riskProgress}
                max={100}
                color={determineColor()}
              />
              <p style={{ marginTop: 6, color: 'var(--muted)', fontSize: 13 }}>
                {willBeAbsorbed
                  ? t('character.absorption.riskText')
                  : t('character.absorption.daysLeft', {
                      days: Math.max(0, daysLimit - daysSince),
                    })}
              </p>
            </div>
          </div>
        </div>
      ),
      actions: [
        { label: 'Cerrar', variant: 'ghost' },
        {
          label: 'Ver ladder',
          onClick: () => {
            navigate('/ladder');
          },
          variant: 'primary',
        },
        ...(state.userId === character.id
          ? [
              {
                label: 'Editar',
                onClick: () => {
                  navigate('/profile');
                },
                variant: 'primary' as const,
              },
            ]
          : []),
      ],
      allowClose: true,
    });
  };

  return (
    <div
      className={`${styles.wrapper} ${selected ? styles.selected : ''} ${absorbed ? styles.absorbed : ''}`}
    >
      {interactive ? (
        <button
          type="button"
          className={styles.card}
          onClick={() => {
            if (!absorbed) {
              onSelect?.(character.id);
              openView();
            }
          }}
          aria-pressed={selected}
          aria-disabled={absorbed}
          disabled={absorbed}
        >
          <div className={styles.avatar} aria-hidden>
            {derivedAvatarUrl ? (
              <img
                src={derivedAvatarUrl}
                alt={`${character.name} avatar`}
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarInner}>{initials}</div>
            )}
            <div className={styles.avatarBadge}>Lv {character.level ?? 1}</div>
          </div>

          <div className={styles.info}>
            <div className={styles.name}>{character.name}</div>

            <div className={styles.absorbWrapInline}>
              <StatusBar
                label={
                  willBeAbsorbed
                    ? t('character.absorption.risk')
                    : t('character.absorption.safe')
                }
                current={riskProgress}
                max={100}
                color={determineColor()}
              />
              <p className={styles.absorbText}>
                {willBeAbsorbed
                  ? t('character.absorption.riskText')
                  : t('character.absorption.daysLeft', {
                      days: Math.max(0, daysLimit - daysSince),
                    })}
              </p>
            </div>
          </div>

          <div className={styles.actionsInline} />
        </button>
      ) : (
        <div className={styles.card}>
          <div className={styles.avatar} aria-hidden>
            {derivedAvatarUrl ? (
              <img
                src={derivedAvatarUrl}
                alt={`${character.name} avatar`}
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarInner}>{initials}</div>
            )}
            <div className={styles.avatarBadge}>Lv {character.level ?? 1}</div>
          </div>

          <div className={styles.info}>
            <div className={styles.name}>{character.name}</div>

            <div className={styles.absorbWrapInline}>
              <StatusBar
                label={
                  willBeAbsorbed
                    ? t('character.absorption.risk')
                    : t('character.absorption.safe')
                }
                current={riskProgress}
                max={100}
                color={determineColor()}
              />
              <p className={styles.absorbText}>
                {willBeAbsorbed
                  ? t('character.absorption.riskText')
                  : t('character.absorption.daysLeft', {
                      days: Math.max(0, daysLimit - daysSince),
                    })}
              </p>
            </div>
          </div>

          <div className={styles.actionsInline} />
        </div>
      )}
    </div>
  );
};
