const express = require('express')
const cors = require ('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { ObjectID } = require('bson');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors())
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Hello bubu from node')
})

// mongodb




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0vh6mry.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async()=>{
    try{

        const productCollection = client.db("enventoryManagement").collection("products");

        app.get('/products', async(req,res)=>{

            const cursor = productCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/products', async(req,res)=>{
            const product = req.body
            const result = await productCollection.insertOne(product)
            console.log(result)
            res.send(result)
        })

        app.get('/products/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id:ObjectID(id)}
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.put('/products/:id', async(req,res)=>{
            const id = req.params.id
            const filter = {_id:ObjectId(id)}
            const product = req.body
            const option = {upsert:true}
            const updateProduct = {
                $set:{
                    title:product.title,
                    image:product.image,
                    price:product.price
                }
            }
            const result = await productCollection.updateOne(filter, updateProduct,option)
            console.log(result)
            res.send(result)
        })


        app.delete('/products/:id', async(req,res)=>{
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await productCollection.deleteOne(query)
            console.log(result)
            res.send(result)

        })

    }
    finally{

    }
}
run().catch(console.dir)






app.listen(port, ()=>{
    console.log(`listening from ${port}` )
})