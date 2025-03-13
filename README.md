# City Distance Calculator

Данный проект представляет собой тестовое задание для вычисления расстояния «по прямой» между двумя городами. Проект реализован с использованием Next.js, TypeScript и React, и демонстрирует создание легковесного компонента автодополнения на базе нативного решения с кешированием и дебаунсом.

## Функциональность

- **Автодополнение городов:**  
  При вводе названия города выполняется запрос к [Geoapify API](https://www.geoapify.com/) для получения подсказок.

- **Расчет расстояния:**  
  Вычисление расстояния между двумя выбранными городами осуществляется по формуле гаверсинусов с округлением результата до ближайших 10 км.

- **Оптимизация запросов:**  
  Реализован дебаунс (300 мс) для уменьшения количества запросов, а также кеширование результатов запросов для повышения производительности.

- **Обработка ошибок:**  
  При возникновении ошибок загрузки данных выводится сообщение об ошибке.

## Технологии

- **Next.js** — фреймворк для серверного рендеринга и создания React-приложений.
- **React** — библиотека для построения пользовательских интерфейсов.
- **TypeScript** — надстройка над JavaScript, обеспечивающая статическую типизацию.
- **CSS Modules** — локализованное оформление компонентов.
- **Geoapify API** — сторонний сервис для автодополнения городов и получения геокоординат.

## Структура проекта

```


app/
├── page.tsx
├── ui/
│   ├── CityAutocomplete.module.css
│   ├── CityAutocomplete.tsx
│   ├── CityDistanceCalculation.tsx
│   └── CityDistanceCalculator.module.css
└── utils/
   ├── calculateDistance.ts
   └── vincentyDistance.ts
```

## Установка и запуск

1. **Клонирование репозитория:**

   ```bash
   git clone <URL_репозитория>
   cd <название_проекта>
   ```

````

2. **Установка зависимостей:**

   ```bash
   npm install
   # или
   pnpm i
   ```

3. **Настройка API ключа:**

   Найдите в коде URL запроса к Geoapify API и замените `apiKey` на ваш собственный ключ:

   ```tsx
   https://api.geoapify.com/v1/geocode/autocomplete?text=${inputValue}&apiKey=ВАШ_API_КЛЮЧ
   ```

4. **Запуск проекта:**

   Для запуска проекта в режиме разработки выполните:

   ```bash
   npm run dev
   # или
   pnpm dev
   ```

   Откройте браузер и перейдите по адресу [http://localhost:3000](http://localhost:3000).



````
