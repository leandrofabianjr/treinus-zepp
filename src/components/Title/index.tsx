import styles from './styles.module.css';

export function Title({ children, center }: { children: React.ReactNode, center?: boolean }) {
  return <h1 className={`${styles.title} ${center ? styles.center : ''}`}>{children}</h1>;
}
