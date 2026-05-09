import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ship, MapPin, Navigation } from "lucide-react";
import { containers, statusColor } from "@/lib/mock-data";

export const Route = createFileRoute("/carte")({
  component: CartePage,
});

function CartePage() {
  return (
    <>
      <PageHeader title="Carte temps réel" description="Position en direct des conteneurs en mer et au port" />
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-[600px] w-full overflow-hidden rounded-md bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
              {/* Decorative ocean grid */}
              <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Continents abstract shapes */}
              <div className="absolute left-[15%] top-[20%] h-40 w-56 rounded-[40%] bg-emerald-900/40 blur-sm" />
              <div className="absolute right-[20%] top-[35%] h-48 w-40 rounded-[45%] bg-emerald-900/40 blur-sm" />
              <div className="absolute left-[25%] bottom-[15%] h-32 w-48 rounded-[40%] bg-emerald-900/40 blur-sm" />

              {/* Routes */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M 20 30 Q 50 20 80 50" stroke="oklch(0.65 0.22 265)" strokeWidth="0.4" fill="none" strokeDasharray="1 1" />
                <path d="M 25 70 Q 55 60 75 35" stroke="oklch(0.65 0.22 265)" strokeWidth="0.4" fill="none" strokeDasharray="1 1" />
                <path d="M 15 50 Q 45 45 70 60" stroke="oklch(0.65 0.22 265)" strokeWidth="0.4" fill="none" strokeDasharray="1 1" />
              </svg>

              {/* Container pins */}
              {[
                { top: "28%", left: "30%", id: "MSHU1038236" },
                { top: "42%", left: "55%", id: "MSCU7720981" },
                { top: "60%", left: "40%", id: "TCLU4456102" },
                { top: "35%", left: "72%", id: "OOLU3344987" },
                { top: "55%", left: "22%", id: "BMOU8812340" },
              ].map((p) => (
                <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.top, left: p.left }}>
                  <div className="absolute -inset-3 animate-ping rounded-full bg-primary/40" />
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-white/40">
                    <Ship className="h-3.5 w-3.5" />
                  </div>
                  <div className="mt-1 whitespace-nowrap rounded bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white">
                    {p.id}
                  </div>
                </div>
              ))}

              <div className="absolute bottom-4 left-4 rounded-md bg-black/60 px-3 py-2 text-xs text-white backdrop-blur">
                <Navigation className="mr-1 inline h-3 w-3" />
                Vue océan Atlantique · Mise à jour il y a 2 min
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conteneurs sur la carte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {containers.slice(0, 6).map((c) => (
              <div key={c.id} className="rounded-md border border-border p-3 transition hover:border-primary">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs font-semibold">{c.id}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.origin} → {c.destination}</p>
                <Badge variant="outline" className={`mt-2 ${statusColor(c.status)}`}>{c.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
