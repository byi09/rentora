import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/src/db';
import { users, customers } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is authenticated, check onboarding status
  if (user) {
    const userRow = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: { id: true },
    });
    const customerRow = await db.query.customers.findFirst({
      where: eq(customers.userId, user.id),
      columns: { id: true },
    });
    const onboarded = !!userRow && !!customerRow;

    // Only redirect to messages if user is fully onboarded
    if (onboarded) {
      redirect('/messages');
    }
    // If not onboarded, let them see the landing page with onboarding modal
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-blue-700">Welcome to Rentora</h1>
      <p className="max-w-xl text-lg text-gray-700 mb-10">
        Student renting made social. Discover listings, chat with landlords and other renters in real&nbsp;time, and find your perfect home.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <a href="/sign-in" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-medium shadow hover:bg-blue-700 transition">Get Started</a>
        <a href="/sign-up" className="inline-block px-6 py-3 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-50 transition">Create Account</a>
      </div>
    </main>
  );
} 