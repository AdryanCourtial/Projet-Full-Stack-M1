import { useAuth } from "../../hooks/useAuth";
import { useDashboard } from "../../hooks/useDashboard";
import BalanceCard from "../../components/Dashboard/BalanceCard/BalanceCard";
import SummaryStats from "../../components/Dashboard/SummaryStats/SummaryStats";
import DailySummary from "../../components/Dashboard/DailySummary/DailySummary";
import DashboardLoader from "../../components/Dashboard/DashboardLoader/DashboardLoader";
import MainInteractiveContainer from "../../components/common/MainInteractiveContainer/MainInteractiveContainer";
import "./Home.css";

function Home() {
  const { auth } = useAuth();
  const { data: dashboard, loading, error } = useDashboard();

  const accountLabel = auth
    ? `Compte de ${[auth.firstName, auth.lastName].filter(Boolean).join(" ") || auth.username || auth.email || `Utilisateur #${auth.id}`}`
    : "Compte";

  const currentMonthBalance = dashboard?.totals.net ?? 0;

  return (
    <main className="home-page">
      <BalanceCard accountLabel={accountLabel} balance={currentMonthBalance} />

      {loading && <DashboardLoader />}

      {error && (
        <MainInteractiveContainer>
          <div className="error-message">
            <span>Erreur: {error}</span>
          </div>
        </MainInteractiveContainer>
      )}

      {dashboard && !loading && (
        <>
          <SummaryStats
            income={dashboard.totals.income}
            expense={dashboard.totals.expense}
            net={dashboard.totals.net}
          />

          <MainInteractiveContainer>
            <DailySummary
              avgDailyExpense={dashboard.avgDailyExpense}
              totalDays={dashboard.dailySeries.length}
              totalExpense={dashboard.totals.expense}
            />
          </MainInteractiveContainer>
        </>
      )}
    </main>
  );
}

export default Home;
