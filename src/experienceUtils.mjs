export function parseMonthYear(str) {
  if (!str) return null;
  if (/present/i.test(str)) return new Date();
  const match = str.match(/([A-Za-z]+)\s+(\d{4})/);
  return match ? new Date(`${match[1]} 1, ${match[2]}`) : null;
}

export function parseDateRange(range) {
  if (!range) return { start: null, end: null };
  const [startStr, endStr] = range.split(/\s*[-\u2013]\s*/);
  return { start: parseMonthYear(startStr), end: parseMonthYear(endStr) };
}

export function formatDuration(months) {
  if (!Number.isFinite(months) || months <= 0) return '';
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (rem) parts.push(`${rem} mo${rem > 1 ? 's' : ''}`);
  return parts.length ? parts.join(' ') : '< 1 mo';
}

export function monthsBetween(start, end) {
  if (!start || !end) return 0;
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1
  );
}

export function roleDuration(role) {
  const { start, end } = parseDateRange(role.dateRange);
  return formatDuration(monthsBetween(start, end));
}

export function computeCompanyTenure(roles) {
  let earliest = null;
  let latest = null;
  for (const role of roles) {
    const { start, end } = parseDateRange(role.dateRange);
    if (start && (!earliest || start < earliest)) earliest = start;
    if (end && (!latest || end > latest)) latest = end;
  }
  return formatDuration(monthsBetween(earliest, latest));
}

export function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !/^\(|\)$/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}
