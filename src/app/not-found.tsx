import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
          <SearchX size={40} className="text-muted-foreground/60" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Seite nicht gefunden</h1>
        <p className="text-muted-foreground mb-8">Die Seite, die du suchst, existiert nicht.</p>
        <Link href="/"><Button className="shadow-lg shadow-primary/20"><ArrowLeft size={16} className="mr-2" />Zurück zur Startseite</Button></Link>
      </div>
    </div>
  );
}
