const express = require('express');
const axios = require("axios")
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const { queryResult } = require('./config/connection');

app.get('/connection', async (req, res) => {
    const query = `select * from user`;

    const resp = await queryResult(query);

    if(resp.status == 'success'){
        return res.status(200).json(resp);
    }else{
        return res.status(500).json({
            msg: resp
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})