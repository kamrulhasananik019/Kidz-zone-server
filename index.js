const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pl8jfao.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const tabViewCardCollection = client.db('kids_zone').collection('tabViweCard');

        // app.get('/allToys', async (req, res) => {
        //     const result = await tabViewCardCollection.find().toArray();
        //     res.send(result);
        // });

        app.get('/categories', async (req, res) => {
            let query = {};
            if (req.query?.category) {
                query = { category: req.query.category }
            }
            const cursor = tabViewCardCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });
        app.post('/addToys', async (req, res) => {
            const addToys = req.body;
            const result = await tabViewCardCollection.insertOne(addToys)
            res.send(result)
        })


        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await tabViewCardCollection.deleteOne(query);
            res.send(result)
        });

        app.get('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await tabViewCardCollection.findOne(filter);
            res.send(result)
        });

        app.patch('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateToys=req.body;
            const toys = {
                $set: {
                    quantity: updateToys.quantity,
                    description: updateToys.description,
                    price: updateToys.price
                }
            }
            const result =await tabViewCardCollection.updateOne(filter,toys ,options);
            res.send(result)
        });


        app.get('/myToys',async(req,res)=>{
          
            const email = req.query.sellerEmail;
            const query = { sellerEmail: email }
            const sorted = req.query.sort;
            const result = await tabViewCardCollection.find(query).sort({ price: sorted }).toArray();
            res.send(result);
        });

        app.get('/allToys',async(req,res)=>{
            const  result= await tabViewCardCollection.find().limit(20).toArray();
            res.send(result);
        });

        app.get('/allToys/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id: new ObjectId (id)};
            const result=await tabViewCardCollection.findOne(filter);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('kids is running')
});

app.listen(port, () => {
    console.log(`Kids is running on port ${port}`);
})
