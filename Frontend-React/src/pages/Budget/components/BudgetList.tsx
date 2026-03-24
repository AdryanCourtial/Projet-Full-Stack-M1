import MainInteractiveContainer from "../../../components/common/MainInteractiveContainer/MainInteractiveContainer";
import type { Budget as BudgetItem } from "../../../interfaces/dto/budgets";

interface Props {
  budgets: BudgetItem[];
  isLoading: boolean;
  selectedBudgetId: number | null;
  deletingBudgetId: number | null;
  onSelect: (budgetId: number) => void;
  onDelete: (budgetId: number) => void;
}

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    amount,
  );

function BudgetList({
  budgets,
  isLoading,
  selectedBudgetId,
  deletingBudgetId,
  onSelect,
  onDelete,
}: Props) {
  return (
    <MainInteractiveContainer>
      <h2>Mes budgets</h2>

      {isLoading ? (
        <p className="budget-empty">Chargement des budgets...</p>
      ) : budgets.length === 0 ? (
        <p className="budget-empty">
          Aucun budget pour le moment. Creez-en un pour commencer.
        </p>
      ) : (
        <div className="budget-list">
          {budgets.map((budget) => (
            <article key={budget.id} className="budget-card">
              <div>
                <h3>{budget.name}</h3>
                <p>
                  Debut:{" "}
                  {new Date(budget.startDate).toLocaleDateString("fr-FR")}
                  {budget.endDate
                    ? ` | Fin: ${new Date(budget.endDate).toLocaleDateString("fr-FR")}`
                    : " | Fin: Non definie"}
                </p>
                <p>
                  Groupe:{" "}
                  {budget.group
                    ? `${budget.group.name} (#${budget.group.id})`
                    : "Aucun"}
                </p>
              </div>

              <p className="budget-card-amount">
                {formatAmount(budget.amountPlanned)}
              </p>

              <div className="budget-card-actions">
                <button
                  type="button"
                  className={
                    selectedBudgetId === budget.id
                      ? "budget-manage-btn active"
                      : "budget-manage-btn"
                  }
                  onClick={() => onSelect(budget.id)}
                >
                  Gerer
                </button>

                <button
                  type="button"
                  className="budget-delete-btn"
                  onClick={() => onDelete(budget.id)}
                  disabled={deletingBudgetId === budget.id}
                >
                  {deletingBudgetId === budget.id
                    ? "Suppression..."
                    : "Supprimer"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </MainInteractiveContainer>
  );
}

export default BudgetList;
