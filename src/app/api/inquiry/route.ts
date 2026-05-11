import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Save to Supabase
    const { data: inquiry, error: sbError } = await supabase
      .from("inquiries")
      .insert([
        {
          segment: body.segment,
          goal: body.goal,
          urgency: body.urgency,
          budget_range: body.budget_range,
          full_name: body.full_name,
          email: body.email,
          whatsapp: body.whatsapp,
          company: body.company,
          lead_score: body.lead_score,
          routing: body.routing,
          landing_path: body.path || "/",
          status: "new",
        },
      ])
      .select()
      .single();

    if (sbError) {
      console.error("Supabase Error:", sbError);
      // Continue anyway if it's just a DB error so we can try email/WA
    }

    // 2. Trigger Resend Email (Internal Notification)
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Zadit Hub <notifications@zadit.dev>",
          to: siteConfig.links.email,
          subject: `[New Lead] ${body.full_name} - ${body.segment}`,
          html: `
            <h2>New Inquiry Received</h2>
            <p><strong>Name:</strong> ${body.full_name}</p>
            <p><strong>Segment:</strong> ${body.segment}</p>
            <p><strong>Goal:</strong> ${body.goal}</p>
            <p><strong>Urgency:</strong> ${body.urgency}</p>
            <p><strong>WhatsApp:</strong> ${body.whatsapp}</p>
            <p><strong>Email:</strong> ${body.email || 'N/A'}</p>
            <p><strong>Lead Score:</strong> ${body.lead_score}</p>
            <p><strong>Routing:</strong> ${body.routing}</p>
          `,
        });
      } catch (emailError) {
        console.error("Resend Error:", emailError);
      }
    }

    return NextResponse.json({ success: true, id: inquiry?.id });
  } catch (error) {
    console.error("Inquiry API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
