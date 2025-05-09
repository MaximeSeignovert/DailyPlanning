import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import changelogData from "@/data/changelog.json";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

interface ChangelogData {
  changelog: ChangelogEntry[];
}

export function Changelog() {
  const { changelog } = changelogData as ChangelogData;

  return (
    <div className="mx-auto space-y-8">
      <div className="space-y-6">
        {changelog.map((entry, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Version {entry.version}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(entry.date), "d MMMM yyyy", { locale: fr })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {entry.changes.map((change, changeIndex) => (
                  <li key={changeIndex}>{change}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
