import React, { useContext } from 'react';
import { WebSocketContext } from '../contexts/WebSocketContext';

const WebSocketConsumer: React.FC = () => {
  const webSocketContext = useContext(WebSocketContext);

  if (!webSocketContext) {
    return <div>Loading WebSocket...</div>;
  }

  const { cryptoData, sendMessage } = webSocketContext;

  return (
    <div>
      <button
        onClick={() => sendMessage('Hello WebSocket!')}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Send Message
      </button>
      <div>
        {cryptoData.length > 0 ? (
          cryptoData.map((crypto, index) => (
            <CryptoRow key={index} crypto={crypto} />
          ))
        ) : (
          <div>No data available</div>
        )}
      </div>
    </div>
  );
};

// Componente para renderizar cada linha de dados
const CryptoRow: React.FC<{ crypto: any }> = ({ crypto }) => {
  return (
    <div className="crypto-row p-4 border-b border-gray-300">
      <img
        src={crypto.imgurl}
        alt={`${crypto.symbol || 'Unknown'} logo`}
        className="w-8 h-8 mr-4 inline-block"
      />
      <div>
        <p>
          <strong>Symbol:</strong> {crypto.symbol || 'N/A'}
        </p>
        <p>
          <strong>Market Type:</strong> {crypto.marketType || 'N/A'}
        </p>
        <p>
          <strong>Active:</strong> {crypto.active ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Price Change (1h):</strong> {crypto.priceChange_1h || 'N/A'}
        </p>
        <p>
          <strong>RSI (15m):</strong> {crypto.rsi_15m || 'N/A'}
        </p>
        <p>
          <strong>True Range (1m):</strong> {crypto.trueRange_1m || 'N/A'}
        </p>
        <p>
          <strong>Pullback (15m):</strong> {crypto.pullbackEntry_15m || 'N/A'}
        </p>
        <p>
          <strong>SuperTrend (5m):</strong> {crypto.superTrend4h_5m || 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default WebSocketConsumer;
