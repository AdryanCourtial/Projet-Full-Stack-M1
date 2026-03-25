import type { GroupSettlementItem } from "../../../interfaces/dto/group-expenses";
import { formatAmount } from "./groupExpense.utils";

interface Props {
  settlements: GroupSettlementItem[];
  isLoading: boolean;
}

function GroupSettlementPanel({ settlements, isLoading }: Props) {
  return (
    <section className="group-expense-section">
      <h3>Remboursements proposes</h3>

      {isLoading ? (
        <p className="group-manager-empty">Calcul des remboursements...</p>
      ) : settlements.length === 0 ? (
        <p className="group-manager-empty">Aucun remboursement necessaire.</p>
      ) : (
        <div className="group-settlement-list">
          {settlements.map((item, index) => (
            <article
              key={`${item.fromUserId}-${item.toUserId}-${index}`}
              className="group-settlement-card"
            >
              <p>
                <strong>{item.fromName}</strong> doit rembourser{" "}
                <strong>{item.toName}</strong>
              </p>
              <strong>{formatAmount(item.amount)}</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default GroupSettlementPanel;
