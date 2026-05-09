import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, FileText, Truck, TrendingUp, ArrowUpRight, Ship, AlertTriangle, CheckCircle2, DollarSign, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { containers, alerts, statusColor, invoices } from "@/lib/mock-data";
import { toast } from "sonner";
import illusContainers from "@/assets/illus-containers.png";
import illusInvoices from "@/assets/illus-invoices.png";
import illusDelivery from "@/assets/illus-delivery.png";
import illusRevenue from "@/assets/illus-revenue.png";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const monthlyData = [
  { m: "Nov", v: 42 }, { m: "Déc", v: 58 }, { m: "Jan", v: 51 },
  { m: "Fév", v: 67 }, { m: "Mar", v: 73 }, { m: "Avr", v: 89 }, { m: "Mai", v: 95 },
];

const topDestinations = [
  { city: "Dakar, SN", pct: 58 },
  { city: "Abidjan, CI", pct: 18 },
  { city: "Bamako, ML", pct: 12 },
  { city: "Niamey, NE", pct: 8 },
  { city: "Autres", pct: 4 },
];

const origins = [
  { city: "Asie (CN, JP, KR)", pct: 47 },
  { city: "Europe (NL, DE, ES)", pct: 31 },
  { city: "Inde", pct: 14 },
  { city: "Amériques", pct: 8 },
];

function StatCard({ icon: Icon, label, value, trend, hint, illustration, tone = "primary" }: { icon: any; label: string; value: string; trend: string; hint: string; illustration: string; tone?: string }) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 cursor-pointer">
      <div className="absolute inset-y-0 right-0 w-36 flex items-center justify-end pr-2 opacity-40 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 pointer-events-none">
        <img src={illustration} alt="" loading="lazy" className="h-28 w-28 object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />
      <CardContent className="p-5 relative">
        <div className="flex items-center justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${tone}/10 text-${tone} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="gap-1 text-xs">
            <ArrowUpRight className="h-3 w-3" /> {trend}
          </Badge>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const inTransit = containers.filter((c) => c.status === "En transit").length;
  const pendingInvoices = invoices.filter((i) => i.status !== "Payée").length;
  const totalRevenue = invoices.filter((i) => i.status === "Payée").reduce((s, i) => s + i.amount, 0);
  const max = Math.max(...monthlyData.map((d) => d.v));

  return (
    <>
      <PageHeader title="Dashboard" description="Vue d'ensemble des opérations OTC en temps réel.">
        <Button variant="outline" onClick={() => toast.info("Export du rapport en cours…")}>
          <Download className="mr-2 h-4 w-4" /> Exporter
        </Button>
        <Button asChild>
          <Link to="/conteneurs">
            <Container className="mr-2 h-4 w-4" /> Nouveau conteneur
          </Link>
        </Button>
      </PageHeader>

      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Container} illustration={illusContainers} label="Conteneurs actifs" value={String(containers.length)} trend="+12%" hint={`${inTransit} en transit`} />
          <StatCard icon={FileText} illustration={illusInvoices} label="Factures en attente" value={String(pendingInvoices)} trend="+3" hint="À relancer cette semaine" />
          <StatCard icon={Truck} illustration={illusDelivery} label="Livraisons à venir" value="14" trend="+5" hint="7 jours à venir" />
          <StatCard icon={TrendingUp} illustration={illusRevenue} label="CA encaissé (mois)" value={`${(totalRevenue / 1_000_000).toFixed(1)} M FCFA`} trend="+18%" hint="Vs mois précédent" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Container, label: "Conteneurs (an)", value: "847", tone: "text-primary" },
            { icon: DollarSign, label: "CA annuel", value: "412 M FCFA", tone: "text-emerald-600" },
            { icon: TrendingUp, label: "Taux livraison", value: "96.4%", tone: "text-amber-600" },
          ].map((k) => (
            <Card key={k.label} className="group transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:bg-primary/5 cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <k.icon className={`h-8 w-8 ${k.tone} transition-transform duration-300 group-hover:scale-110`} />
                  <div>
                    <p className="text-sm text-muted-foreground">{k.label}</p>
                    <p className="text-2xl font-bold">{k.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Volume mensuel de conteneurs</CardTitle>
            <CardDescription>Évolution sur les 7 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const W = 720, H = 240, P = 32;
              const xs = monthlyData.map((_, i) => P + (i * (W - 2 * P)) / (monthlyData.length - 1));
              const ys = monthlyData.map((d) => H - P - ((d.v / max) * (H - 2 * P)));
              const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
              const areaPath = `${linePath} L${xs[xs.length - 1]},${H - P} L${xs[0]},${H - P} Z`;
              return (
                <div className="w-full overflow-x-auto">
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-64">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.55 0.24 265)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="oklch(0.55 0.24 265)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                      <line key={t} x1={P} x2={W - P} y1={P + t * (H - 2 * P)} y2={P + t * (H - 2 * P)} stroke="currentColor" className="text-border" strokeDasharray="3 4" />
                    ))}
                    <path d={areaPath} fill="url(#areaGrad)" />
                    <path d={linePath} fill="none" stroke="oklch(0.55 0.24 265)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                    {xs.map((x, i) => (
                      <g key={i} className="group">
                        <circle cx={x} cy={ys[i]} r="4" fill="white" stroke="oklch(0.55 0.24 265)" strokeWidth="2" />
                        <circle cx={x} cy={ys[i]} r="10" fill="transparent" />
                        <text x={x} y={ys[i] - 12} textAnchor="middle" className="fill-foreground text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{monthlyData[i].v}</text>
                        <text x={x} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[11px]">{monthlyData[i].m}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Conteneurs en cours</CardTitle>
                <CardDescription>Suivi des dernières expéditions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/conteneurs">Voir tout</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {containers.slice(0, 5).map((c) => (
                <div key={c.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Ship className="h-4 w-4 text-primary" />
                        <span className="font-mono text-sm font-semibold">{c.id}</span>
                        <Badge variant="outline" className={statusColor(c.status)}>{c.status}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {c.client} · {c.origin} → {c.destination}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">ETA {c.eta}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={c.progress} className="h-2 flex-1" />
                    <span className="text-xs font-medium tabular-nums">{c.progress}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Alertes</CardTitle>
                <CardDescription>Notifications récentes</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/alertes">Tout voir</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.slice(0, 5).map((a) => {
                const Icon = a.type === "success" ? CheckCircle2 : AlertTriangle;
                const tone =
                  a.type === "danger" ? "text-red-600" :
                  a.type === "warning" ? "text-amber-600" :
                  a.type === "success" ? "text-emerald-600" : "text-primary";
                return (
                  <div key={a.id} className="flex gap-3 rounded-lg border border-border p-3">
                    <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${tone}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.message}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Top destinations</CardTitle><CardDescription>Répartition des livraisons</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {topDestinations.map((r) => (
                <div key={r.city}>
                  <div className="flex justify-between text-sm mb-1"><span>{r.city}</span><span className="font-medium">{r.pct}%</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Origine des cargaisons</CardTitle><CardDescription>Provenance par région</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {origins.map((r) => (
                <div key={r.city}>
                  <div className="flex justify-between text-sm mb-1"><span>{r.city}</span><span className="font-medium">{r.pct}%</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
