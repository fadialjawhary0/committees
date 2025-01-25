export const FormatDateToArabic = date => {
  const options = {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const formattedDate = new Date(date).toLocaleDateString('ar-EG', options);

  const [day, month, year] = formattedDate.split('/');
  return `${day}/${month}/${year}`;
};

export const FormatDateToArabicShort = date => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const formattedDate = new Date(date)?.toLocaleDateString('ar-EG', options);

  const [day, month, year] = formattedDate?.split('/');
  return `${day}/${month}/${year}`;
};

export const ExtractDateFromDateTime = dateTime => {
  return dateTime ? dateTime.split('T')[0] : '';
};
