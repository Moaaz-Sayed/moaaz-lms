import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return new Response("Webhook error", { status: 400 });
  }

  // لو عايز تشوف كل الايفنتات
  console.log("🔔 Stripe Event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("✅ Session metadata:", session.metadata);

    const courseId = session.metadata?.courseId;
    const enrollmentId = session.metadata?.enrollmentId;
    const customerId = session.customer as string;

    if (!courseId || !enrollmentId) {
      console.error("❌ Course ID or Enrollment ID missing in metadata");
      return new Response("Invalid metadata", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error("❌ User not found with customerId:", customerId);
      return new Response("User not found", { status: 404 });
    }

    try {
      await prisma.enrollment.upsert({
        where: { id: enrollmentId },
        update: {
          status: "Active",
          amount: session.amount_total ? session.amount_total / 100 : 0, // Stripe بيخزن بالـ cents
          updatedAt: new Date(),
        },
        create: {
          id: enrollmentId,
          userId: user.id,
          courseId,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          status: "Active",
        },
      });

      console.log("🎉 Enrollment updated/created successfully!");
    } catch (dbErr) {
      console.error("❌ Failed to update enrollment:", dbErr);
      return new Response("DB error", { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
}
