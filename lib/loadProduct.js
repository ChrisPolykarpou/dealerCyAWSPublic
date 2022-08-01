const db = require('./config/db');
const connection = db.connection;

// get promises instead of using callbacks
const util = require('util')
const queryCallback = connection.query.bind(connection)
const queryPromise = util.promisify(queryCallback) // now this returns a promise we can "await"

async function viewProduct(id){
    const product = "SELECT * FROM apple WHERE id = ?"; 
    const stores = "SELECT * FROM stores WHERE prodID= ?";
    const plansSQL = "SELECT * FROM plans WHERE prodID= ?";
    
    const productData = await queryPromise(product, [id]);
    const rows = await queryPromise(stores, [id]);
    const plans = await queryPromise(plansSQL, [id]);

    // transform product info using map()
    const productName = productData[0].name
    const productImage = productData[0].imageLink.replace('-m', '-l')
    const productBrand = productData[0].brand
    const productColor = productData[0].color
    const productStorage = productData[0].storage
    const productInches = productData[0].inches
    const productDescription = productData[0].description
    
    // sort stores by price ASC
    rows.sort((firstItem, secondItem) => firstItem.price - secondItem.price);
    // transform data for each store into arrays using map()
    const storeProductName = rows.map(row => row.title.replace('"', ''))
    const storePrice = rows.map(row => row.price)
    const storeLink = rows.map(row => row.link)
    const storeAvailability = rows.map(row => row.availability)
    const storeDelivery = rows.map(row => row.delivery)
    const storeID = rows.map(row => row.shopID)

    // Get Mobile-plans
    plans.sort((firstItem, secondItem) => ((firstItem.perMonthCost*24)+firstItem.upfrontCost) - ((secondItem.perMonthCost*24)+secondItem.upfrontCost));
    const planName = plans.map(plan => plan.planTitle);
    const planProduct = plans.map(plan => plan.title)
    const planUpfront = plans.map(plan => plan.upfrontCost);
    const planMonthly = plans.map(plan => plan.perMonthCost);
    const planData = plans.map(plan => plan.data);
    const planMinutes = plans.map(plan => plan.minutes);
    const planMessages = plans.map(plan => plan.messages);
    const planLink = plans.map(plan => plan.link);
    const planStoreID = plans.map(plan => plan.shopID);
    const planAvailability = plans.map(plan => plan.availability)

    // Get each store's info
    const storeInfoSQL = "SELECT * FROM storeInfo";
    var storesInfo = [];
    storesInfo.push(await queryPromise(storeInfoSQL))

    // STORAGE OPTIONS ****
    var storageOptions = false
    // Store this product's storage and colour
    if(productName.includes('GB') || productName.includes('TB') ){
        var storage = productStorage.toString();
        var token = productName.split(' ');
        if(storage < 1000)
            storage = storage + "GB";
        else{
            if(storage.charAt(1)!=0)
                storage = storage.charAt(0) + storage.charAt(1) + "TB";
            else
                storage = storage.charAt(0) + "TB";
        }
            
        var thisColor = productColor;
        var thisStorage = storage;
        var storageOptions = true;  // enable options for storage

        // Fix string for query search to find all
        // colours, storage and network from database
        var stop = -1;
        var queryProduct = "";
        token.forEach((element, index) => {
            if(element == thisStorage){
                stop = index;
            }
            if(stop!=-1)
                return;
            queryProduct = queryProduct +" "+ element;
        });
        queryProduct = queryProduct.trim() + " ";
        thisStorage = productStorage;
        // Search database for colours, storage and network info
        const getOptionsSQL = "SELECT * FROM apple WHERE name LIKE ?";
        const options = await queryPromise(getOptionsSQL, ['%'+queryProduct+'%']);
        
        var storageArr = [], colorArr = [], idArr = [], colorArrCheck = [];
        options.forEach(function(result){
            token = result.name.split(' ');

            // Store storage
            storage = String(result.storage);
            if(storage < 1000)
                storage = storage + "GB";
            else
                storage = storage[0] + "TB";

            // Check if specs is for the same product
            // if not continue to the next element
            if(token[stop] != storage)
                return;
            // Store values
            if(!storageArr.includes(result.storage))
                storageArr.push(result.storage);
            if(!colorArrCheck.includes(result.color)){
                colorArrCheck.push(result.color);
                colorArr.push(result.imageLink);
            }
            idArr.push({id: result.id ,color: result.color, storage: result.storage});
            // console.log(result.name)
        })

        // sort integers (storage)
        storageArr.sort(function(a, b) {
            return a - b;
          });
        
    }
    // Return info for product + each store's data(array)
    return {
        productName: productName,
        productImage: productImage,
        productBrand: productBrand,
        productColor: productColor,
        productStorage: productStorage,
        productInches: productInches,
        productDescription: productDescription,

        storeProductName: storeProductName,
        storePrice: storePrice,
        storeLink: storeLink,
        storeAvailability: storeAvailability,
        storeDelivery: storeDelivery,
        storeID: storeID,
        storesInfo: storesInfo,

        optionsIDs: idArr,  // Array that contains id for each option(color, storage) 
        storageOptions: storageArr,
        colorOptionImages: colorArr,
        colorOptions: colorArrCheck,

        planName: planName,
        planProduct: planProduct,
        planUpfront: planUpfront,
        planMonthly: planMonthly,
        planData: planData,
        planMinutes: planMinutes,
        planMessages: planMessages,
        planLink: planLink,
        planStoreID: planStoreID,
        planAvailability: planAvailability,
    }
}

module.exports = viewProduct;