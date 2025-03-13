'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './CityAutocomplete.module.css';

export interface CityOption {
  label: string;
  value: {
    lat: number;
    lng: number;
  };
}

interface CityAutocompleteProps {
  placeholder: string;
  loadOptions: (inputValue: string) => Promise<CityOption[]>;
  onSelect: (option: CityOption) => void;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  placeholder,
  loadOptions,
  onSelect,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectionMade, setSelectionMade] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  // Простой кеш
  const cacheRef = useRef<{ [key: string]: CityOption[] }>({});

  useEffect(() => {
    // не загружаем подсказки
    if (inputValue.trim() === '' || selectionMade) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setError(null);
    const handler = setTimeout(() => {
      // кеш
      if (cacheRef.current[inputValue]) {
        setSuggestions(cacheRef.current[inputValue]);
        setShowSuggestions(true);
        return;
      }
      setIsLoading(true);
      loadOptions(inputValue)
        .then((options) => {
          cacheRef.current[inputValue] = options;
          setSuggestions(options);
          setShowSuggestions(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Ошибка загрузки городов:', err);
          setError('Ошибка загрузки городов');
          setIsLoading(false);
          setSuggestions([]);
          setShowSuggestions(false);
        });
    }, 300); // задержка 300 мс

    return () => clearTimeout(handler);
  }, [inputValue, selectionMade, loadOptions]);

  const handleSelect = (option: CityOption) => {
    setInputValue(option.label);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectionMade(true);
    onSelect(option);
  };

  // снимаем флаг выбора
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectionMade(false);
  };

  // Скрываем список подсказок
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          // при фокусе показываем подсказки (если есть)
          if (!selectionMade && suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        className={styles.input}
      />
      {isLoading && <div className={styles.loading}>Загрузка...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className={styles.suggestionItem}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;
