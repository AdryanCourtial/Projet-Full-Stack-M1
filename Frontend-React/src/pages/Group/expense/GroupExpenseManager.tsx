import { useCallback, useEffect, useMemo, useState } from "react";
import GroupsRequest from "../../../api/groups";
import type {
  GroupBalanceItem,
  GroupExpense,
  GroupSettlementItem,
} from "../../../interfaces/dto/group-expenses";
import type { Group } from "../../../interfaces/dto/groups";
import type { UserListItem } from "../../../interfaces/dto/users";
import GroupBalancePanel from "./GroupBalancePanel";
import GroupExpenseCreateForm, {
  type GroupExpenseFormState,
} from "./GroupExpenseCreateForm";
import GroupExpenseList from "./GroupExpenseList";
import GroupSettlementPanel from "./GroupSettlementPanel";

interface Props {
  group: Group;
  users: UserListItem[];
}

const getNowDateTimeLocal = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

function GroupExpenseManager({ group, users }: Props) {
  const [expenses, setExpenses] = useState<GroupExpense[]>([]);
  const [balances, setBalances] = useState<GroupBalanceItem[]>([]);
  const [settlements, setSettlements] = useState<GroupSettlementItem[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const memberUsers = useMemo(() => {
    const memberIds = new Set<number>([
      group.ownerId,
      ...(group.members?.map((m) => m.userId) ?? []),
    ]);

    const found = users.filter((user) => memberIds.has(user.id));
    const missingIds = [...memberIds].filter(
      (id) => !found.some((user) => user.id === id),
    );

    const placeholders: UserListItem[] = missingIds.map((id) => ({
      id,
      email: null,
      username: `Utilisateur ${id}`,
      firstName: null,
      lastName: null,
    }));

    return [...found, ...placeholders].sort((a, b) => a.id - b.id);
  }, [group.ownerId, group.members, users]);

  const [form, setForm] = useState<GroupExpenseFormState>({
    amount: "",
    description: "",
    date: getNowDateTimeLocal(),
    paidByUserId: "",
    participantIds: [],
  });

  useEffect(() => {
    if (memberUsers.length === 0) {
      return;
    }

    setForm((prev) => {
      const validParticipants = prev.participantIds.filter((id) =>
        memberUsers.some((user) => user.id === id),
      );

      return {
        ...prev,
        paidByUserId:
          prev.paidByUserId &&
          memberUsers.some((u) => String(u.id) === prev.paidByUserId)
            ? prev.paidByUserId
            : String(memberUsers[0].id),
        participantIds:
          validParticipants.length > 0
            ? validParticipants
            : memberUsers.map((user) => user.id),
      };
    });
  }, [memberUsers]);

  const loadData = useCallback(async () => {
    setIsLoadingData(true);

    try {
      const [expenseItems, balanceData, settlementData] = await Promise.all([
        GroupsRequest().listExpenses(group.id),
        GroupsRequest().getBalances(group.id),
        GroupsRequest().getSettlements(group.id),
      ]);

      setExpenses(expenseItems);
      setBalances(balanceData.balances ?? []);
      setSettlements(settlementData.settlements ?? []);
    } catch {
      setFeedback({
        type: "error",
        text: "Impossible de charger les donnees de repartition du groupe.",
      });
    } finally {
      setIsLoadingData(false);
    }
  }, [group.id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleFieldChange = (
    key: keyof GroupExpenseFormState,
    value: string | number[],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleParticipant = (userId: number) => {
    setForm((prev) => {
      const exists = prev.participantIds.includes(userId);
      return {
        ...prev,
        participantIds: exists
          ? prev.participantIds.filter((id) => id !== userId)
          : [...prev.participantIds, userId],
      };
    });
  };

  const handleSubmit = async () => {
    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setFeedback({
        type: "error",
        text: "Le montant doit etre superieur a 0.",
      });
      return;
    }

    if (!form.paidByUserId) {
      setFeedback({
        type: "error",
        text: "Selectionnez le membre qui a paye.",
      });
      return;
    }

    if (form.participantIds.length === 0) {
      setFeedback({
        type: "error",
        text: "Selectionnez au moins un participant.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await GroupsRequest().createExpense(group.id, {
        amount,
        description: form.description.trim() || undefined,
        date: form.date ? new Date(form.date).toISOString() : undefined,
        paidByUserId: Number(form.paidByUserId),
        participants: form.participantIds,
      });

      setForm((prev) => ({
        ...prev,
        amount: "",
        description: "",
        date: getNowDateTimeLocal(),
      }));

      await loadData();
      setFeedback({ type: "success", text: "Depense ajoutee avec succes." });
    } catch {
      setFeedback({
        type: "error",
        text: "Impossible d'ajouter la depense de groupe.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="group-expense-manager">
      <GroupExpenseCreateForm
        members={memberUsers}
        form={form}
        isSubmitting={isSubmitting}
        onFieldChange={handleFieldChange}
        onToggleParticipant={handleToggleParticipant}
        onSubmit={handleSubmit}
      />

      {feedback && (
        <p
          className={`group-feedback ${feedback.type}`}
          role="status"
          aria-live="polite"
        >
          {feedback.text}
        </p>
      )}

      <GroupExpenseList expenses={expenses} isLoading={isLoadingData} />
      <GroupBalancePanel balances={balances} isLoading={isLoadingData} />
      <GroupSettlementPanel
        settlements={settlements}
        isLoading={isLoadingData}
      />
    </div>
  );
}

export default GroupExpenseManager;
