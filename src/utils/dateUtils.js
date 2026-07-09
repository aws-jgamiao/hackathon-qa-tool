export const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
