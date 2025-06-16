import { createClient } from '@/utils/supabase/server';
import ClientLayout from "@/src/components/ClientLayout";
import { Analytics } from "@vercel/analytics/next"


export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  await supabase.auth.getUser();

  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}