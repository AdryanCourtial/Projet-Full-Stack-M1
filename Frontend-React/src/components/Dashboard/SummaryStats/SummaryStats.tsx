import "./SummaryStats.css";

interface SummaryStatsProps {
  income: number;
  expense: number;
  net: number;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({
  income,
  expense,
  net,
}) => {
  return (
    <div className="summary-stats">
      <div className="stat-card income">
        <div className="stat-icon">+</div>
        <div className="stat-content">
          <p className="stat-label">Revenus</p>
          <p className="stat-value">{income.toFixed(2)} €</p>
        </div>
      </div>

      <div className="stat-card expense">
        <div className="stat-icon">−</div>
        <div className="stat-content">
          <p className="stat-label">Dépenses</p>
          <p className="stat-value">{expense.toFixed(2)} €</p>
        </div>
      </div>

      <div className={`stat-card net ${net >= 0 ? "positive" : "negative"}`}>
        <div className="stat-icon">{net >= 0 ? "✓" : "⚠"}</div>
        <div className="stat-content">
          <p className="stat-label">Net</p>
          <p className="stat-value">{net.toFixed(2)} €</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
