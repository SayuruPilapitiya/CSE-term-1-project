import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("sri_lankan_towns")
    .select("town_id, town_name, district_name")
    .order("district_name")
    .order("town_name");

  if (error) {
    console.error("Failed to load towns", error);
    return NextResponse.json(
      { error: "Unable to fetch districts and towns" },
      { status: 500 }
    );
  }

  return NextResponse.json({ towns: data ?? [] });
}

