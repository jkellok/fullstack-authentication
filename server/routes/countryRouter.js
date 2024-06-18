import express from 'express';
import { supabase } from '../supabaseClient.js';
import authMiddleware from '../middleware/authMiddleware.js';

const countryRouter = express.Router();

countryRouter.use(authMiddleware)

countryRouter.get('/countries', async (req, res) => {
    const { data, error } = await supabase
        .from('countries')
        .select();

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.send(data)
})

countryRouter.post("/countries", async (req, res) => {
  const { name, iso2, iso3, local_name, continent } = req.body;
  const { data, error } = await supabase
    .from("countries")
    .insert([{ name, iso2, iso3, local_name, continent }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

countryRouter.delete("/countries/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("countries").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: "Country deleted successfully" });
});

export default countryRouter;