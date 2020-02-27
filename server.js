const express = require("express");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
const db = require("./db.js");

const app = express();
const DBurl = "mongodb://localhost:27017/";
const DBName = "myapi";
const port = 3000;
const collection = () => {
  return db.get().collection("artists");
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hi!"));

app.get("/artists", (req, res) => {
  collection()
    .find()
    .toArray((err, docs) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(docs);
      console.log(200);
    });
});

app.get("/artists/:id", (req, res) => {
  collection().findOne({ _id: ObjectID(req.params.id) }, (err, docs) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  });
});

app.post("/artists", (req, res) => {
  let artist = {
    name: req.body.name
  };

  collection().insertOne(artist, (err, result) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(artist);
  });
});

app.put("/artists/:id", (req, res) => {
  collection().updateOne(
    { _id: ObjectID(req.params.id) },
    { $set: { name: req.body.name } },
    { upsert: true },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.sendStatus(200);
    }
  );
});

app.delete("/artists/:id", (req, res) => {
  collection().deleteOne({ _id: ObjectID(req.params.id) }, (err, result) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });
});

db.connect(DBurl, DBName, err => {
  if (err) {
    return console.log(err);
  }

  app.listen(port, () => console.log(`API app started`));
});

// let artists = [
//   {
//     id: 1,
//     name: "Metallica"
//   },
//   {
//     id: 2,
//     name: "Green Day"
//   },
//   {
//     id: 3,
//     name: "Offspring"
//   }
// ];
// app.get("/artists", (req, res) => res.send(artists));
// app.get("/artists/:id", (req, res) => {
//   console.log(req.params);
//   let artist = artists.find(artist => {
//     return artist.id === Number(req.params.id);
//   });
//   res.send(artist);
// });
// app.post("/artists", (req, res) => {
//   let artist = {
//     id: Date.now(),
//     name: req.body.name
//   };
//   artists.push(artist);
//   console.log(req.body);
//   res.send(artist);
// });
// app.put("/artists/:id", (req, res) => {
//   let artist = artists.find(artist => {
//     return artist.id === Number(req.params.id);
//   });
//   artist.name = req.body.name;
//   res.sendStatus(200);
// });
// app.delete("/artists/:id", (req, res) => {
//   artists = artists.filter(artist => {
//     return artist.id !== Number(req.params.id);
//   });
//   res.sendStatus(200);
// });
