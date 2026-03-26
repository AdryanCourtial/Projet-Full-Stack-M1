import "./TopExpenses.css";

interface TopExpensesProps {
  categories: Array<{ categoryId: number; name: string; total: number }>;
}

const TopExpenses: React.FC<TopExpensesProps> = ({ categories }) => {
  if (categories.length === 0) {
    return <div className="top-expenses-empty">Aucune dépense ce mois</div>;
  }

  const maxAmount = Math.max(...categories.map((c) => c.total));

  return (
    <div className="top-expenses">
      <h3 className="top-expenses-title">Top 10 Catégories</h3>
      <div className="categories-list">
        {categories.map((category) => {
          const percentage = (category.total / maxAmount) * 100;

          return (
            <div key={category.categoryId} className="category-bar">
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-amount">
                  {category.total.toFixed(2)} €
                </span>
              </div>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopExpenses;
