'use client';
import React, { useState, useEffect } from 'react';

// Интерфейс для представления города
interface City {
  name: string;
  lat: number;
  lon: number;
}

// Функция для расчёта расстояния по формуле Винсента
function vincentyDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  // Параметры эллипсоида WGS84
  const a = 6378137; // большая полуось (в метрах)
  const b = 6356752.314245; // малая полуось (в метрах)
  const f = 1 / 298.257223563; // сжатие

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

const CityDistanceCalculator: React.FC = () => {
  // Состояния для городов, значений полей и подсказок
  const [city1, setCity1] = useState<City | null>(null);
  const [city2, setCity2] = useState<City | null>(null);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [suggestions1, setSuggestions1] = useState<City[]>([]);
  const [suggestions2, setSuggestions2] = useState<City[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  // Функция для получения подсказок через API Nominatim
  const fetchSuggestions = async (query: string): Promise<City[]> => {
    if (!query) return [];
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
      query
    )}&format=json&limit=5`;
    const response = await fetch(url);
    const data = await response.json();
    return data.map((item: any) => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  };

  // Дебаунс для первого поля
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(input1).then(setSuggestions1);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [input1]);

  // Дебаунс для второго поля
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(input2).then(setSuggestions2);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [input2]);

  // Пересчёт расстояния, когда оба города выбраны
  useEffect(() => {
    if (city1 && city2) {
      const d = vincentyDistance(city1.lat, city1.lon, city2.lat, city2.lon);
      // Округление до ближайших 10 км
      setDistance(Math.round(d / 10) * 10);
    }
  }, [city1, city2]);

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label>Город 1:</label>
        <br />
        <input
          type="text"
          value={input1}
          onChange={(e) => {
            setInput1(e.target.value);
            setCity1(null);
          }}
          style={{ width: '100%', padding: '8px' }}
        />
        {suggestions1.length > 0 && (
          <ul
            style={{ listStyle: 'none', padding: 0, border: '1px solid #ccc' }}
          >
            {suggestions1.map((city, index) => (
              <li
                key={index}
                onClick={() => {
                  setCity1(city);
                  setInput1(city.name);
                  setSuggestions1([]);
                }}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Город 2:</label>
        <br />
        <input
          type="text"
          value={input2}
          onChange={(e) => {
            setInput2(e.target.value);
            setCity2(null);
          }}
          style={{ width: '100%', padding: '8px' }}
        />
        {suggestions2.length > 0 && (
          <ul
            style={{ listStyle: 'none', padding: 0, border: '1px solid #ccc' }}
          >
            {suggestions2.map((city, index) => (
              <li
                key={index}
                onClick={() => {
                  setCity2(city);
                  setInput2(city.name);
                  setSuggestions2([]);
                }}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                }}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {city1 && city2 && distance !== null && (
        <div>
          <h3>Расстояние между городами: {distance} км</h3>
        </div>
      )}
    </div>
  );
};

export default CityDistanceCalculator;
