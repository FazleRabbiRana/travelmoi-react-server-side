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
		const destinationsCollection = database.collection('destinations');
		const featuresCollection = database.collection('features');
		const factsCollection = database.collection('facts');

		// Get API for all destinations
		app.get('/destinations', async (req, res) => {
			const cursor = destinationsCollection.find({});
			const destinations = await cursor.toArray();
			res.json(destinations);
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