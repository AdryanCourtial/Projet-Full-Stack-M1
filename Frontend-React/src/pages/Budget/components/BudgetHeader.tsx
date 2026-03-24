import MainInteractiveContainer from "../../../components/common/MainInteractiveContainer/MainInteractiveContainer";

function BudgetHeader() {
  return (
    <MainInteractiveContainer>
      <div className="budget-header">
        <h1>Budgets</h1>
        <p>Creez un budget personnel ou rattache a un groupe.</p>
      </div>
    </MainInteractiveContainer>
  );
}

export default BudgetHeader;
