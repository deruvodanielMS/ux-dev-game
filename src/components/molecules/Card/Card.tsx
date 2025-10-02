import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { BattleCardProps } from '@/types/components-card';

import styles from './Card.module.css';

export const Card = ({ id, onPlay }: BattleCardProps) => {
  const { t } = useTranslation();
  const [anim, setAnim] = useState(false);

  // Get card info from translations
  const getCardInfo = (cardId: string) => {
    switch (cardId) {
      case 'code-review':
        return {
          title: t('card.codeReview.title'),
          desc: t('card.codeReview.desc'),
        };
      case 'bug-fix':
        return {
          title: t('card.bugFix.title'),
          desc: t('card.bugFix.desc'),
        };
      case 'refactor':
        return {
          title: t('card.refactor.title'),
          desc: t('card.refactor.desc'),
        };
      default:
        return { title: cardId, desc: '' };
    }
  };

  const info = getCardInfo(id);

  const handleClick = () => {
    setAnim(true);
    setTimeout(() => {
      onPlay();
      setAnim(false);
    }, 180);
  };

  return (
    <button
      className={`${styles.card} ${anim ? styles.anim : ''}`}
      onClick={handleClick}
      aria-label={`Jugar ${info.title}`}
    >
      <div className={styles.title}>{info.title}</div>
      <div className={styles.desc}>{info.desc}</div>
    </button>
  );
};
