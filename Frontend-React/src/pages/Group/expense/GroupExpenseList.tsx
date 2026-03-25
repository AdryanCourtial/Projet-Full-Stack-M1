import type { GroupExpense } from "../../../interfaces/dto/group-expenses";
import { formatAmount } from "./groupExpense.utils";

interface Props {
  expenses: GroupExpense[];
  isLoading: boolean;
}

function GroupExpenseList({ expenses, isLoading }: Props) {
  return (
    <section className="group-expense-section">
      <h3>Depenses du groupe</h3>

      {isLoading ? (
        <p className="group-manager-empty">Chargement des depenses...</p>
      ) : expenses.length === 0 ? (
        <p className="group-manager-empty">
          Aucune depense partagee pour l'instant.
        </p>
      ) : (
        <div className="group-expense-list">
          {expenses.map((expense) => (
            <article key={expense.id} className="group-expense-card">
              <div>
                <h4>{expense.description || "Depense"}</h4>
                <p>
                  Payee par{" "}
                  {expense.paidBy?.username ||
                    expense.paidBy?.email ||
                    `#${expense.paidByUserId}`}
                </p>
                <p>{new Date(expense.date).toLocaleString("fr-FR")}</p>
              </div>

              <div className="group-expense-card-right">
                <strong>{formatAmount(expense.amount)}</strong>
                <small>{expense.shares.length} part(s)</small>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default GroupExpenseList;
