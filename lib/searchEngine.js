const db = require('./config/db');
const connection = db.connection;

// get promises instead of using callbacks
const util = require('util')
const queryCallback = connection.query.bind(connection)
const queryPromise = util.promisify(queryCallback) // now this returns a promise we can "await"

async function getAll(){
    const sql = "SELECT name, imageLink FROM apple";
    const rows = await queryPromise(sql)
    const names = rows.map(row => row.name);
    const img = rows.map(row => row.imageLink);

    return{
      names: names,
      img: img
    }
}

module.exports = getAll;