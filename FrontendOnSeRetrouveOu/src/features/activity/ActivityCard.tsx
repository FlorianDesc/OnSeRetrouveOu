import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivityCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Activité</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Contenu de la carte d'activité. Ceci est un exemple de texte qui sera
          remplacé par les vraies données.
        </p>
      </CardContent>
    </Card>
  );
}
