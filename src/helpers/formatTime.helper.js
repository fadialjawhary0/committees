export const FormatTimeToArabic = time => {
  const [hour, minute] = time.split(':').map(Number);
  const isAM = hour < 12;
  const arabicPeriod = isAM ? 'م' : 'ص';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute.toString().padStart(2, '0')} ${arabicPeriod}`;
};

export const FormatDateToArabic = date => {
  const options = {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const formattedDate = new Date(date).toLocaleDateString('ar-EG', options);

  const [day, month, year] = formattedDate.split('/');
  return `${day}-${month}-${year}`;
};
