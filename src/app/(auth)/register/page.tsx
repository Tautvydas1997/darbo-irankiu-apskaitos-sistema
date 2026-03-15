import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Registration handled by administrators</CardTitle>
        <CardDescription>
          Employee accounts are created internally. Contact an administrator to request access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href="/login">Back to login</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
