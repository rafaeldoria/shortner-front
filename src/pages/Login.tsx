import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { setToken } from "../api/api";
import { login as loginApi, testConnection } from "../api/auth";
import { loginSchema, type LoginFormData } from "../schemas/authSchema";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [loginStatus, setLoginStatus] = useState<"success" | "error" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setConnectionStatus(null);
    try {
      const { data } = await testConnection();
      setConnectionStatus(data ?? "OK");
    } catch {
      setConnectionStatus("Erro na conexão");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoginStatus(null);

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FieldErrors;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await loginApi({
        login: formData.email,
        password: formData.password,
      });
      if (data.token) {
        setToken(data.token);
        navigate("/home", { replace: true });
        return;
      }
      setLoginStatus("success");
    } catch {
      setLoginStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[350px] sm:w-[350px] text-center bg-white/90 dark:bg-white/6 border border-gray-200 dark:border-white/10 rounded-2xl px-8 backdrop-blur-sm shadow-lg dark:shadow-none"
      >
        <h1 className="text-gray-900 dark:text-white text-3xl mt-10 font-medium">
          Login
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Please sign in to continue
        </p>

        <button
          type="button"
          onClick={handleTestConnection}
          className="mt-4 text-sm text-indigo-400 hover:underline"
        >
          Testar conexão
        </button>
        {connectionStatus && (
          <p
            className={`text-xs mt-1 ${connectionStatus === "Erro na conexão" ? "text-red-500" : "text-green-600 dark:text-green-400"}`}
          >
            {connectionStatus}
          </p>
        )}

        <div className="mt-6 w-full">
          <div
            className={`flex items-center w-full bg-gray-100 dark:bg-white/5 ring-2 rounded-full overflow-hidden pl-6 gap-2 transition-all h-12 ${
              errors.email
                ? "ring-red-500/80 dark:ring-red-400/80"
                : "ring-gray-200 dark:ring-white/10 focus-within:ring-indigo-500/60"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-gray-500 dark:text-white/75 shrink-0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            <input
              type="text"
              name="email"
              placeholder="Email/Username"
              className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/60 border-none outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>
          )}
        </div>

        <div className="mt-4 w-full">
          <div
            className={`flex items-center w-full bg-gray-100 dark:bg-white/5 ring-2 rounded-full overflow-hidden pl-6 gap-2 transition-all h-12 ${
              errors.password
                ? "ring-red-500/80 dark:ring-red-400/80"
                : "ring-gray-200 dark:ring-white/10 focus-within:ring-indigo-500/60"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-gray-500 dark:text-white/75 shrink-0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/60 border-none outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>
          )}
        </div>

        <div className="mt-4 text-left">
          <button
            type="button"
            className="text-sm text-indigo-400 hover:underline"
          >
            Forget password?
          </button>
        </div>

        {loginStatus && (
          <p
            className={`mt-4 text-sm font-medium ${loginStatus === "success" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}
          >
            {loginStatus === "success" ? "Successfully login" : "Error login"}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Login"}
        </button>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 mb-11">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
