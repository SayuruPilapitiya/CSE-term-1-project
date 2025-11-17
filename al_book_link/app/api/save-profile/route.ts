import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { firstName, lastName, phone, userId, district, townName, townId } =
    await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "Missing Clerk user ID." },
      { status: 400 }
    );
  }

  if (!firstName || !phone) {
    return NextResponse.json(
      { error: "First name and phone number are required." },
      { status: 400 }
    );
  }

  const normalizedTownId = Number(townId);

  if (!Number.isFinite(normalizedTownId)) {
    return NextResponse.json(
      { error: "A valid town must be selected." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("user_details_table")
    .upsert(
      {
        user_id: userId,
        first_name: firstName,
        last_name: lastName || null,
        phone_number: phone || null,
        town_id: normalizedTownId,
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    userId,
    district,
    townName,
    townId: normalizedTownId,
  });
}
