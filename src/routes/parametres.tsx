import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/parametres")({
  component: ParametresPage,
});

function ParametresPage() {
  return (
    <>
      <PageHeader title="Paramètres" description="Configuration de votre espace OTC" />
      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="company">Entreprise</TabsTrigger>
            <TabsTrigger value="team">Équipe</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader><CardTitle>Profil utilisateur</CardTitle><CardDescription>Vos informations personnelles</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20"><AvatarFallback className="bg-primary text-primary-foreground text-xl">MT</AvatarFallback></Avatar>
                  <Button variant="outline">Changer la photo</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div><Label>Nom complet</Label><Input defaultValue="Mazamesso Clément TEOU" className="mt-1.5" /></div>
                  <div><Label>Email</Label><Input defaultValue="hello@clementteou.me" className="mt-1.5" /></div>
                  <div><Label>Téléphone</Label><Input defaultValue="+221 77 860 89 09" className="mt-1.5" /></div>
                  <div><Label>Fonction</Label><Input defaultValue="Directeur opérations" className="mt-1.5" /></div>
                </div>
                <Button>Enregistrer</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardHeader><CardTitle>Informations entreprise</CardTitle><CardDescription>Données affichées sur les factures</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div><Label>Raison sociale</Label><Input defaultValue="OTC SARL" className="mt-1.5" /></div>
                  <div><Label>NINEA</Label><Input defaultValue="00723451 2N3" className="mt-1.5" /></div>
                  <div className="md:col-span-2"><Label>Adresse</Label><Input defaultValue="Zone portuaire, Dakar, Sénégal" className="mt-1.5" /></div>
                  <div><Label>Email contact</Label><Input defaultValue="contact@otc.sn" className="mt-1.5" /></div>
                  <div><Label>Téléphone</Label><Input defaultValue="+221 33 800 00 00" className="mt-1.5" /></div>
                </div>
                <Button>Mettre à jour</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader><CardTitle>Membres de l'équipe</CardTitle><CardDescription>Gérez les accès et permissions</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { n: "Clément Teou", e: "hello@clementteou.me", r: "Admin" },
                  { n: "Awa Sarr", e: "awa@otc.sn", r: "Opérations" },
                  { n: "Modou Diallo", e: "modou@otc.sn", r: "Comptabilité" },
                  { n: "Ndeye Fall", e: "ndeye@otc.sn", r: "Logistique" },
                ].map((u) => (
                  <div key={u.e} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Avatar><AvatarFallback className="bg-primary/10 text-primary text-xs">{u.n.split(" ").map((w) => w[0]).join("")}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{u.n}</p>
                      <p className="text-xs text-muted-foreground">{u.e}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{u.r}</span>
                    <Button variant="ghost" size="sm">Modifier</Button>
                  </div>
                ))}
                <Button>Inviter un membre</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader><CardTitle>Sécurité du compte</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium">Authentification 2FA</p><p className="text-sm text-muted-foreground">Sécurisez votre compte avec un code temporaire</p></div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium">Sessions actives</p><p className="text-sm text-muted-foreground">3 appareils connectés</p></div>
                  <Button variant="outline" size="sm">Gérer</Button>
                </div>
                <div className="space-y-2">
                  <Label>Mot de passe actuel</Label><Input type="password" />
                  <Label>Nouveau mot de passe</Label><Input type="password" />
                </div>
                <Button>Changer le mot de passe</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
