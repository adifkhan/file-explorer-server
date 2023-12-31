import express from "express";
import cors from "cors";
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongodb connection //
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqqwutk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    /* 
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    ); 
    */

    const folderCollection = client.db("explorer").collection("folders");

    // PUT  folder
    app.put("/folder", async (req, res) => {
      const folder = req.body;
      const explorer = { name: folder.name, explorer: folder.explorer };
      const filter = { _id: new ObjectId(folder._id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: explorer,
      };
      const result = await folderCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // GET folder
    app.get("/folder", async (req, res) => {
      const query = {};
      const result = await folderCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Explorer!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
