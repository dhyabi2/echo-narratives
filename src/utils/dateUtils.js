export const formatDateInArabic = (dateString) => {
  const date = new Date(dateString);
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  const day = date.getDate().toLocaleString('ar-EG');
  const month = arabicMonths[date.getMonth()];
  const year = date.getFullYear().toLocaleString('ar-EG');

  return `${day} ${month} ${year}`;
};