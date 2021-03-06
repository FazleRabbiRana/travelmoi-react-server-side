const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k1z8j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try {
		await client.connect();
		const database = client.db('travelmoi_db');
		const featuresCollection = database.collection('features');
		const factsCollection = database.collection('facts');
		const destinationsCollection = database.collection('destinations');
		const ordersCollection = database.collection('orders');

		// Get API for all destinations
		app.get('/destinations', async (req, res) => {
			const cursor = destinationsCollection.find({});
			const destinations = await cursor.toArray();
			res.json(destinations);
		});

		// Get API for an individual destination
		app.get('/destinations/:id', async (req, res) => {
			const id = req.params.id;
			const query = {_id: ObjectId(id)};
			const destination = await destinationsCollection.findOne(query);
			res.json(destination);
		});

		// Post API to add a destination
		app.post('/destinations', async (req, res) => {
			const destination = req.body;
			const result = await destinationsCollection.insertOne(destination);
			res.json(result);
		});

		// Delete API to remove an individual destination
		app.delete('/destinations/:id', async (req, res) => {
			const id = req.params.id;
			const query = {_id: ObjectId(id)};
			const result = await destinationsCollection.deleteOne(query);
			res.json(result);
		});

		// Post API to add an order
		app.post('/orders', async (req, res) => {
			const order = req.body;
			const result = await ordersCollection.insertOne(order);
			res.json(result);
		});

		// Get API for all orders
		app.get('/orders', async (req, res) => {
			const cursor = ordersCollection.find({});
			const orders = await cursor.toArray();
			res.json(orders);
		});

		// Get API for an individual order
		app.get('/orders/:id', async (req, res) => {
			const id = req.params.id;
			const query = {_id: ObjectId(id)};
			const order = await ordersCollection.findOne(query);
			res.json(order);
		});

		// Delete API to remove an individual order
		app.delete('/orders/:id', async (req, res) => {
			const id = req.params.id;
			const query = {_id: ObjectId(id)};
			const result = await ordersCollection.deleteOne(query);
			res.json(result);
		});

		// Put API to update an individual order
		app.put('/orders/:id', async (req, res) => {
			const id = req.params.id;
			const filter = {_id: ObjectId(id)};
			const updatedProduct = req.body;
			const options = { upsert: true };
			const updateDoc = {
				$set: {
					status: updatedProduct.status,
				},
			};
			const result = await ordersCollection.updateOne(filter, updateDoc, options);
			res.json(result);
		});

		// Get API for all features
		app.get('/features', async (req, res) => {
			const cursor = featuresCollection.find({});
			const features = await cursor.toArray();
			res.json(features);
		});

		// Get API for all facts
		app.get('/facts', async (req, res) => {
			const cursor = factsCollection.find({});
			const facts = await cursor.toArray();
			res.json(facts);
		});

	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Running Travelmoi server');
});

app.listen(port, () => {
	console.log('Running Travelmoi server on port', port);
});