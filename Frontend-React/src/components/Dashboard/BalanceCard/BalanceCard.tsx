import "./BalanceCard.css";

interface BalanceCardProps {
  accountLabel: string;
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ accountLabel, balance }) => {
  return (
    <div className="balance-card">
      <p className="balance-label">{accountLabel}</p>
      <h1 className="balance-amount">{balance.toFixed(2)} €</h1>
    </div>
  );
};

export default BalanceCard;
