import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {

    try {

        const payload = await req.json()

        const event = payload.meta?.event_name

        if (event === "subscription_created") {

            const subscription = payload.data

            const userId =
                subscription.attributes.custom_data?.user_id

            if (!userId) {
                return NextResponse.json({ ok: true })
            }

            await supabase
                .from("subscriptions")
                .insert({

                    user_id: userId,
                    subscription_id: subscription.id,
                    customer_id: subscription.attributes.customer_id,
                    status: subscription.attributes.status,
                    plan: "pro"

                })

        }

        if (event === "subscription_cancelled") {

            const subscription = payload.data

            await supabase
                .from("subscriptions")
                .update({ status: "cancelled" })
                .eq("subscription_id", subscription.id)

        }

        return NextResponse.json({ received: true })

    } catch (error) {

        console.error(error)

        return NextResponse.json(
            { error: "Webhook failed" },
            { status: 500 }
        )

    }

}