import MainInteractiveContainer from "../../components/common/MainInteractiveContainer/MainInteractiveContainer";
import { useAuth } from "../../hooks/useAuth";
import "./Home.css";

function Home() {
  const { auth } = useAuth();

  const accountLabel = auth
    ? `Compte de ${[auth.firstName, auth.lastName].filter(Boolean).join(" ") || auth.username || auth.email || `Utilisateur #${auth.id}`}`
    : "Compte";

  return (
    <main className="home-page">
      <div className="container-solde-wallet">
        <p className="title">{accountLabel}</p>
        <h1> 1655,84 € </h1>
        <p> Solde à venir : 1566,65 €</p>
      </div>

      <MainInteractiveContainer>
        <div className="comming-mouvement">
          <div className="flex-row justify-between align-center">
            <h3>mouvement à venir</h3>
            <p>(-125,00 €)</p>
          </div>
        </div>
      </MainInteractiveContainer>

      <MainInteractiveContainer>
        <div className="text-green-primary test"> Hello HOME!</div>
      </MainInteractiveContainer>
    </main>
  );
}

export default Home;
