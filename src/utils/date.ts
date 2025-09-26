/* eslint-disable simple-import-sort/imports */
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('es');

export function formatIso(
  iso: string | number | Date | null | undefined,
): string {
  if (!iso) return '—';
  const d = typeof iso === 'number' ? dayjs(iso) : dayjs(iso);
  if (!d.isValid()) return '—';
  return d.format('YYYY-MM-DD HH:mm');
}

export function fromNow(
  iso: string | number | Date | null | undefined,
): string {
  if (!iso) return '—';
  const d = typeof iso === 'number' ? dayjs(iso) : dayjs(iso);
  if (!d.isValid()) return '—';
  return d.fromNow();
}
/* eslint-enable simple-import-sort/imports */
