export const formatDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', isoString);
    return '-';
  }
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', isoString);
    return '-';
  }
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', isoString);
    return '-';
  }
  return date.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
