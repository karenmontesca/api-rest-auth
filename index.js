const express = require('express');
const axios = require("axios")
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { token } = require('./config/config');
const { queryResult } = require('./config/connection');

app.get('/connection', async (req, res) => {
    const query = `select * from user`;

    const resp = await queryResult(query);

    if (resp.status == 'success') {
        return res.status(200).json(resp);
    } else {
        return res.status(500).json({
            msg: resp
        });
    }
});

app.post('/valid-dni', async (req, res) => {
    try {
        const response = await axios({
            url: `https://dniruc.apisperu.com/api/v1/dni/${req.body.dni}?token=${token}`,
            method: "GET",
        });
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

app.post('/user', async (req, res) => {
    const query1 = `select *, TIMESTAMPDIFF(YEAR,nacimiento,CURDATE()) AS edad from user where email="${req.body.email}"`;

    const resp1 = await queryResult(query1);
    res.json(resp1.msg[0]);
});

app.post('/register', async (req, res) => {

    const query1 = `select * from user where email="${req.body.email}"`;

    const resp1 = await queryResult(query1);

    if (resp1.msg.length > 0) {
        return res.status(500).json({
            "msg": "Este email ya se encuentra registrado.",
        })
    } else {

        const query3 = `select * from user where usuario="${req.body.usuario}"`;

        const resp3 = await queryResult(query3);

        if (resp3.msg.length > 0) {
            return res.status(500).json({
                "msg": "Este usuario ya se encuentra registrado.",
            })
        } else {

            let date = new Date();
            date = date.toISOString().slice(0, 19).replace('T', " ");

            const query2 = `insert into 
        user(email,usuario,contrasenia,nombres,apellidos,dni,nacimiento,register) 
        values ("${req.body.email}", "${req.body.usuario}", "${req.body.contrasenia}", "${req.body.nombres}","${req.body.apellidos}", "${req.body.dni}", "${req.body.nacimiento}", "${date}")`;

            const resp2 = await queryResult(query2);

            if (resp2.status == 'success') {
                return res.status(200).json({
                    "msg": "Se registró el usuario correctamente",
                });
            } else {
                return res.status(200).json({
                    "msg": resp2,
                })
            }
        }
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})