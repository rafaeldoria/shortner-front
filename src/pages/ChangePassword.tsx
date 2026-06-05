import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { getApiError, hasSession } from "../api/api";
import { changePassword } from "../api/auth";
import {
  REUSED_PASSWORD_MESSAGE,
  changePasswordSchema,
  type ChangePasswordFormData,
} from "../schemas/authSchema";

type FieldErrors = Partial<Record<keyof ChangePasswordFormData, string>>;

interface PasswordFieldProps {
  name: keyof ChangePasswordFormData;
  label: string;
  value: string;
  error?: string;
  autoFocus?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function PasswordField({
  name,
  label,
  value,
  error,
  autoFocus = false,
  onChange,
}: PasswordFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium tracking-tight text-gray-600 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="password"
        value={value}
        onChange={onChange}
        className={`w-full h-12 px-4 rounded-full bg-gray-100 dark:bg-white/5 border text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:focus:ring-indigo-400/60 transition-colors ${error ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
        required
        autoFocus={autoFocus}
      />
      {error && <p className="text-red-500 text-xs mt-1 ml-2">{error}</p>}
    </div>
  );
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasSession()) navigate("/", { replace: true });
  }, [navigate]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name as keyof ChangePasswordFormData;
    const { value } = e.target;
    const nextFormData = { ...formData, [name]: value };

    setFormData(nextFormData);
    setErrors((prev) => {
      const nextErrors = { ...prev, [name]: undefined };

      if (
        nextFormData.currentPassword &&
        nextFormData.newPassword &&
        nextFormData.newPassword === nextFormData.currentPassword
      ) {
        nextErrors.newPassword = REUSED_PASSWORD_MESSAGE;
      } else if (nextErrors.newPassword === REUSED_PASSWORD_MESSAGE) {
        nextErrors.newPassword = undefined;
      }

      return nextErrors;
    });
    setSubmitError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const result = changePasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ChangePasswordFormData;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      });
      navigate("/home", { replace: true, state: { passwordChanged: true } });
    } catch (err: unknown) {
      const { message } = getApiError(err);
      setSubmitError(message ?? "Error updating password. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout authenticated>
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="w-full rounded-2xl overflow-hidden shadow-lg border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Change password
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <PasswordField
              name="currentPassword"
              label="Current password"
              value={formData.currentPassword}
              error={errors.currentPassword}
              onChange={handleChange}
              autoFocus
            />
            <PasswordField
              name="newPassword"
              label="New password"
              value={formData.newPassword}
              error={errors.newPassword}
              onChange={handleChange}
            />
            <PasswordField
              name="confirmPassword"
              label="Confirm password"
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
            />
            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <Link
                to="/home"
                className="flex-1 h-11 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors font-medium flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
