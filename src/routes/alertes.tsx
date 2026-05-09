import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Info, XCircle, Bell } from "lucide-react";
import { alerts } from "@/lib/mock-data";

export const Route = createFileRoute("/alertes")({
  component: AlertesPage,
});

const iconMap = { info: Info, warning: AlertTriangle, danger: XCircle, success: CheckCircle2 };
const toneMap = {
  info: "text-primary bg-primary/10",
  warning: "text-amber-600 bg-amber-500/10",
  danger: "text-red-600 bg-red-500/10",
  success: "text-emerald-600 bg-emerald-500/10",
};

function AlertesPage() {
  return (
    <>
      <PageHeader title="Alertes & Notifications" description="Centre de notifications et configuration des alertes" />
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Flux d'alertes</CardTitle>
            <CardDescription>Toutes les notifications récentes du système</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => {
              const Icon = iconMap[a.type];
              return (
                <div key={a.id} className="flex gap-3 rounded-lg border border-border p-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneMap[a.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{a.title}</p>
                      <span className="text-xs text-muted-foreground">{a.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.message}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" />Préférences</CardTitle>
            <CardDescription>Canaux de notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "wa", label: "WhatsApp", desc: "Notifications instantanées" },
              { id: "email", label: "Email", desc: "Récap quotidien" },
              { id: "sms", label: "SMS", desc: "Alertes critiques" },
              { id: "push", label: "Push navigateur", desc: "Temps réel" },
            ].map((c, i) => (
              <div key={c.id} className="flex items-start justify-between gap-3">
                <div>
                  <Label htmlFor={c.id} className="font-medium">{c.label}</Label>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
                <Switch id={c.id} defaultChecked={i < 3} />
              </div>
            ))}
            <div className="border-t border-border pt-3">
              <p className="text-sm font-medium mb-2">Règles d'alerte</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span>Retard &gt; 24h</span><Badge>Activé</Badge></div>
                <div className="flex items-center justify-between"><span>Facture impayée</span><Badge>Activé</Badge></div>
                <div className="flex items-center justify-between"><span>Arrivée au port</span><Badge>Activé</Badge></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
