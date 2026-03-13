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

  exports.updateEvent = async (id, updatedEvent) => {

    const { data, error } = await supabase
      .from("events")
      .update(updatedEvent)
      .eq("id", id)
      .select();

    if (error) throw error;

    return data;

  };

  exports.deleteEvent = async (id) => {

    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return data;

  };

  exports.getAllEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
  };