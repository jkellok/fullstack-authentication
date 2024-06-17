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

export default countryRouter;