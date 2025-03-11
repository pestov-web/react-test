import styles from './page.module.css';
import CityDistanceCalculator from './ui/CityDistanceCalculation';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CityDistanceCalculator />
      </main>
    </div>
  );
}
