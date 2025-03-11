// Функция для расчёта расстояния по формуле Винсента

const a = 6378137; // большая полуось (в метрах)
const b = 6356752.314245; // малая полуось (в метрах)
const f = 1 / 298.257223563; // сжатие

export default function vincentyDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  // Параметры эллипсоида WGS84

  const L = toRad(lon2 - lon1);
  const U1 = Math.atan((1 - f) * Math.tan(toRad(lat1)));
  const U2 = Math.atan((1 - f) * Math.tan(toRad(lat2)));
  const sinU1 = Math.sin(U1),
    cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2),
    cosU2 = Math.cos(U2);

  let lambda = L;
  let lambdaP: number;
  let iterLimit = 100;
  let sinSigma, cosSigma, sigma, sinAlpha, cosSqAlpha, cos2SigmaM, C;

  do {
    const sinLambda = Math.sin(lambda);
    const cosLambda = Math.cos(lambda);
    sinSigma = Math.sqrt(
      Math.pow(cosU2 * sinLambda, 2) +
        Math.pow(cosU1 * sinU2 - sinU1 * cosU2 * cosLambda, 2)
    );
    if (sinSigma === 0) return 0; // точки совпадают
    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
    sigma = Math.atan2(sinSigma, cosSigma);
    sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
    cosSqAlpha = 1 - sinAlpha * sinAlpha;
    cos2SigmaM =
      cosSqAlpha !== 0 ? cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha : 0;
    C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    lambdaP = lambda;
    lambda =
      L +
      (1 - C) *
        f *
        sinAlpha *
        (sigma +
          C *
            sinSigma *
            (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
  } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

  if (iterLimit === 0) {
    console.warn('Формула Винсента не сошлась');
    return NaN;
  }

  const uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const deltaSigma =
    B *
    sinSigma *
    (cos2SigmaM +
      (B / 4) *
        (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
          (B / 6) *
            cos2SigmaM *
            (-3 + 4 * sinSigma * sinSigma) *
            (-3 + 4 * cos2SigmaM * cos2SigmaM)));
  const distance = b * A * (sigma - deltaSigma);

  return distance / 1000; // возвращаем расстояние в км
}
