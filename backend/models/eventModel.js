const supabase = require("../configs/supabaseClient");

exports.createEvent = async (event) => {

  const { data, error } = await supabase
    .from("events")
    .insert([event])
    .select();

  if (error) throw error;

  return data;
};

exports.getEventsByOrganizer = async (organizer_id) => {

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", organizer_id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};