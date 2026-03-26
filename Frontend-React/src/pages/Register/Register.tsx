import { useState } from "react";
import TextInput from "../../components/common/inputText/TextInput";
import "./Register.css";
import type { RegisterDto } from "../../interfaces/dto/auth";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterDto>({
    email: "",
    password: "",
    password_confirmation: "",
    firstName: "",
    lastName: "",
    username: "",
  });

  const sendForm = async () => {
    try {
      await register(form);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <div className="main-container">
        <div className="bg-white-primary global-container">
          <h1> Inscription </h1>

          <form action="" className="form-register">
            <TextInput
              id="firstname"
              label="Prénom"
              placeholder="Jean"
              value={form.firstName}
              onChange={(value) =>
                setForm({ ...form, firstName: value as string })
              }
              dark={false}
            />

            <TextInput
              id="lastname"
              label="Nom de famille"
              placeholder="Dupont"
              value={form.lastName}
              onChange={(value) =>
                setForm({ ...form, lastName: value as string })
              }
              dark={false}
            />

            <TextInput
              id="email"
              label="Email"
              placeholder="exemple@mail.com"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value as string })}
              dark={false}
            />

            <TextInput
              id="password"
              label="Mot de passe"
              password
              placeholder="••••••••"
              value={form.password}
              onChange={(value) =>
                setForm({ ...form, password: value as string })
              }
              dark={false}
            />

            <TextInput
              id="password_confirmation"
              label="Confirmation du mot de passe"
              password
              placeholder="••••••••"
              value={form.password_confirmation}
              onChange={(value) =>
                setForm({ ...form, password_confirmation: value as string })
              }
              dark={false}
            />
          </form>

          <Link to={"/login"}>Vous voulez vous connecter ?</Link>

          <button onClick={sendForm}> S'inscrire </button>
        </div>

        <div className="constainer side-container bg-glass-400"></div>
      </div>
    </main>
  );
}

export default Register;
