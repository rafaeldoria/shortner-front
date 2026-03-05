import AppLayout from "./AppLayout";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AppLayout centered>{children}</AppLayout>;
}
