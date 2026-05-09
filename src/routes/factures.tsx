import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataPagination } from "@/components/DataPagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Eye, Search, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invoices as initialInvoices, clients, type Invoice } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/factures")({
  component: FacturesPage,
});

const PAGE_SIZE = 6;
const statusVariant = (s: string) => {
  if (s === "Payée") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300";
  if (s === "En attente") return "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300";
  return "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-300";
};

function FacturesPage() {
  const [items, setItems] = useState<Invoice[]>(initialInvoices);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Invoice | null>(null);
  const [edit, setEdit] = useState<Invoice | null>(null);
  const [del, setDel] = useState<Invoice | null>(null);

  const filtered = useMemo(
    () => items.filter((i) => !q || i.id.toLowerCase().includes(q.toLowerCase()) || i.client.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const total = items.reduce((s, i) => s + i.amount, 0);
  const paid = items.filter((i) => i.status === "Payée").reduce((s, i) => s + i.amount, 0);
  const pending = total - paid;

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const inv: Invoice = {
      id: `INV-2026-${String(items.length + 200).padStart(4, "0")}`,
      client: String(fd.get("client") || ""),
      containerId: String(fd.get("containerId") || ""),
      amount: Number(fd.get("amount") || 0),
      status: (fd.get("status") as Invoice["status"]) || "En attente",
      date: String(fd.get("date") || new Date().toISOString().slice(0, 10)),
    };
    setItems([inv, ...items]);
    setOpen(false);
    toast.success("Facture créée", { description: inv.id });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!edit) return;
    const fd = new FormData(e.currentTarget);
    const updated: Invoice = {
      ...edit,
      client: String(fd.get("client") || edit.client),
      containerId: String(fd.get("containerId") || edit.containerId),
      amount: Number(fd.get("amount") || edit.amount),
      status: (fd.get("status") as Invoice["status"]) || edit.status,
      date: String(fd.get("date") || edit.date),
    };
    setItems(items.map((i) => (i.id === edit.id ? updated : i)));
    setEdit(null);
    toast.success("Facture mise à jour", { description: updated.id });
  };

  const handleDelete = () => {
    if (!del) return;
    setItems(items.filter((i) => i.id !== del.id));
    toast.success("Facture supprimée", { description: del.id });
    setDel(null);
  };

  return (
    <>
      <PageHeader title="Factures" description="Gestion de la facturation client">
        <Button variant="outline" onClick={() => toast.info("Export en cours…")}><Download className="mr-2 h-4 w-4" />Export</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nouvelle facture</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouvelle facture</DialogTitle>
              <DialogDescription>Créez une facture pour un client.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="grid gap-4">
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select name="client" required>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger>
                  <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Conteneur</Label><Input name="containerId" placeholder="MSHU…" /></div>
                <div className="space-y-1.5"><Label>Date</Label><Input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Montant (FCFA)</Label><Input name="amount" type="number" required min="0" /></div>
                <div className="space-y-1.5">
                  <Label>Statut</Label>
                  <Select name="status" defaultValue="En attente">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Payée">Payée</SelectItem>
                      <SelectItem value="En retard">En retard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button type="submit">Créer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total facturé</p><p className="mt-1 text-2xl font-bold">{(total / 1_000_000).toFixed(2)} M FCFA</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Encaissé</p><p className="mt-1 text-2xl font-bold text-emerald-600">{(paid / 1_000_000).toFixed(2)} M FCFA</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">En attente</p><p className="mt-1 text-2xl font-bold text-amber-600">{(pending / 1_000_000).toFixed(2)} M FCFA</p></CardContent></Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Rechercher facture ou client…" className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Facture</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Conteneur</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-sm font-semibold">{i.id}</TableCell>
                    <TableCell>{i.client}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{i.containerId}</TableCell>
                    <TableCell className="text-sm">{i.date}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{i.amount.toLocaleString("fr-FR")} FCFA</TableCell>
                    <TableCell><Badge variant="outline" className={statusVariant(i.status)}>{i.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setView(i)} title="Voir"><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => setEdit(i)} title="Modifier"><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => setDel(i)} title="Supprimer" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">Aucune facture</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
            <DataPagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="sm:max-w-md">
          {view && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono">{view.id}</DialogTitle>
                <DialogDescription>Détail de la facture</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Client</span><span className="font-medium">{view.client}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Conteneur</span><span className="font-mono">{view.containerId}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Date</span><span>{view.date}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Statut</span><Badge variant="outline" className={statusVariant(view.status)}>{view.status}</Badge></div>
                <div className="flex justify-between pt-2 text-lg"><span>Total</span><span className="font-bold">{view.amount.toLocaleString("fr-FR")} FCFA</span></div>
              </div>
              <DialogFooter className="flex-wrap gap-2">
                <Button variant="outline" onClick={() => toast.info("Téléchargement du PDF…")}><Download className="mr-2 h-4 w-4" />PDF</Button>
                <Button variant="outline" onClick={() => { setEdit(view); setView(null); }}><Pencil className="mr-2 h-4 w-4" />Modifier</Button>
                {view.status !== "Payée" && (
                  <Button onClick={() => { setItems(items.map((x) => x.id === view.id ? { ...x, status: "Payée" } : x)); setView(null); toast.success("Facture marquée payée"); }}>
                    Marquer payée
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="sm:max-w-lg">
          {edit && (
            <>
              <DialogHeader>
                <DialogTitle>Modifier {edit.id}</DialogTitle>
                <DialogDescription>Mettez à jour les informations de la facture.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEdit} className="grid gap-4">
                <div className="space-y-1.5">
                  <Label>Client</Label>
                  <Select name="client" defaultValue={edit.client}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Conteneur</Label><Input name="containerId" defaultValue={edit.containerId} /></div>
                  <div className="space-y-1.5"><Label>Date</Label><Input name="date" type="date" defaultValue={edit.date} /></div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Montant (FCFA)</Label><Input name="amount" type="number" min="0" defaultValue={edit.amount} /></div>
                  <div className="space-y-1.5">
                    <Label>Statut</Label>
                    <Select name="status" defaultValue={edit.status}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Payée">Payée</SelectItem>
                        <SelectItem value="En retard">En retard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
            <AlertDialogTitle>Supprimer la facture ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement la facture <strong>{del?.id}</strong>. Cette opération est irréversible.
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
