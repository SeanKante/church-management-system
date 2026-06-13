import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";

export function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div>
      <PageHeader title={title} description="This module is part of an upcoming phase." />
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Construction className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">{title} — coming in {phase}</h3>
          <p className="max-w-md text-sm text-slate-500">
            The foundation (auth, roles &amp; permissions, dashboard shell) is live. This module's
            screens and APIs will be delivered in {phase}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
