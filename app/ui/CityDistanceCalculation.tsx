'use client';
import React, { useState, useEffect } from 'react';
import vincentyDistance from '../utils/vincentyDistance';

// Интерфейс для представления города
interface City {
  name: string;
  lat: number;
  lon: number;
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
