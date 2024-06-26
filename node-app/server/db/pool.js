import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "supabase",
  host: "localhost",
  database: "supabase_db",
  password: "supabase",
  port: 5432,
});

export default pool;
