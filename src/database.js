const fs = require("fs")
const {MongoClient} = require('mongodb');
const assert = require('assert');

const config = JSON.parse(fs.readFileSync("./config/config.json").toString())

const port = () => {
  if (config.database.port.length !== 0) {
    return ':' + config.database.port
  } else {
    return ''
  }
}
// Connection URL
const uri = 'mongodb+srv://' + config.database.username + ':' + config.database.password + '@' + config.database.host + port() + '/' + config.database.dbname + '?retryWrites=true&w=majority';

const getPlayerByName = (search, callback) => {
  const client = new MongoClient(uri, {useUnifiedTopology: true});
  client.connect(function (err) {
    assert.strictEqual(null, err);

    const db = client.db(config.database.dbname);

    // Get the collection
    const collection = db.collection(config.database.collection);
    // Find some documents
    collection.find({'name': search}).toArray(function (err, docs) {
      assert.strictEqual(err, null);
      client.close();
      docs.forEach((item, index) => {
        delete item.canSeeStaffMessages
        delete item.ipAddress
        delete item.authSecret
        delete item.lastAuthAddress
      })
      if (docs.length !== 0) {
        if (callback)
          callback(docs);
      } else {
        if (callback)
          callback({
            "status": 204,
            "error": "No player found!"
          })
      }
    });
  });

}

module.exports = {
  getPlayerByName
}
