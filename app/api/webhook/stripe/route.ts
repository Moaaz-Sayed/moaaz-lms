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
  } catch {
    return new Response("Webhook error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const courseId = session.metadata?.courseId;
    const enrollmentId = session.metadata?.enrollmentId;
    const customerId = session.customer as string;

    if (!courseId || !enrollmentId) {
      return new Response("Invalid metadata", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    try {
      await prisma.enrollment.upsert({
        where: { id: enrollmentId },
        update: {
          status: "Active",
          amount: session.amount_total ? session.amount_total / 100 : 0,
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
    } catch {
      return new Response("DB error", { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
}
