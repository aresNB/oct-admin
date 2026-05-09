import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Mail, Phone, Container, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { clients as initialClients, type Client } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DataPagination } from "@/components/DataPagination";
import { toast } from "sonner";

export const Route = createFileRoute("/clients")({
  component: ClientsPage,
});

const PAGE_SIZE = 6;

function ClientsPage() {
  const [items, setItems] = useState<Client[]>(initialClients);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Client | null>(null);
  const [edit, setEdit] = useState<Client | null>(null);
  const [del, setDel] = useState<Client | null>(null);

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!edit) return;
    const fd = new FormData(e.currentTarget);
    const updated: Client = {
      ...edit,
      name: String(fd.get("name") || edit.name),
      contact: String(fd.get("contact") || edit.contact),
      email: String(fd.get("email") || edit.email),
      phone: String(fd.get("phone") || edit.phone),
    };
    setItems(items.map((c) => (c.id === edit.id ? updated : c)));
    setEdit(null);
    toast.success("Client mis à jour", { description: updated.name });
  };

  const handleDelete = () => {
    if (!del) return;
    setItems(items.filter((c) => c.id !== del.id));
    toast.success("Client supprimé", { description: del.name });
    setDel(null);
  };

  const filtered = useMemo(
    () => items.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.contact.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const c: Client = {
      id: `CLI-${String(items.length + 1).padStart(3, "0")}`,
      name: String(fd.get("name") || ""),
      contact: String(fd.get("contact") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      containers: 0,
      revenue: 0,
    };
    setItems([c, ...items]);
    setOpen(false);
    toast.success("Client ajouté", { description: c.name });
  };

  return (
    <>
      <PageHeader title="Clients" description={`${items.length} clients actifs`}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nouveau client</Button></DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau client</DialogTitle>
              <DialogDescription>Ajoutez un client à votre CRM.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="grid gap-4">
              <div className="space-y-1.5"><Label>Raison sociale</Label><Input name="name" required /></div>
              <div className="space-y-1.5"><Label>Contact principal</Label><Input name="contact" required /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input name="email" type="email" required /></div>
              <div className="space-y-1.5"><Label>Téléphone</Label><Input name="phone" required /></div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Rechercher un client…" className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paged.map((c) => (
            <Card key={c.id} className="transition hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.contact}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-sm">
                  <p className="flex items-center gap-2 truncate text-muted-foreground"><Mail className="h-3.5 w-3.5 shrink-0" />{c.email}</p>
                  <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5 shrink-0" />{c.phone}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                  <div>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><Container className="h-3 w-3" />Conteneurs</p>
                    <p className="text-lg font-bold">{c.containers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CA total</p>
                    <p className="text-lg font-bold">{(c.revenue / 1_000_000).toFixed(1)}M</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-1.5">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setView(c)}>
                    <Eye className="mr-1 h-3.5 w-3.5" />Voir
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setEdit(c)} title="Modifier"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 text-red-600 hover:text-red-700" onClick={() => setDel(c)} title="Supprimer"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            <DataPagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="sm:max-w-md">
          {view && (
            <>
              <DialogHeader>
                <DialogTitle>{view.name}</DialogTitle>
                <DialogDescription>{view.id} · {view.contact}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Email</span><span className="font-medium">{view.email}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Téléphone</span><span className="font-medium">{view.phone}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Conteneurs</span><span className="font-medium">{view.containers}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">CA total</span><span className="font-bold">{view.revenue.toLocaleString("fr-FR")} FCFA</span></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setEdit(view); setView(null); }}><Pencil className="mr-2 h-4 w-4" />Modifier</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="sm:max-w-md">
          {edit && (
            <>
              <DialogHeader>
                <DialogTitle>Modifier {edit.name}</DialogTitle>
                <DialogDescription>Mettez à jour les informations du client.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEdit} className="grid gap-4">
                <div className="space-y-1.5"><Label>Raison sociale</Label><Input name="name" defaultValue={edit.name} required /></div>
                <div className="space-y-1.5"><Label>Contact principal</Label><Input name="contact" defaultValue={edit.contact} required /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input name="email" type="email" defaultValue={edit.email} required /></div>
                <div className="space-y-1.5"><Label>Téléphone</Label><Input name="phone" defaultValue={edit.phone} required /></div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEdit(null)}>Annuler</Button>
                  <Button type="submit">Enregistrer</Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le client ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le client <strong>{del?.name}</strong>. Cette opération est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
