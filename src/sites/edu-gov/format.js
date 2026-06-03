// Formatting helpers used across the Northbrook Connect surface.

const dayLabel = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});
const fullLabel = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  return dayLabel.format(d);
}

export function fmtDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ms = today.getTime() - d.getTime();
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return dayLabel.format(d);
}

export function fmtDateFull(iso) {
  if (!iso) return '';
  return fullLabel.format(new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')));
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
