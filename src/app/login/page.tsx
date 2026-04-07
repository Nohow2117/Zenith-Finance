import { LoginForm } from "./login-form";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
      </div>
      <div className="relative w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mx-auto mb-4">
            <span className="text-bg-primary font-bold text-lg">A</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-text-secondary">Enter your PIN to access the dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
