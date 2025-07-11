import { Column, CryptoRow } from "../../../models";

export const cryptoColumns: Column<CryptoRow>[] = [
  {
    key: 'symbol',
    label: 'Symbol',
    isVisible: true,
  },
  {
    key: 'marketType',
    label: 'Market Type',
    isVisible: true,
  },
  {
    key: 'priceChange_1d',
    label: 'Price Change (1D)',
    isVisible: true,
  },
  {
    key: 'rsi_15m',
    label: 'RSI (15m)',
    isVisible: true,
    customRender: (row) => <span>{(row.rsi_15m).toFixed(2)}</span>,
  },
  {
    key: 'imgurl',
    label: 'Image',
    isVisible: true,
    customRender: (row) => (
      <img
        src={row.imgurl || 'https://via.placeholder.com/16'}
        alt={row.symbol || 'N/A'}
        style={{ width: '24px', height: '24px' }}
      />
    ),
  },
];
