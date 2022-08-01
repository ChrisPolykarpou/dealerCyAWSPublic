const db = require('./config/db');
const connection = db.connection;

// get promises instead of using callbacks
const util = require('util')
const queryCallback = connection.query.bind(connection)
const queryPromise = util.promisify(queryCallback) // now this returns a promise we can "await"

// our asynchronous method, use "async" keyword so Node knows we can await for promises in there
async function getProducts (product) {
  const getResultsSQL = "SELECT * FROM apple WHERE MATCH(name, category, color) AGAINST (? IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) AND NAME LIKE ? AND NAME LIKE ? AND NAME LIKE ? AND NAME LIKE ? AND NAME LIKE ? AND NAME LIKE ? AND NAME LIKE ? LIMIT 149";
  
  // 1. split product string into array for query
  // 2. use map() to transform values into new arrays
  // 3. return results
  
  str = product.split(' ');
  var len = str.length
  var i=8
  while(i > len){
    str.push("")
    i--;
  }
  
  var rows = await queryPromise(getResultsSQL, [product, '%'+str[0]+' %', '%'+str[1]+' %', '%'+str[2]+' %', '%'+str[3]+'%', '%'+str[4]+'%', '%'+str[5]+'%', '%'+str[6]+'%', '%'+str[7]+'%']);
  if(rows.length==0){
    const sql2 = "SELECT * FROM apple WHERE MATCH(name, category, color) AGAINST (? IN NATURAL LANGUAGE MODE) LIMIT 100";
    rows = await queryPromise(sql2, [product]);
  }
  const names = rows.map(row => row.name)
  const id = rows.map(row => row.id);
  const description = rows.map(row => row.description.trim());
  const images = rows.map(row => row.imageLink);
  const minPrice = rows.map(row => row.minPrice);
  const storeCount = rows.map(row => row.storeCount);

  // Return info for results
  return {
    id: id,
    name: names,
    image: images,
    description: description,
    minPrice: minPrice,
    storeCount: storeCount,
  }
}

module.exports = getProducts;   





