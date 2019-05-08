"use strict";

var keyPhrases = require('./keyPhrases');

module.exports = (filename) => {
  
  var sdk = require("microsoft-cognitiveservices-speech-sdk");
  var fs = require("fs");

  var subscriptionKey = "2fefc42022b449e29475b51211e746b7";
  // var subscriptionKey = "1eba4da5dd244b0581c3ab5bba3ce1a2";
  var serviceRegion = "eastus";

  // create the push stream we need for the speech sdk.
  var pushStream = sdk.AudioInputStream.createPushStream();

  // open the file and push it to the push stream.
  fs.createReadStream(filename).on('data', function(arrayBuffer) {
    pushStream.write(arrayBuffer.buffer);
  }).on('end', function() {
    pushStream.close();
  });

  // we are done with the setup
  console.log("\n" + "Now recognizing from: " + filename);

  // now create the audio-config pointing to our stream and
  // the speech config specifying the language.
  var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

  // setting the recognition language to English.
  speechConfig.speechRecognitionLanguage = "en-US";

  // create the speech recognizer.
  var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  // start the recognizer and wait for a result.
  recognizer.recognizeOnceAsync(
    function (result) {
      recognizer.close();
      recognizer = undefined;

       const data = result.privText;
      //let data = "Welcome to the dev OPS meeting. I will go over to new processes to follow and their benefits. Thank you everyone for attending. Ensure you setup your environment prior to tomorrows meeting. The takeaways are for Thomas to set up a meeting with Michael regarding the requirement.";

      console.log("\n" + data);
   //   keyPhrases(data);
    },
    function (err) {
      console.trace("err - " + err);

      recognizer.close();
      recognizer = undefined;
    });
}