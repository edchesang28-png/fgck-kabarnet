import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/events
// Public: returns published, upcoming events. Admins (authenticated) get everything.
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = Number(searchParams.get("limit") ?? "50");

  let query = supabase.from("events").select("*").order("event_date", { ascending: true });

  // Anonymous visitors only ever see published events; admins see everything
  if (!session) {
    query = query.eq("is_published", true).gte("event_date", new Date().toISOString().slice(0, 10));
  }

  if (category) {
    query = query.eq("category", category);
  }

  query = query.limit(Math.min(limit, 100));

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data });
}

// POST /api/events
// Admin-only: creates a new event. Requires an authenticated Supabase session
// (the browser client automatically attaches the session cookie).
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Admin login required to create events." },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { title, description, category, event_date, start_time, end_time, location, flyer_url, is_featured, is_published } = body;

  // Basic server-side validation — never trust the client
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Event title is required." }, { status: 400 });
  }
  if (!event_date || typeof event_date !== "string") {
    return NextResponse.json({ error: "Event date is required (YYYY-MM-DD)." }, { status: 400 });
  }

  const validCategories = [
    "general", "youth", "kesha", "conference", "revival", "crusade", "wedding", "funeral", "training",
  ];
  const safeCategory = typeof category === "string" && validCategories.includes(category) ? category : "general";

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: title.trim(),
      description: typeof description === "string" ? description : null,
      category: safeCategory,
      event_date,
      start_time: typeof start_time === "string" && start_time ? start_time : null,
      end_time: typeof end_time === "string" && end_time ? end_time : null,
      location: typeof location === "string" && location ? location : "FGCK Kabarnet Main Sanctuary",
      flyer_url: typeof flyer_url === "string" && flyer_url ? flyer_url : null,
      is_featured: Boolean(is_featured),
      is_published: is_published === undefined ? true : Boolean(is_published),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ event: data }, { status: 201 });
}
