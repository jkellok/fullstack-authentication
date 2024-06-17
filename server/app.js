import express from 'express';
const app = express();
import cors from 'cors';
import testRouter from './controllers/test.js';

app.use(cors());
app.use("/api/test", testRouter);

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

export default app;