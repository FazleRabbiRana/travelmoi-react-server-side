const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running Travelmoi server');
});

app.listen(port, () => {
	console.log('Running Travelmoi server on port', port);
});