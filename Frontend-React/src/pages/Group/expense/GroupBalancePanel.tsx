import type { GroupBalanceItem } from "../../../interfaces/dto/group-expenses";
import { formatAmount } from "./groupExpense.utils";

interface Props {
  balances: GroupBalanceItem[];
  isLoading: boolean;
}

function GroupBalancePanel({ balances, isLoading }: Props) {
  return (
    <section className="group-expense-section">
      <h3>Soldes du groupe</h3>

      {isLoading ? (
        <p className="group-manager-empty">Calcul des soldes...</p>
      ) : balances.length === 0 ? (
        <p className="group-manager-empty">Aucun solde disponible.</p>
      ) : (
        <div className="group-balance-list">
          {balances.map((item) => (
            <article key={item.userId} className="group-balance-card">
              <h4>{item.name}</h4>
              <p>Paye: {formatAmount(item.paid)}</p>
              <p>Doit: {formatAmount(item.owed)}</p>
              <p className={item.balance >= 0 ? "positive" : "negative"}>
                Solde: {formatAmount(item.balance)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default GroupBalancePanel;
