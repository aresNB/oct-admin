import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { messages } from "@/lib/mock-data";

export const Route = createFileRoute("/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const [selected, setSelected] = useState(messages[0]);

  return (
    <>
      <PageHeader title="Messages" description="Communications avec les clients" />
      <div className="grid gap-4 p-6 lg:grid-cols-[340px_1fr] h-[calc(100vh-9rem)]">
        <Card className="overflow-hidden">
          <CardContent className="p-0 divide-y divide-border max-h-full overflow-y-auto">
            {messages.map((m) => (
              <button key={m.id} onClick={() => setSelected(m)} className={`flex w-full gap-3 p-4 text-left transition hover:bg-muted ${selected.id === m.id ? "bg-muted" : ""}`}>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">{m.from.split(" ").map((w) => w[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${m.unread ? "font-bold" : "font-medium"}`}>{m.from}</p>
                    <span className="text-[10px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-xs font-medium truncate">{m.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.preview}</p>
                </div>
                {m.unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="flex flex-col overflow-hidden">
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar><AvatarFallback className="bg-primary/10 text-primary">{selected.from.split(" ").map((w) => w[0]).join("")}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold">{selected.from}</p>
                <p className="text-xs text-muted-foreground">{selected.subject}</p>
              </div>
              <Badge variant="secondary" className="ml-auto">Client</Badge>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{selected.from.split(" ").map((w) => w[0]).join("")}</AvatarFallback></Avatar>
              <div className="rounded-2xl rounded-tl-none bg-muted p-3 text-sm max-w-md">{selected.preview} Pourriez-vous me confirmer la procédure et le délai estimatif ? Merci d'avance pour votre retour.</div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="rounded-2xl rounded-tr-none bg-primary text-primary-foreground p-3 text-sm max-w-md">Bonjour, merci pour votre message. Je reviens vers vous dans la journée avec toutes les informations nécessaires.</div>
              <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary text-primary-foreground">MT</AvatarFallback></Avatar>
            </div>
          </div>
          <div className="border-t border-border p-3 flex items-center gap-2">
            <Input placeholder="Écrire un message…" className="flex-1" />
            <Button size="icon"><Send className="h-4 w-4" /></Button>
          </div>
        </Card>
      </div>
    </>
  );
}
