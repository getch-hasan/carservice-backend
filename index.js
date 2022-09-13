const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');


require('dotenv').config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.user}:${process.env.KEY}@cluster0.f5umaix.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/* client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log('connected');
    // perform actions on the collection object
    client.close();
}); */


async function run() {

    try {
        await client.connect();
        const serviceCollection = client.db("car_services").collection("service");



        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)

        });
        app.get('/service/:id',async (req,res)=>{
            const id=req.params.id
            const query = {_id:ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service)
        });


        app.post('/service',async(req,res)=>{
            const newservice=req.body
            const result = await serviceCollection.insertOne(newservice)
            res.send(result);


        });
        app.delete('/service/:id',async(req,res)=>{
            const id=req.params.id;
            const query = {  _id:ObjectId(id)};
            const result=await serviceCollection.deleteOne(query)
            res.send(result)

        })
        
    }
    finally {
        //console.log('connected')

    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('car service is running');
});


app.listen(port, () => {
    console.log("listening to port", port)

});