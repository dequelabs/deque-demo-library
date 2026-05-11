// Formatting helpers used across the FinTech surface.

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function fmtMoney(n) {
  return usd.format(n);
}

export function fmtSignedMoney(n) {
  if (n < 0) return '-' + usd.format(Math.abs(n));
  return '+' + usd.format(n);
}

const dayLabel = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});
const fullLabel = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function fmtDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
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
  return fullLabel.format(new Date(iso + 'T00:00:00'));
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
