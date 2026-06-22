import { AppIcon } from "@/components/brand/LogoMark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <AppIcon size={64} />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary">Wortwende</h1>
          <p className="text-muted-foreground mt-2">Deutsch spielerisch lernen</p>
        </div>
        {children}
      </div>
    </div>
  );
}
