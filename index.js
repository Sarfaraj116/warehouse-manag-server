const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, MongoCursorInUseError } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// Midlewere
app.use(cors());
app.use(express.json());

// Node mongodb CURD

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4rwhs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const CarCollection = client.db('warhouse-manage-assignment').collection('My collections')

        // JWT
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1y'
            });
            res.send({ accessToken });
        })

        // 

        app.get('/car', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = CarCollection.find(query);
            let Cars;
            if (page || size) {
                Cars = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                Cars = await cursor.toArray();
            }

            res.send(Cars);
            // Load Item
            app.get('/user', async (req, res) => {
                const query = {}
                const cursor = CarCollection.find(query);
                const users = await cursor.toArray();
                res.send(users);
            });
            // Post laptop (Add new laptop)
            app.post('/user', async (req, res) => {
                const newUser = req.body;
                console.log('new', newUser);
                const result = await CarCollection.insertOne(newUser);
                res.send(result);
            });
            // paigination
            app.get('/carcount', async (req, res) => {
                // const query = {};
                // const cursor = laptopCollection.find(query);
                const count = await CarCollection.estimatedDocumentCount();
                res.send({ count });
            })
        })
        // delete laptop
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await CarCollection.deleteOne(query);
            res.send(result);

        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Car werehouse server')
});

app.listen(port, () => {
    console.log('code running', 5000)
})
