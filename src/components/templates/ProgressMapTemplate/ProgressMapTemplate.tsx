import type { ProgressMapTemplateProps } from '@/types/components-progress-map-template';

import styles from './ProgressMapTemplate.module.css';

export const ProgressMapTemplate = ({
  title,
  subtitle,
  map,
  summary,
}: ProgressMapTemplateProps) => (
  <div className={styles.page}>
    <div className={styles.card}>
      {title}
      {subtitle}
      {map}
      {summary}
    </div>
  </div>
);
