import { useEffect, useState, type FormEvent } from "react";
import BudgetsRequest from "../../../api/budgets";
import MainInteractiveContainer from "../../../components/common/MainInteractiveContainer/MainInteractiveContainer";
import TextInput from "../../../components/common/inputText/TextInput";
import type {
  Budget,
  BudgetDetail,
  BudgetSummaryResponse,
  UpdateBudgetDto,
} from "../../../interfaces/dto/budgets";

interface Props {
  budgetId: number | null;
  onBudgetUpdated: (budget: Budget) => void;
}

type EditForm = {
  name: string;
  amountPlanned: string;
  startDate: string;
  endDate: string;
};

const toDateTimeInput = (isoDate: string | null | undefined) => {
  if (!isoDate) return "";
  return isoDate.slice(0, 16);
};

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    amount,
  );

function BudgetManager({ budgetId, onBudgetUpdated }: Props) {
  const [budgetDetail, setBudgetDetail] = useState<BudgetDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<BudgetSummaryResponse | null>(null);
  const [summaryFrom, setSummaryFrom] = useState("");
  const [summaryTo, setSummaryTo] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [form, setForm] = useState<EditForm>({
    name: "",
    amountPlanned: "",
    startDate: "",
    endDate: "",
  });

  const loadManagerData = async (id: number) => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const [detail, summaryData] = await Promise.all([
        BudgetsRequest().getById(id),
        BudgetsRequest().summary(id),
      ]);

      setBudgetDetail(detail);
      setSummary(summaryData);
      setForm({
        name: detail.name,
        amountPlanned: String(detail.amountPlanned),
        startDate: toDateTimeInput(detail.startDate),
        endDate: toDateTimeInput(detail.endDate),
      });
    } catch {
      setFeedback({
        type: "error",
        text: "Impossible de charger les details du budget.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (budgetId === null) {
      setBudgetDetail(null);
      setSummary(null);
      return;
    }

    void loadManagerData(budgetId);
  }, [budgetId]);

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!budgetId) return;

    const trimmedName = form.name.trim();
    const amountNumber = Number(form.amountPlanned);

    if (
      !trimmedName ||
      !Number.isFinite(amountNumber) ||
      amountNumber <= 0 ||
      !form.startDate
    ) {
      setFeedback({
        type: "error",
        text: "Verifier les champs de mise a jour.",
      });
      return;
    }

    const payload: UpdateBudgetDto = {
      name: trimmedName,
      amountPlanned: amountNumber,
      startDate: new Date(form.startDate).toISOString(),
      ...(form.endDate
        ? { endDate: new Date(form.endDate).toISOString() }
        : {}),
    };

    setIsSaving(true);
    setFeedback(null);

    try {
      const updated = await BudgetsRequest().update(budgetId, payload);
      onBudgetUpdated(updated);
      await loadManagerData(budgetId);
      setFeedback({ type: "success", text: "Budget mis a jour." });
    } catch {
      setFeedback({
        type: "error",
        text: "Impossible de mettre a jour le budget.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSummaryRefresh = async () => {
    if (!budgetId) return;

    setSummaryLoading(true);
    setFeedback(null);

    try {
      const summaryData = await BudgetsRequest().summary(budgetId, {
        ...(summaryFrom ? { from: new Date(summaryFrom).toISOString() } : {}),
        ...(summaryTo ? { to: new Date(summaryTo).toISOString() } : {}),
      });
      setSummary(summaryData);
    } catch {
      setFeedback({
        type: "error",
        text: "Impossible de recuperer le summary.",
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  if (budgetId === null) {
    return (
      <MainInteractiveContainer>
        <h2>Gestion du budget</h2>
        <p className="budget-empty">Selectionnez un budget pour le gerer.</p>
      </MainInteractiveContainer>
    );
  }

  return (
    <MainInteractiveContainer>
      <div className="budget-manager-header">
        <h2>Gestion du budget #{budgetId}</h2>
        {budgetDetail && <p>{budgetDetail.name}</p>}
      </div>

      {isLoading ? (
        <p className="budget-empty">Chargement des details...</p>
      ) : (
        <>
          <form className="budget-manager-form" onSubmit={handleUpdate}>
            <TextInput
              id="budget-edit-name"
              label="Nom"
              placeholder="Nom du budget"
              value={form.name}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, name: value }))
              }
              disabled={isSaving}
            />
            <TextInput
              id="budget-edit-amount"
              label="Montant"
              placeholder="0"
              type="number"
              value={form.amountPlanned}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, amountPlanned: value }))
              }
              disabled={isSaving}
            />
            <TextInput
              id="budget-edit-start"
              label="Date debut"
              placeholder=""
              type="datetime-local"
              value={form.startDate}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, startDate: value }))
              }
              disabled={isSaving}
            />
            <TextInput
              id="budget-edit-end"
              label="Date fin"
              placeholder=""
              type="datetime-local"
              value={form.endDate}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, endDate: value }))
              }
              disabled={isSaving}
            />
            <button
              className="budget-create-btn"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Mise a jour..." : "Mettre a jour"}
            </button>
          </form>

          <div className="budget-manager-block">
            <h3>Summary</h3>

            <div className="budget-summary-filter">
              <TextInput
                id="summary-from"
                label="From"
                placeholder=""
                type="datetime-local"
                value={summaryFrom}
                onChange={setSummaryFrom}
                disabled={summaryLoading}
              />
              <TextInput
                id="summary-to"
                label="To"
                placeholder=""
                type="datetime-local"
                value={summaryTo}
                onChange={setSummaryTo}
                disabled={summaryLoading}
              />
              <button
                type="button"
                className="budget-create-btn"
                onClick={handleSummaryRefresh}
                disabled={summaryLoading}
              >
                {summaryLoading ? "Chargement..." : "Rafraichir"}
              </button>
            </div>

            {summary ? (
              <div className="budget-summary-grid">
                <p>Planned: {formatAmount(summary.totals.planned)}</p>
                <p>Income: {formatAmount(summary.totals.income)}</p>
                <p>Spent: {formatAmount(summary.totals.spent)}</p>
                <p>Remaining: {formatAmount(summary.totals.remaining)}</p>
                <p>Net: {formatAmount(summary.totals.net)}</p>
              </div>
            ) : (
              <p className="budget-empty">Aucun resume disponible.</p>
            )}
          </div>

          {feedback && (
            <p className={`budget-feedback ${feedback.type}`}>
              {feedback.text}
            </p>
          )}
        </>
      )}
    </MainInteractiveContainer>
  );
}

export default BudgetManager;
