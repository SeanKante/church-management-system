import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/layout/PageHeader";

interface MemberRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  joinedAt: string;
  tags: string[];
  groups: string[];
}

export function Members() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["members", search],
    queryFn: async () =>
      (await api.get<MemberRow[]>("/members", { params: search ? { search } : {} })).data,
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <PageHeader
        title="People"
        description="Your church member directory."
        action={
          <Button>
            <UserPlus className="h-4 w-4" /> Add Member
          </Button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by name or email"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Groups</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Loading members…
                  </td>
                </tr>
              ) : data && data.length > 0 ? (
                data.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                          {m.firstName[0]}
                          {m.lastName[0]}
                        </div>
                        <span className="font-medium text-slate-800">
                          {m.firstName} {m.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <div>{m.email ?? "—"}</div>
                      <div className="text-xs text-slate-400">{m.phone ?? ""}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {m.groups.length > 0 ? (
                          m.groups.map((g) => (
                            <Badge key={g} tone="slate">
                              {g}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={m.isActive ? "green" : "red"}>
                        {m.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(m.joinedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
