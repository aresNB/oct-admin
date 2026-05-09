import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Truck, MapPin, Calendar, User, Pencil, Trash2 } from "lucide-react";
import { deliveries as initialDeliveries, clients, containers, type Delivery } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/livraisons")({
  component: LivraisonsPage,
});

const statusColor = (s: string) => {
  if (s === "Livrée") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300";
  if (s === "En cours") return "bg-primary/10 text-primary border-primary/20";
  if (s === "Programmée") return "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300";
  return "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300";
};

function LivraisonsPage() {
  const [items, setItems] = useState<Delivery[]>(initialDeliveries);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Delivery | null>(null);
  const [edit, setEdit] = useState<Delivery | null>(null);
  const [del, setDel] = useState<Delivery | null>(null);

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!edit) return;
    const fd = new FormData(e.currentTarget);
    const updated: Delivery = {
      ...edit,
      client: String(fd.get("client") || edit.client),
      address: String(fd.get("address") || edit.address),
      containerId: String(fd.get("containerId") || edit.containerId),
      driver: String(fd.get("driver") || edit.driver),
      date: String(fd.get("date") || edit.date),
      status: (fd.get("status") as Delivery["status"]) || edit.status,
    };
    setItems(items.map((d) => (d.id === edit.id ? updated : d)));
    setEdit(null);
    toast.success("Livraison mise à jour", { description: updated.id });
  };

  const handleDelete = () => {
    if (!del) return;
    setItems(items.filter((d) => d.id !== del.id));
    toast.success("Livraison supprimée", { description: del.id });
    setDel(null);
  };

  const cols = [
    { title: "À planifier", items: items.filter((d) => d.status === "À planifier") },
    { title: "Programmée", items: items.filter((d) => d.status === "Programmée") },
    { title: "En cours", items: items.filter((d) => d.status === "En cours") },
    { title: "Livrée", items: items.filter((d) => d.status === "Livrée") },
  ];

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const d: Delivery = {
      id: `LIV-${String(items.length + 232).padStart(4, "0")}`,
      client: String(fd.get("client") || ""),
      address: String(fd.get("address") || ""),
      containerId: String(fd.get("containerId") || ""),
      driver: String(fd.get("driver") || "—"),
      date: String(fd.get("date") || new Date().toISOString().slice(0, 10)),
      status: (fd.get("status") as Delivery["status"]) || "À planifier",
    };
    setItems([d, ...items]);
    setOpen(false);
    toast.success("Livraison créée", { description: d.id });
  };

  return (
    <>
      <PageHeader title="Livraisons" description="Gérez les demandes et tournées de livraison">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nouvelle livraison</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouvelle livraison</DialogTitle>
              <DialogDescription>Planifiez une livraison pour un conteneur.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="grid gap-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Client</Label>
                  <Select name="client" required>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Conteneur</Label>
                  <Select name="containerId" required>
                    <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                    <SelectContent>{containers.map((c) => <SelectItem key={c.id} value={c.id}>{c.id}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5"><Label>Adresse de livraison</Label><Input name="address" required /></div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Chauffeur</Label><Input name="driver" /></div>
                <div className="space-y-1.5"><Label>Date</Label><Input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Statut</Label>
                <Select name="status" defaultValue="À planifier">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="À planifier">À planifier</SelectItem>
                    <SelectItem value="Programmée">Programmée</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Livrée">Livrée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
        {cols.map((col) => (
          <Card key={col.title} className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{col.title}</span>
                <Badge variant="secondary">{col.items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {col.items.map((d) => (
                <Card key={d.id} className="cursor-pointer bg-card transition hover:shadow-md" onClick={() => setView(d)}>
                  <CardContent className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold">{d.id}</span>
                      <Badge variant="outline" className={statusColor(d.status)}>{d.status}</Badge>
                    </div>
                    <p className="text-sm font-medium">{d.client}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{d.address}</p>
                      <p className="flex items-center gap-1.5"><Truck className="h-3 w-3" />{d.containerId}</p>
                      <p className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{d.date}</p>
                      <p className="flex items-center gap-1.5"><User className="h-3 w-3" />{d.driver}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {col.items.length === 0 && (
                <p className="py-6 text-center text-xs text-muted-foreground">Aucune livraison</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="sm:max-w-md">
          {view && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono">{view.id}</DialogTitle>
                <DialogDescription>Détail de la livraison</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Client</span><span className="font-medium">{view.client}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Conteneur</span><span className="font-mono">{view.containerId}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Adresse</span><span className="font-medium text-right">{view.address}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Chauffeur</span><span>{view.driver}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Date</span><span>{view.date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Statut</span><Badge variant="outline" className={statusColor(view.status)}>{view.status}</Badge></div>
              </div>
              <DialogFooter className="flex-wrap gap-2">
                <Button variant="outline" onClick={() => { setEdit(view); setView(null); }}><Pencil className="mr-2 h-4 w-4" />Modifier</Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => { setDel(view); setView(null); }}><Trash2 className="mr-2 h-4 w-4" />Supprimer</Button>
                {view.status !== "Livrée" && (
                  <Button onClick={() => {
                    const next: Delivery["status"] = view.status === "À planifier" ? "Programmée" : view.status === "Programmée" ? "En cours" : "Livrée";
                    setItems(items.map((x) => x.id === view.id ? { ...x, status: next } : x));
                    setView({ ...view, status: next });
                    toast.success(`Statut mis à jour: ${next}`);
                  }}>
                    Avancer le statut
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
                <DialogDescription>Mettez à jour les informations de la livraison.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEdit} className="grid gap-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Client</Label>
                    <Select name="client" defaultValue={edit.client}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Conteneur</Label>
                    <Select name="containerId" defaultValue={edit.containerId}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{containers.map((c) => <SelectItem key={c.id} value={c.id}>{c.id}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5"><Label>Adresse</Label><Input name="address" defaultValue={edit.address} required /></div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Chauffeur</Label><Input name="driver" defaultValue={edit.driver} /></div>
                  <div className="space-y-1.5"><Label>Date</Label><Input name="date" type="date" defaultValue={edit.date} /></div>
                </div>
                <div className="space-y-1.5">
                  <Label>Statut</Label>
                  <Select name="status" defaultValue={edit.status}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="À planifier">À planifier</SelectItem>
                      <SelectItem value="Programmée">Programmée</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Livrée">Livrée</SelectItem>
                    </SelectContent>
                  </Select>
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
            <AlertDialogTitle>Supprimer la livraison ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement la livraison <strong>{del?.id}</strong>.
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
