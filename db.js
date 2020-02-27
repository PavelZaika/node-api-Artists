const MongoClient = require("mongodb").MongoClient;

let state = {
  db: null
};

exports.connect = (url, name, done) => {
  if (state.db) {
    return done();
  }
  MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    if (err) {
      return done(err);
    }
    state.db = client.db(name);
    done();
  });
};

exports.get = () => {
    return state.db;
}