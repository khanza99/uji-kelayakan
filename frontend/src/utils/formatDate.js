/**
 * Format date string to readable format
 * @param {string} dateStr - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date);
};

/**
 * Format date with time
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Format time only (HH:mm)
 * @param {string} timeStr - Time string (HH:mm or HH:mm:ss)
 * @returns {string}
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '-';
  const parts = timeStr.split(':');
  return `${parts[0]}:${parts[1]}`;
};

/**
 * Get relative time from now
 * @param {string} dateStr
 * @returns {string}
 */
export const timeAgo = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};
