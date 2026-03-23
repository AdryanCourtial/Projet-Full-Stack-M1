import TextInput from "../../components/common/inputText/TextInput";
import "./Login.css";
import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const confirmForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(form);
  };

  return (
    <main>
      <div className="main-container">
        <div className="bg-white-primary global-container">
          <h1> Login </h1>

          <form
            id="login-form"
            className="form-register"
            onSubmit={confirmForm}
          >
            <TextInput
              id="email"
              label="Email"
              placeholder="Entrer une adresse email"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value as string })}
            />

            <TextInput
              id="password"
              label="Mot de passe"
              placeholder="Entrer un mot de passe"
              value={form.password}
              password
              onChange={(value) =>
                setForm({ ...form, password: value as string })
              }
            />

            <button className="display-none" type="submit"></button>
          </form>

          <button type="submit" form="login-form">
            {" "}
            Login{" "}
          </button>
        </div>

        <div className="constainer side-container bg-glass-400"></div>
      </div>
    </main>
  );
}

export default Login;
