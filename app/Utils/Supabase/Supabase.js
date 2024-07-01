const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const supabase_url = process.env.SUPABASE_URL;
const supabase_api_key = process.env.SUPABASE_ANON_KEY;

const supabase = createClient( supabase_url, supabase_api_key );

module.exports = supabase;
