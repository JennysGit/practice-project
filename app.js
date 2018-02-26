const express = require('express');
const mongoose = require('mongoose');
const DATA = require('./models/data');

const app = express();

app.get('/', (req, res, next) => {
  let result;
  const DB_URL = 'mongodb://root:123456@ds247678.mlab.com:47678/zhangchu-foods';
  if (mongoose.connection.readyState == 0) {
    mongoose.connect(DB_URL);

    //On connection
    mongoose.connection.once('open', () => {
      console.log('connected to database: ' + DB_URL);
    })

    //Error connection
    mongoose.connection.on('error', (err) => {
      console.log('database error' + err);
    })
  }

  try {
    DATA.find({title: /咖喱/i}, (err, datas) => {
      if (err) throw err;
      result = datas;
      console.log(result);
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }

  // res.send(result);
});

app.listen(3000, () => {
  console.log('app is listening at port 3000');
})