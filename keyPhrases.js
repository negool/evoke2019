'use strict';

module.exports = (textFile) => {
	const https = require ('https');

	const accessKey = '77e214b851f642d48e00ddfa9627f2e7';
	// const accessKey = '23ecc063ec7d4119b1459e279f3a7d24';
	const keyPhrases = ['takeaway', 'action item', 'ensure'];
	const punctuation = /[.?!,]/;

	const uri = 'eastus.api.cognitive.microsoft.com';
	const path = '/text/analytics/v2.0/keyPhrases';

	let response_handler = function (response) {
	    let body = '';
	    response.on ('data', function (d) {
	        body += d;
	    });
	    response.on ('end', function () {
					let body_ = JSON.parse(body);
					console.log("\n" + body);
					loadServer(body_);
	    });
	    response.on ('error', function (e) {
	        console.log ('Error: ' + e.message);
	    });
	};

	let get_key_phrases = function (textFile) {
		let body = JSON.stringify (documents);

		let request_params = {
			method : 'POST',
			hostname : uri,
			path : path,
			headers : {
				'Ocp-Apim-Subscription-Key' : accessKey,
			}
		};

		let req = https.request (request_params, response_handler);
		req.write (body);
		req.end ();
	}

	let documents = { 'documents': [
	  { 'id': '1',
	    'language': 'en',
	    'text': textFile
	  }
	]};

	function listImportantSentences(keyPhrases, keyWords, content, punctuation) {

			let result = [];
			for (let i=0; i < keyWords.length; i++) {
				for(let j=0; j < keyPhrases.length; j++) {

					if (keyWords[i].toLowerCase().includes(keyPhrases[j].toLowerCase())) {

						const index = content.indexOf(keyPhrases[j]);

						const frontOfString = content.slice(0, index);
						const endOfString = content.slice(index, content.length);

						const startOfStringIndex = frontOfString.lastIndexOf(frontOfString.match(punctuation));
						const endOfStringIndex = endOfString.indexOf(endOfString.match(punctuation));

						const sentenceToSend = content.slice(startOfStringIndex + 1, index + endOfStringIndex + 1).trim().replace(/.$/,".");
						result.push(capitalizeFirstLetter(sentenceToSend));
					}
				}
			}

			const uniqueResults = a => [...new Set(a)];
			
			return uniqueResults(result);
	}

	get_key_phrases (textFile);

	function capitalizeFirstLetter(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function loadServer(body_) {
		const express = require('express');
		const app = express();
		const path = require('path');
		const router = express.Router();
		app.use(express.static(__dirname));

		router.get('/',function(req, res) {
			res.sendFile(path.join(__dirname + '/index.html'));
		});

		router.get('/test',function(req, res) {
			const test = listImportantSentences(keyPhrases, body_.documents[0].keyPhrases, textFile, punctuation);
			res.json({ message: test });
		});

		//add the router
		app.use('/', router);
		app.listen(process.env.port || 3000);

		console.log("\n" + 'Running at Port 3000');
	}
};
