import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

function verifySignature(rawBody, signature) {

    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

    const digest = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex")

    return digest === signature

}

export async function POST(req) {

    try {

        const rawBody = await req.text()

        const signature = req.headers.get("x-signature")

        if (!verifySignature(rawBody, signature)) {
            console.error("Invalid webhook signature")
            return new Response("Invalid signature", { status: 401 })
        }

        const payload = JSON.parse(rawBody)

        console.log("LEMON WEBHOOK:", payload.meta?.event_name)

        const event = payload.meta?.event_name
        const subscription = payload.data
        const attributes = subscription?.attributes

        const userId = payload.meta?.custom_data?.user_id

        const subscriptionId = subscription?.id
        const customerId = attributes?.customer_id
        const status = attributes?.status

        if (!subscriptionId) {
            return NextResponse.json({ ok: true })
        }

        // ---------- SUBSCRIPTION CREATED ----------

        if (event === "subscription_created") {

            const { error } = await supabase
                .from("subscriptions")
                .upsert({
                    user_id: userId,
                    subscription_id: subscriptionId,
                    customer_id: customerId,
                    status: status,
                    plan: "pro"
                }, { onConflict: "subscription_id" })

            if (error) console.error("Insert error:", error)

        }

        // ---------- SUBSCRIPTION UPDATED ----------

        if (event === "subscription_updated") {

            const { error } = await supabase
                .from("subscriptions")
                .update({
                    status: status
                })
                .eq("subscription_id", subscriptionId)

            if (error) console.error("Update error:", error)

        }

        // ---------- SUBSCRIPTION CANCELLED ----------

        if (event === "subscription_cancelled") {

            const { error } = await supabase
                .from("subscriptions")
                .update({
                    status: "cancelled"
                })
                .eq("subscription_id", subscriptionId)

            if (error) console.error("Cancel error:", error)

        }

        // ---------- SUBSCRIPTION RESUMED ----------

        if (event === "subscription_resumed") {

            const { error } = await supabase
                .from("subscriptions")
                .update({
                    status: "active"
                })
                .eq("subscription_id", subscriptionId)

            if (error) console.error("Resume error:", error)

        }

        // ---------- PAYMENT FAILED ----------

        if (event === "subscription_payment_failed") {

            const { error } = await supabase
                .from("subscriptions")
                .update({
                    status: "past_due"
                })
                .eq("subscription_id", subscriptionId)

            if (error) console.error("Payment fail error:", error)

        }

        // ---------- PAYMENT SUCCESS ----------

        if (event === "subscription_payment_success") {

            const { error } = await supabase
                .from("subscriptions")
                .update({
                    status: "active"
                })
                .eq("subscription_id", subscriptionId)

            if (error) console.error("Payment success error:", error)

        }

        return NextResponse.json({ received: true })

    } catch (error) {

        console.error("Webhook crash:", error)

        return NextResponse.json(
            { error: "Webhook failed" },
            { status: 500 }
        )

    }

}