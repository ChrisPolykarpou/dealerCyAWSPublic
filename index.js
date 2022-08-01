const compression = require("compression");
//const { ElastiCacheClient, AddTagsToResourceCommand } = require("@aws-sdk/client-elasticache");

var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
app.use(compression());

// ssl
const https_options = {
   ca: fs.readFileSync("lib/config/ssl/ca_bundle.crt"),
   key: fs.readFileSync("lib/config/ssl/private.key"),
   cert: fs.readFileSync("lib/config/ssl/certificate.crt")
};

path = require('path');
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname+'/views')));

// Middlewear to get search results for header
app.use('*', async function(req, res, next){
   const getResults = require('./lib/searchEngine')
   const results = await getResults();

   req.results = results;
   next();
});

app.get('/', function (req, res) {
   res.render('home', {
      // Search bar header results
      names: req.results.names,
      img: req.results.img
   })
})

app.get('/search*', async function (req, res) {
   var toSearch = JSON.stringify(req.query).replace(/"/g, '');
   toSearch = toSearch.replace('{', '');
   toSearch = toSearch.replace(':}', '');
   
   // Fix facebook embedded ids (ends up breaking our links)
   if(toSearch.includes(':'))
      toSearch = toSearch.substring(0, toSearch.indexOf(':'))
   
   const getResults = require('./lib/fetchResults')
   const results = await getResults(toSearch);
   const resultsCount = results['id'].length;
   const link = req.query

   res.render('search', {
      name: results['name'],
      description: results['description'],
      storeCount: results['storeCount'],
      minPrice: results['minPrice'],
      id: results['id'],
      image: results['image'],
      search: toSearch,
      link: link,
      resultsCount: resultsCount,
      // Search bar header results
      names: req.results.names,
      img: req.results.img
   });
})

app.get('/viewProduct*', async function (req,res){
   var id = JSON.stringify(req.query).replace(/"/g, '');
   id = id.replace('{', '');
   id = id.substring(0, id.indexOf(':'))

   const getResults = require('./lib/loadProduct')
   const results = await getResults(id);
   // 1. get id to pass as parameter
   // 2. change url to product name
   res.render('product', {
      productID: id,
      productName: results.productName,
      productImage: results.productImage,
      productBrand: results.productBrand,
      productColor: results.productColor,
      productStorage: results.productStorage,
      productInches: results.productInches,
      productDescription: results.productDescription,

      storeProductName: results.storeProductName,
      storePrice: results.storePrice,
      storeLink: results.storeLink,
      storeAvailability: results.storeAvailability,
      storeDelivery: results.storeDelivery,
      storeID: results.storeID,
      storesInfo: results.storesInfo,

      planName: results.planName,
      planProduct: results.planProduct,
      planUpfront: results.planUpfront,
      planMonthly: results.planMonthly,
      planData: results.planData,
      planMinutes: results.planMinutes,
      planMessages: results.planMessages,
      planLink: results.planLink,
      planStoreID: results.planStoreID,
      planAvailability: results.planAvailability,

      optionsIDs: results.optionsIDs,  // Array that contains id for each option(color, storage) 
      storageOptions: results.storageOptions,
      colorOptionImages: results.colorOptionImages,
      colorOptions: results.colorOptions,

      link: req.url,
      // Search bar header results
      names: req.results.names,
      img: req.results.img
   })
})

app.get('/login', function(){

})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(https_options, app);

httpServer.listen(8000);
httpsServer.listen(8443);
