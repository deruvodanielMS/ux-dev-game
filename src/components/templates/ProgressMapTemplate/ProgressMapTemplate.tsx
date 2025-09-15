import type { ProgressMapTemplateProps } from '@/types/components-progress-map-template';

import styles from './ProgressMapTemplate.module.css';

export const ProgressMapTemplate = ({
  title,
  subtitle,
  map,
  summary,
}: ProgressMapTemplateProps) => (
  <div className={styles.page}>
    <main className={styles.card}>
      {title}
      {subtitle}
      {map}
      {summary}
    </main>
  </div>
);
