import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const { firstName, lastName, phone, userId } = body;

  const { error } = await supabase.from("user_details_table").insert({
    user_id: userId,
    first_name: firstName,
    last_name: lastName,
    phone_number: phone,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
