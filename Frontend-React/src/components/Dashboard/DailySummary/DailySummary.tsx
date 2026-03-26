import "./DailySummary.css";

interface DailySummaryProps {
  avgDailyExpense: number;
  totalDays: number;
  totalExpense: number;
}

const DailySummary: React.FC<DailySummaryProps> = ({
  avgDailyExpense,
  totalDays,
  totalExpense,
}) => {
  return (
    <div className="daily-summary">
      <h3 className="daily-summary-title">Statistiques Journalières</h3>
      <div className="daily-grid">
        <div className="daily-card">
          <div className="daily-icon">■</div>
          <div className="daily-info">
            <p className="daily-label">Dépense moyenne/jour</p>
            <p className="daily-value">{avgDailyExpense.toFixed(2)} €</p>
          </div>
        </div>

        <div className="daily-card">
          <div className="daily-icon">◉</div>
          <div className="daily-info">
            <p className="daily-label">Jours du mois</p>
            <p className="daily-value">{totalDays}</p>
          </div>
        </div>

        <div className="daily-card">
          <div className="daily-icon">◆</div>
          <div className="daily-info">
            <p className="daily-label">Total dépensé</p>
            <p className="daily-value">{totalExpense.toFixed(2)} €</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
