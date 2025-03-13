// Функция расчёта расстояния между двумя точками по формуле гаверсинусов
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Радиус Земли в км
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  // Округляем до ближайших 10 км
  return Math.round(distance / 10) * 10;
};

// Функция для перевода градусов в радианы
const deg2rad = (deg: number) => deg * (Math.PI / 180);

export default calculateDistance;
