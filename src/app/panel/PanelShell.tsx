import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function PanelShell({
  orgName,
  crumb,
  children,
}: {
  orgName?: string;
  crumb?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <Link
              href="/panel"
              className="text-sm font-semibold text-zinc-900 hover:underline"
            >
              {orgName ?? "Panel"}
            </Link>
            {crumb && <p className="text-xs text-zinc-500">{crumb}</p>}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/panel/settings"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Alertas
            </Link>
            <Link
              href="/panel/onboarding"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Crear agente
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
