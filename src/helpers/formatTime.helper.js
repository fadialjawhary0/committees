export const FormatTimeToArabic = time => {
  const [hour, minute] = time?.split(':')?.map(Number);
  const isAM = hour < 12;
  const arabicPeriod = isAM ? 'م' : 'ص';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute.toString().padStart(2, '0')} ${arabicPeriod}`;
};
