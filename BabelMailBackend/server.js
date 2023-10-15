const express = require('express');
const bodyParser = require('body-parser');
const { Kafka } = require('kafkajs');

const app = express();
app.use(bodyParser.urlencoded());

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'] // Replace with your Kafka broker addresses
});

const producer = kafka.producer();

// Select a random number of languages between 1 and input
function selectRandomLanguages(numLanguages) {
    const languages = ['hi', 'es', 'fr', 'de', 'it', 'ru', 'tr', 'uk', 'ja', 'ko'];
    const selanguages = [];
    for(let i = 0; i < numLanguages; i++) {
        const randomIndex = Math.floor(Math.random() * languages.length);
        selanguages.push(languages[randomIndex]);
    }
    return selanguages;
}

app.post('/send_message', async (req, res) => {
  console.log('Received data:', req.body);
  email_id = req.body.email;
  subject = req.body.subject;
  message = req.body.message;

  const numLanguages = req.body.languages;
  const selectedLanguages = selectRandomLanguages(numLanguages);

  producer_input1 = email_id + "|" + subject + "|" + message + "|" + selectedLanguages[0];
  producer_input2 = email_id + "|" + subject + "|" + message + "|" + selectedLanguages[1];
  producer_input3 = email_id + "|" + subject + "|" + message + "|" + selectedLanguages[2];
  producer_input4 = email_id + "|" + subject + "|" + message + "|" + selectedLanguages[3];

  try {
    await producer.connect();
    await producer.send({
      topic: 'message-topic1', // Adjust this based on your Kafka topic
      //messages: producer_list.
      messages: [{ value: producer_input1 },
                 { value: producer_input2 },
                 { value: producer_input3 },
                 { value: producer_input4 }]
    });

    console.log('Email published successfully');

    console.log('Languages published successfully');

    res.json({ message: 'Data processed successfully' });
  } catch (error) {
    console.error('Error publishing to Kafka:', error);
    res.status(500).json({ error: 'Error processing data' });
  } finally {
    await producer.disconnect();
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});