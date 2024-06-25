import express from 'express';
import {supabase} from '../supabaseClient.js'

const testRouter = express.Router();

testRouter.get("/", async (req, res) => {
    const { data, error } = await supabase
        .from('test_table')
        .select()
    res.send(data);
})

export default testRouter