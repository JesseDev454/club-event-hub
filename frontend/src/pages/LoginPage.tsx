import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-700">Sprint 0 placeholder for login.</p>
      </div>

      <form className="space-y-4">
        <Input disabled placeholder="Email address" type="email" />
        <Input disabled placeholder="Password" type="password" />
        <ErrorMessage message="Authentication will be connected in Sprint 1." />
        <Button className="w-full" disabled type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
