'use client';

import { useState } from 'react';
import CityAutocomplete, { CityOption } from './CityAutocomplete';
import styles from './CityDistanceCalculator.module.css';
import calculateDistance from '../utils/calculateDistance';

const loadOptions = async (inputValue: string): Promise<CityOption[]> => {
  if (!inputValue) return [];
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${inputValue}&apiKey=fcc59a9fedd644e980aed64487f6d078`
    );
    const data = await response.json();
    return data.features.map((feature: any) => ({
      label: feature.properties.formatted,
      value: {
        lat: feature.properties.lat,
        lng: feature.properties.lon,
      },
    }));
  } catch (error) {
    console.error('Ошибка загрузки городов:', error);
    throw error;
  }
};

export default function Home() {
  const [cityA, setCityA] = useState<CityOption | null>(null);
  const [cityB, setCityB] = useState<CityOption | null>(null);

  const distance =
    cityA && cityB
      ? calculateDistance(
          cityA.value.lat,
          cityA.value.lng,
          cityB.value.lat,
          cityB.value.lng
        )
      : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Расстояние между городами</h1>
      <CityAutocomplete
        placeholder="Введите первый город"
        loadOptions={loadOptions}
        onSelect={setCityA}
      />
      <CityAutocomplete
        placeholder="Введите второй город"
        loadOptions={loadOptions}
        onSelect={setCityB}
      />
      {distance !== null && (
        <div className={styles.result}>Расстояние: {distance} км</div>
      )}
    </div>
  );
}
