import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { register } from "../api/auth";
import { registerSchema } from "../schemas/authSchema";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);

    const result = registerSchema.safeParse(formData);
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
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : null;
      setSubmitError(message ?? "Erro ao cadastrar. Tente novamente.");
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
          Sign up
        </h1>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Create your account to continue
        </p>

        <div className="mt-6 w-full">
          <div
            className={`flex items-center w-full bg-gray-100 dark:bg-white/5 ring-2 rounded-full overflow-hidden pl-6 gap-2 transition-all h-12 ${
              errors.username
                ? "ring-red-500/80 dark:ring-red-400/80"
                : "ring-gray-200 dark:ring-white/10 focus-within:ring-indigo-500/60"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-gray-500 dark:text-white/60 shrink-0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/60 border-none outline-none"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-xs mt-1 ml-2">{errors.username}</p>
          )}
        </div>

        <div className="mt-4 w-full">
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
              type="email"
              name="email"
              placeholder="Email"
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

        {submitError && (
          <p className="mt-4 text-red-500 text-sm">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Cadastrando..." : "Sign up"}
        </button>

        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 mb-11">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
