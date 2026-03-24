import { useEffect, useMemo, useState, type FormEvent } from "react";
import BudgetsRequest from "../../api/budgets";
import GroupsRequest from "../../api/groups";
import BudgetCreateForm from "./components/BudgetCreateForm";
import BudgetHeader from "./components/BudgetHeader";
import BudgetList from "./components/BudgetList";
import BudgetManager from "./components/BudgetManager";
import type {
  Budget as BudgetItem,
  CreateBudgetDto,
} from "../../interfaces/dto/budgets";
import type { Group } from "../../interfaces/dto/groups";
import type { BudgetFormState } from "./types";
import "./Budget.css";

const getNowDateTimeLocal = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

function Budget() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingBudgetId, setDeletingBudgetId] = useState<number | null>(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [form, setForm] = useState<BudgetFormState>({
    name: "",
    amountPlanned: "",
    startDate: getNowDateTimeLocal(),
    endDate: "",
    groupId: "",
  });

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const [budgetList, groupList] = await Promise.all([
        BudgetsRequest().list(),
        GroupsRequest().list(),
      ]);

      setBudgets(budgetList);
      setGroups(groupList);
    } catch {
      setFeedback({
        type: "error",
        text: "Impossible de charger les budgets.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPageData();
  }, []);

  const sortedBudgets = useMemo(
    () =>
      [...budgets].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      ),
    [budgets],
  );

  const handleChange = (key: keyof BudgetFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const amountNumber = Number(form.amountPlanned);

    if (!trimmedName) {
      setFeedback({ type: "error", text: "Le nom du budget est obligatoire." });
      return;
    }

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setFeedback({
        type: "error",
        text: "Le montant doit etre superieur a 0.",
      });
      return;
    }

    if (!form.startDate) {
      setFeedback({ type: "error", text: "La date de debut est obligatoire." });
      return;
    }

    const payload: CreateBudgetDto = {
      name: trimmedName,
      amountPlanned: amountNumber,
      startDate: new Date(form.startDate).toISOString(),
      ...(form.endDate
        ? { endDate: new Date(form.endDate).toISOString() }
        : {}),
      ...(form.groupId ? { groupId: Number(form.groupId) } : {}),
    };

    setIsSubmitting(true);

    try {
      const createdBudget = await BudgetsRequest().create(payload);
      setBudgets((prev) => [createdBudget, ...prev]);
      setForm((prev) => ({
        ...prev,
        name: "",
        amountPlanned: "",
        endDate: "",
      }));
      setFeedback({ type: "success", text: "Budget cree avec succes." });
    } catch {
      setFeedback({
        type: "error",
        text: "La creation du budget a echoue. Verifiez les champs puis reessayez.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectBudget = (budgetId: number) => {
    setSelectedBudgetId((prev) => (prev === budgetId ? null : budgetId));
  };

  const handleDeleteBudget = async (budgetId: number) => {
    setDeletingBudgetId(budgetId);

    try {
      await BudgetsRequest().remove(budgetId);
      setBudgets((prev) => prev.filter((budget) => budget.id !== budgetId));
      setSelectedBudgetId((prev) => (prev === budgetId ? null : prev));
      setFeedback({ type: "success", text: "Budget supprime avec succes." });
    } catch {
      setFeedback({
        type: "error",
        text: "Impossible de supprimer ce budget.",
      });
    } finally {
      setDeletingBudgetId(null);
    }
  };

  const handleBudgetUpdated = (updatedBudget: BudgetItem) => {
    setBudgets((prev) =>
      prev.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget,
      ),
    );
  };

  return (
    <main className="budget-page">
      <BudgetHeader />

      <BudgetCreateForm
        form={form}
        groups={groups}
        isSubmitting={isSubmitting}
        feedback={feedback}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <BudgetList
        budgets={sortedBudgets}
        isLoading={isLoading}
        selectedBudgetId={selectedBudgetId}
        deletingBudgetId={deletingBudgetId}
        onSelect={handleSelectBudget}
        onDelete={handleDeleteBudget}
      />

      <BudgetManager
        budgetId={selectedBudgetId}
        onBudgetUpdated={handleBudgetUpdated}
      />
    </main>
  );
}

export default Budget;
