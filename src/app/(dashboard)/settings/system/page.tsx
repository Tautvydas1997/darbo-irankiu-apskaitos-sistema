import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System settings</CardTitle>
        <CardDescription>This area is restricted to administrators.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">Add global configuration controls here.</p>
      </CardContent>
    </Card>
  );
}
