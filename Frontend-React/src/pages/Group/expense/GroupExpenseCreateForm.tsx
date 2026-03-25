import { useMemo } from "react";
import SelecteurInput from "../../../components/common/inputSelecteur/SelecteurInput";
import TextInput from "../../../components/common/inputText/TextInput";
import type { UserListItem } from "../../../interfaces/dto/users";
import { getUserDisplayName } from "./groupExpense.utils";

export interface GroupExpenseFormState {
  amount: string;
  description: string;
  date: string;
  paidByUserId: string;
  participantIds: number[];
}

interface Props {
  members: UserListItem[];
  form: GroupExpenseFormState;
  isSubmitting: boolean;
  onFieldChange: (
    key: keyof GroupExpenseFormState,
    value: string | number[],
  ) => void;
  onToggleParticipant: (userId: number) => void;
  onSubmit: () => void;
}

function GroupExpenseCreateForm({
  members,
  form,
  isSubmitting,
  onFieldChange,
  onToggleParticipant,
  onSubmit,
}: Props) {
  const participantSet = useMemo(
    () => new Set(form.participantIds),
    [form.participantIds],
  );

  return (
    <section className="group-expense-section">
      <h3>Ajouter une depense partagee</h3>

      <div className="group-expense-form-grid">
        <TextInput
          id="group-expense-amount"
          label="Montant"
          placeholder="0"
          type="number"
          value={form.amount}
          onChange={(value) => onFieldChange("amount", value)}
          disabled={isSubmitting}
        />

        <TextInput
          id="group-expense-description"
          label="Description"
          placeholder="Exemple: Courses de la semaine"
          value={form.description}
          onChange={(value) => onFieldChange("description", value)}
          disabled={isSubmitting}
        />

        <TextInput
          id="group-expense-date"
          label="Date"
          placeholder=""
          type="datetime-local"
          value={form.date}
          onChange={(value) => onFieldChange("date", value)}
          disabled={isSubmitting}
        />

        <SelecteurInput
          id="group-expense-paidby"
          label="Payee par"
          value={form.paidByUserId}
          onChange={(value) => onFieldChange("paidByUserId", value)}
          disabled={isSubmitting}
        >
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {getUserDisplayName(member)}
            </option>
          ))}
        </SelecteurInput>
      </div>

      <div className="group-expense-participants">
        <p>Participants (repartition egale)</p>
        <div className="group-expense-chip-list">
          {members.map((member) => (
            <button
              key={member.id}
              type="button"
              className={
                participantSet.has(member.id)
                  ? "group-expense-chip active"
                  : "group-expense-chip"
              }
              onClick={() => onToggleParticipant(member.id)}
              disabled={isSubmitting}
            >
              {getUserDisplayName(member)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="group-expense-submit-btn"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Ajout..." : "Ajouter la depense"}
      </button>
    </section>
  );
}

export default GroupExpenseCreateForm;
