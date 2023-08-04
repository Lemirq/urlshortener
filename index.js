require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const { readFileSync, writeFileSync } = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});

const path = './sitelist.json';
const jsonString = readFileSync(path);
const parsedSitelist = JSON.parse(jsonString);

app.post('/api/shorturl', (req, res) => {
	const url = req.body.url;

	dns.lookup(url, { all: true }, (err, addresses) => {
		if (err) {
			console.log(err);
		}
		if (addresses) {
			// check if url is already in sitelist
			// if it is, return the index
			// if not, add it to the sitelist and return the index

			const urlIndex = Object.keys(parsedSitelist).find((key) => parsedSitelist[key] === url);
			if (urlIndex) {
				res.json({ original_url: url, short_url: urlIndex });
			} else {
				const newIndex = Object.keys(parsedSitelist).length + 1;
				parsedSitelist[newIndex] = url;

				const newJsonString = JSON.stringify(parsedSitelist);

				writeFileSync(path, newJsonString);
				res.json({ original_url: url, short_url: newIndex });
			}
		} else {
			res.json({ error: 'Invalid URL' });
		}
	});
});

app.get('/api/shorturl/:num', (req, res) => {
	readFileSync(path);

	const num = req.params.num;
	const url = parsedSitelist[num];

	if (url) {
		res.redirect('https://' + url);
	} else {
		res.json({ error: 'No short URL found for the given input' });
	}
});
