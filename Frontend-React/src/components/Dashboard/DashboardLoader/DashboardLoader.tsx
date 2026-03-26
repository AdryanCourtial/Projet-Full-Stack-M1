import "./DashboardLoader.css";

const DashboardLoader: React.FC = () => {
  return (
    <div className="dashboard-loader">
      <div className="spinner"></div>
      <p>Chargement du tableau de bord...</p>
    </div>
  );
};

export default DashboardLoader;
