const supabase = require('../configs/supabaseClient');

exports.findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;

  return data;
};

exports.createUser = async (user) => {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select();

  if (error) throw error;

  return data;
};