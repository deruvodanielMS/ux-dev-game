import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';

import styles from './NotFoundPage.module.css';

// Image placed in /public so we can refer with absolute path at runtime
const IMAGE_SRC = '/Gemini_Generated_Image_hjysr6hjysr6hjys.png';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className={styles.root} aria-labelledby="nf-title">
      <div className={styles.imageWrap} aria-hidden="true">
        <img src={IMAGE_SRC} alt="404 decorative" loading="lazy" />
      </div>
      <h1 id="nf-title" className={styles.title}>
        404 – Page Not Found
      </h1>
      <p className={styles.message}>
        The page you are looking for doesn&apos;t exist or was moved. Perhaps
        you followed an outdated link—or encountered a bug in our map of the
        multiverse.
      </p>
      <div className={styles.actions}>
        <Button onClick={() => navigate('/')}>Go Home</Button>
        <Button onClick={() => navigate('/dashboard')}>Open Dashboard</Button>
        <span className={styles.code}>ERR_404</span>
      </div>
    </main>
  );
};
