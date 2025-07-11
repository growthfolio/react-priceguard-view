const RiskSettings = ({
    wallet,
    riskLimitPercent,
    positionLimit,
    setRiskLimitPercent,
    setPositionLimit,
  }: {
    wallet: number;
    riskLimitPercent: number;
    positionLimit: number;
    setRiskLimitPercent: (value: number) => void;
    setPositionLimit: (value: number) => void;
  }) => {
    const calculateRiskLimit = () => (wallet * riskLimitPercent) / 100;
    const calculatePositionLimit = () => {
      const riskLimit = calculateRiskLimit();
      return riskLimit / positionLimit < 20 ? 20 : riskLimit / positionLimit;
    };
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-4 mt-6">Configurações de Risco</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Risk Limit (%)</label>
          <input
            type="number"
            value={riskLimitPercent}
            onChange={(e) => setRiskLimitPercent(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Position Limit</label>
          <input
            type="number"
            value={positionLimit}
            onChange={(e) => setPositionLimit(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mt-4">
          <p>
            <strong>Risk Limit ($):</strong> ${calculateRiskLimit().toLocaleString()}
          </p>
          <p>
            <strong>Position Limit ($):</strong> ${calculatePositionLimit().toLocaleString()}
          </p>
        </div>
      </div>
    );
  };
  
  export default RiskSettings;
  