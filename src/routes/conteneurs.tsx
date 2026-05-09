import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataPagination } from "@/components/DataPagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Filter, Download, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { containers as initialContainers, statusColor, type ContainerItem, type ContainerStatus } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/conteneurs")({
  component: ConteneursPage,
});

const statuses: (ContainerStatus | "Tous")[] = ["Tous", "En transit", "Au port", "Dédouanement", "Livré", "Retardé"];
const editableStatuses = statuses.filter((s) => s !== "Tous") as ContainerStatus[];
const PAGE_SIZE = 6;

function ConteneursPage() {
  const [items, setItems] = useState<ContainerItem[]>(initialContainers);
  const [filter, setFilter] = useState<ContainerStatus | "Tous">("Tous");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [openAdd, setOpenAdd] = useState(false);
  const [detail, setDetail] = useState<ContainerItem | null>(null);
  const [edit, setEdit] = useState<ContainerItem | null>(null);
  const [del, setDel] = useState<ContainerItem | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((c) => {
        const ms = filter === "Tous" || c.status === filter;
        const mq = !q || c.id.toLowerCase().includes(q.toLowerCase()) || c.client.toLowerCase().includes(q.toLowerCase());
        return ms && mq;
      }),
    [items, filter, q]
  );

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item: ContainerItem = {
      id: String(fd.get("id") || `NEW${Date.now()}`).toUpperCase(),
      client: String(fd.get("client") || ""),
      origin: String(fd.get("origin") || ""),
      destination: String(fd.get("destination") || ""),
      vessel: String(fd.get("vessel") || "—"),
      weight: String(fd.get("weight") || "—"),
      eta: String(fd.get("eta") || "—"),
      status: (fd.get("status") as ContainerStatus) || "En transit",
      progress: 5,
    };
    setItems([item, ...items]);
    setOpenAdd(false);
    setPage(1);
    toast.success("Conteneur ajouté", { description: item.id });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!edit) return;
    const fd = new FormData(e.currentTarget);
    const updated: ContainerItem = {
      ...edit,
      client: String(fd.get("client") || edit.client),
      origin: String(fd.get("origin") || edit.origin),
      destination: String(fd.get("destination") || edit.destination),
      vessel: String(fd.get("vessel") || edit.vessel),
      weight: String(fd.get("weight") || edit.weight),
      eta: String(fd.get("eta") || edit.eta),
      status: (fd.get("status") as ContainerStatus) || edit.status,
      progress: Number(fd.get("progress") || edit.progress),
    };
    setItems(items.map((c) => (c.id === edit.id ? updated : c)));
    setEdit(null);
    toast.success("Conteneur mis à jour", { description: updated.id });
  };

  const handleDelete = () => {
    if (!del) return;
    setItems(items.filter((c) => c.id !== del.id));
    toast.success("Conteneur supprimé", { description: del.id });
    setDel(null);
  };

  return (
    <>
      <PageHeader title="Conteneurs" description={`${items.length} conteneurs gérés au total`}>
        <Button variant="outline" onClick={() => toast.info("Export en cours…")}>
          <Download className="mr-2 h-4 w-4" />Export
        </Button>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Ajouter</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouveau conteneur</DialogTitle>
              <DialogDescription>Renseignez les informations du conteneur à enregistrer.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="grid gap-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>N° Conteneur</Label><Input name="id" required placeholder="MSHU0000000" /></div>
                <div className="space-y-1.5"><Label>Client</Label><Input name="client" required /></div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Origine</Label><Input name="origin" required /></div>
                <div className="space-y-1.5"><Label>Destination</Label><Input name="destination" required /></div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Navire</Label><Input name="vessel" /></div>
                <div className="space-y-1.5"><Label>Poids</Label><Input name="weight" placeholder="20 t" /></div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>ETA</Label><Input name="eta" type="date" /></div>
                <div className="space-y-1.5">
                  <Label>Statut</Label>
                  <Select name="status" defaultValue="En transit">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {editableStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenAdd(false)}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Numéro de conteneur ou client…" className="pl-9" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {statuses.map((s) => (
                  <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => { setFilter(s); setPage(1); }}>
                    {s}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conteneur</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Navire</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm font-semibold">{c.id}</TableCell>
                    <TableCell>{c.client}</TableCell>
                    <TableCell className="text-muted-foreground">{c.origin} → {c.destination}</TableCell>
                    <TableCell className="text-muted-foreground">{c.vessel}</TableCell>
                    <TableCell>
                      <div className="flex min-w-32 items-center gap-2">
                        <Progress value={c.progress} className="h-1.5 flex-1" />
                        <span className="text-xs tabular-nums">{c.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className={statusColor(c.status)}>{c.status}</Badge></TableCell>
                    <TableCell className="text-sm">{c.eta}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setDetail(c)} title="Voir"><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => setEdit(c)} title="Modifier"><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => setDel(c)} title="Supprimer" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">Aucun résultat</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
            <DataPagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono">{detail.id}</DialogTitle>
                <DialogDescription>Détails du conteneur</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 text-sm">
                <Row k="Client" v={detail.client} />
                <Row k="Origine" v={detail.origin} />
                <Row k="Destination" v={detail.destination} />
                <Row k="Navire" v={detail.vessel} />
                <Row k="Poids" v={detail.weight} />
                <Row k="ETA" v={detail.eta} />
                <Row k="Statut" v={<Badge variant="outline" className={statusColor(detail.status)}>{detail.status}</Badge>} />
                <div>
                  <p className="mb-1 text-muted-foreground">Progression</p>
                  <Progress value={detail.progress} className="h-2" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setEdit(detail); setDetail(null); }}><Pencil className="mr-2 h-4 w-4" />Modifier</Button>
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
                <DialogDescription>Mettez à jour les informations du conteneur.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEdit} className="grid gap-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Client</Label><Input name="client" defaultValue={edit.client} required /></div>
                  <div className="space-y-1.5"><Label>Navire</Label><Input name="vessel" defaultValue={edit.vessel} /></div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Origine</Label><Input name="origin" defaultValue={edit.origin} /></div>
                  <div className="space-y-1.5"><Label>Destination</Label><Input name="destination" defaultValue={edit.destination} /></div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Poids</Label><Input name="weight" defaultValue={edit.weight} /></div>
                  <div className="space-y-1.5"><Label>ETA</Label><Input name="eta" defaultValue={edit.eta} /></div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Statut</Label>
                    <Select name="status" defaultValue={edit.status}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {editableStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Progression (%)</Label><Input name="progress" type="number" min="0" max="100" defaultValue={edit.progress} /></div>
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
            <AlertDialogTitle>Supprimer le conteneur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le conteneur <strong>{del?.id}</strong>. Cette opération est irréversible.
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

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
