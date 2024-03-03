console.clear();

const express = require('express');

const langCodes = require('./langCodes');
const { translate } = require('bing-translate-api');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.post('/translate', async (req, res) => {
  let { userInput } = req.body;
  let phrase = userInput;
  let curPhrase = '';
  let transLang;

  for (let i = 0; i < langCodes.length; i++) {
    transLang = langCodes[i];

    curPhrase = phrase;
    await translate(curPhrase, null, transLang)
      .then((resp) => {
        curPhrase = resp.translation;
        console.log(transLang + ' : ' + curPhrase);
        console.log('');
        console.log('');
      })
      .catch((err) => {});
    if (i + 1 === langCodes.length) {
      await translate(curPhrase, null, 'en')
        .then((resp) => {
          curPhrase = resp.translation;
          console.clear();
          console.log(transLang + ' : ' + curPhrase);
        })
        .catch((err) => {});
    }
  }
  res.json({ done: curPhrase });
});

app.listen(8420, () => console.log('app listening'));
