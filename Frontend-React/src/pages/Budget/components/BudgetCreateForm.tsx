import type { FormEvent } from "react";
import MainInteractiveContainer from "../../../components/common/MainInteractiveContainer/MainInteractiveContainer";
import SelecteurInput from "../../../components/common/inputSelecteur/SelecteurInput";
import TextInput from "../../../components/common/inputText/TextInput";
import type { Group } from "../../../interfaces/dto/groups";
import type { BudgetFormState } from "../types";

interface Props {
  form: BudgetFormState;
  groups: Group[];
  isSubmitting: boolean;
  feedback: { type: "success" | "error"; text: string } | null;
  onChange: (key: keyof BudgetFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function BudgetCreateForm({
  form,
  groups,
  isSubmitting,
  feedback,
  onChange,
  onSubmit,
}: Props) {
  return (
    <MainInteractiveContainer>
      <form className="budget-create-form" onSubmit={onSubmit}>
        <TextInput
          id="budget-name"
          label="Nom du budget"
          placeholder="Exemple: Budget Courses Avril"
          value={form.name}
          className="budget-input-wrap"
          onChange={(value) => onChange("name", value)}
          disabled={isSubmitting}
        />

        <TextInput
          id="budget-amount"
          label="Montant previsionnel"
          placeholder="0"
          type="number"
          value={form.amountPlanned}
          className="budget-input-wrap"
          onChange={(value) => onChange("amountPlanned", value)}
          disabled={isSubmitting}
        />

        <TextInput
          id="budget-start-date"
          label="Date de debut"
          placeholder=""
          type="datetime-local"
          value={form.startDate}
          className="budget-input-wrap"
          onChange={(value) => onChange("startDate", value)}
          disabled={isSubmitting}
        />

        <TextInput
          id="budget-end-date"
          label="Date de fin (optionnelle)"
          placeholder=""
          type="datetime-local"
          value={form.endDate}
          className="budget-input-wrap"
          onChange={(value) => onChange("endDate", value)}
          disabled={isSubmitting}
        />

        <SelecteurInput
          id="budget-group"
          label="Lier a un groupe (optionnel)"
          className="budget-input-wrap"
          value={form.groupId}
          onChange={(value) => onChange("groupId", value)}
          disabled={isSubmitting}
        >
          <option value="">Aucun groupe</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name} (#{group.id})
            </option>
          ))}
        </SelecteurInput>

        <div className="budget-submit-wrap">
          <button
            className="budget-create-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creation..." : "Creer le budget"}
          </button>
        </div>
      </form>

      {feedback && (
        <p
          className={`budget-feedback ${feedback.type}`}
          role="status"
          aria-live="polite"
        >
          {feedback.text}
        </p>
      )}
    </MainInteractiveContainer>
  );
}

export default BudgetCreateForm;
