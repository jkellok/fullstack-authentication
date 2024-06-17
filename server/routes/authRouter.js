import express from 'express';
import { supabase } from '../supabaseClient.js';

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const { data: user, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ user });
});

authRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const { data: session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ session });
});

export default authRouter;
