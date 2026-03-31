import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function RegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900">Create account</h1>
        <p className="mt-2 text-sm text-ink-700">
          Sprint 0 placeholder for student registration.
        </p>
      </div>

      <form className="space-y-4">
        <Input disabled placeholder="Full name" />
        <Input disabled placeholder="Email address" type="email" />
        <Input disabled placeholder="Password" type="password" />
        <ErrorMessage message="Registration will be connected in Sprint 1." />
        <Button className="w-full" disabled type="submit">
          Register
        </Button>
      </form>
    </div>
  );
}
