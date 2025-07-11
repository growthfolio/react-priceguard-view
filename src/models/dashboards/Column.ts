import { CryptoRow } from './CryptoRow';

export interface Column<T> {
  key: keyof T;
  label: string;
  isVisible?: boolean; // Controla se a coluna deve ser exibida
  customRender?: (row: T, onChartClick?: (symbol: string) => void) => React.ReactNode;
}
