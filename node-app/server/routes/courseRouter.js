import express from 'express';
import {supabase} from '../supabaseClient.js'

const courseRouter = express.Router();

courseRouter.get("/courses", async (req, res) => {

  const { data, error } = await supabase.from("courses").select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.send(data);
});

export default courseRouter