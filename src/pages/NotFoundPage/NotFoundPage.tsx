import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';
import { Heading, Text } from '@/components/atoms/Typography';

import styles from './NotFoundPage.module.css';

// Image placed in /public so we can refer with absolute path at runtime
const IMAGE_SRC = '/Gemini_Generated_Image_hjysr6hjysr6hjys.png';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <main className={styles.root} aria-labelledby="nf-title">
      <div className={styles.imageWrap} aria-hidden="true">
        <img src={IMAGE_SRC} alt="404 decorative" loading="lazy" />
      </div>
      <Heading id="nf-title" level="h1" className={styles.title}>
        {t('error.404.title')}
      </Heading>
      <Text className={styles.message}>{t('error.404.message')}</Text>
      <div className={styles.actions}>
        <Button onClick={() => navigate('/')}>{t('error.404.action')}</Button>
        <Button onClick={() => navigate('/dashboard')}>
          {t('nav.progress')}
        </Button>
        <span className={styles.code}>ERR_404</span>
      </div>
    </main>
  );
};
