// Render stores dynamically
var storeProductName = storeProductName.split(',');
var storeLink = storeLink.split(',');
var storeID = storeID.split(',');
var storePrice = storePrice.split(',');
var storeAvailability = storeAvailability.split(',')
var storeDelivery = storeDelivery.split(',')

var planName = planName.split(',');
var planProduct = planProduct.split(',');
var planUpfront = planUpfront.split(',');
var planMonthly = planMonthly.split(',');
var planData = planData.split(',');
var planMinutes = planMinutes.split(',');
var planMessages = planMessages.split(',');
var planLink = planLink.split(',');
var planStoreID = planStoreID.split(',');
var planAvailability = planAvailability.split(',');

var storageOptions = storageOptions.split(',')
var colorOptions = colorOptions.split(',')
var colorOptionImages = colorOptionImages.split(',')
var optionsIDs = optionsIDs.replaceAll('&#34:', ' ')
optionsIDs = optionsIDs.replaceAll('&#34;', '')
optionsIDs = optionsIDs.replaceAll('[[', '')
optionsIDs = optionsIDs.replaceAll(']]', '')
optionsIDs = optionsIDs.split('}') 

var fixedString = storesInfo.replaceAll('&#34;:',' ')
fixedString = fixedString.replaceAll('&#34;', '')
fixedString = fixedString.replaceAll('[[', '')
fixedString = fixedString.replaceAll(']]', '')
var storesInfo = fixedString.split('}')

// vars to use for rendering
let html="", htmlSmall="", htmlOptions="", htmlOptionsSmall="", temp="", temp2=""

if(storageOptions.length>0){
    // Get colours to render
    colorOptionImages.forEach((img, index) => {
        if(colorOptions[index] == productColor){
            temp = temp +
            `
            <option selected value="${colorOptions[index]}" data-icon="${img}" class="left">${colorOptions[index]}</option>
            `
        }
        else{
            temp = temp +
            `
            <option value="${colorOptions[index]}" data-icon="${img}" class="left">${colorOptions[index]}</option>
            `
        }
    })
    // Get storage to render
    storageOptions.forEach((gb, index) => {
        if(storageOptions[index] == productStorage){
            temp2 = temp2 +
            `
            <option value="${gb}" selected>${gb}</option>
            `
        }
        else{
            temp2 = temp2 +
            `
            <option value="${gb}">${gb}</option>
            `
        }
    })

    // RENDER OPTIONS
    htmlOptions = htmlOptions +
    `
    <div class="row hide-on-small-only option-box left">
    <div class="input-field col s8">
        <select id="colorSelection1"class="icons">
            `
            +temp+
            `
        </select>
        <label>Colour</label>
    </div>
    <div class="input-field col s8">
        <select id="storageSelection1">
            `
            +temp2+
            `
        </select>
        <label>Storage</label>
    </div>
    </div>
    `

    htmlOptionsSmall = htmlOptionsSmall +
    `
    <div class="row header-mobile">
    <div class="input-field col s6">
        <select id="colorSelection"class="icons">
            `
            +temp+
            `
        </select>
        <label>Colour</label>
    </div>
    <div class="input-field col s6">
        <select id="storageSelection">
            `
            +temp2+
            `
        </select>
        <label>Storage</label>
    </div>
    </div>
    `
}

// RENDER SHOPS
storeID.forEach((storeID, index) => {
    if(storeID == "")
        return;
    var storeName = getStoreInfo(storeID)[0];
    var storesLogo = getStoreInfo(storeID)[1];
    
    // Render html for availability
    var availability = storeAvailability[index]
    if(availability == 'Y')
        availability = '<p"><i class="tiny material-icons green-text">check_circle</i> Available</p>'
    else
        availability = '<p"><i class="tiny material-icons">info</i> Check directly</p>'
    // Render html for delivery
    var delivery = storeDelivery[index]
    if(delivery == 'Free')
        delivery = '<p>Delivery: Free</p>'
    else if(delivery == '' || delivery == '?')
        delivery = '<p>Delivery: Unknown</p>'
    else
        delivery = '<p>Delivery: €'+delivery+'</p>'

    html = html +
    `
    <tr>
        <td class="store-logo-box">
            <img class="responsive-img store-logo" src="${storesLogo}">
        </td>
        <td class="comparison-box">
            <a class="black-text" id="${storeName}" href="${storeLink[index]}" target="_blank"><h5 class="titleText" id="${storeName}">${storeProductName[index]}</h5></a>
            ${availability}
        </td>
        <td class="price-section">
            <div class="right">
                <sub>${storeName}</sub>
                <p>Price: <b>€${storePrice[index]}</b></p>
                ${delivery}
                <a rel=”canonical” id="${storeName}" href="${storeLink[index]}" target="_blank" class="btn z-index-0 truncate black" name="button">Find At Store</a>
            </div>
        </td>
    </tr>
    `
    // Render For mobile View
    htmlSmall = htmlSmall+
    `
    <tr>
        <td>
            <img class="responsive-img store-logo" src="${storesLogo}">
            <a class="black-text" id="${storeName}" href="${storeLink[index]}" target="_blank"><h6 class="titleText" id="${storeName}">${storeProductName[index]}</h6></a>
            ${availability}
        </td>
        <td class="price-sectionMob right">
            <sub>${storeName}</sub>
            <p>Price: <b>€${storePrice[index]}</b></p>
            ${delivery}
            <a rel=”canonical” id="${storeName}" href="${storeLink[index]}" target="_blank" class="btn z-index-0 truncate black" name="button">Find At Store</a>
        </td>
    </tr>
    `
});

// RENDER MOBILE-PLANS
var plansHtml = '', plansHtmlSmall='';
if(planName[0]!=""){
    planStoreID.forEach((planStoreID, index) => {
        var tip=''
        if(planData[index].includes('Unlimited GB (10')){
            planData[index] = 'UNLIMITED';
            var tip = "10 Mbps Download";
        }
        if(planData[index].includes('Unlimited GB (30')){
            planData[index] = 'UNLIMITED';
            var tip = "30 Mbps Download";
        }
        if(planData[index].includes('Unlimited GB (M')){
            planData[index] = 'UNLIMITED';
            var tip = "Maximum Speed Available";
        }
        if(planData[index].includes('2 GB + 1 GB')){
            planData[index] = '3 GB';
        }
        if(planAvailability[index] == 'Y')
            var availability = '<p"><i class="tiny material-icons green-text">check_circle</i> Available</p>'
        else
            var availability = '<p"><i class="tiny material-icons">info</i> Check directly</p>'
        
        // Show special offer if watch is included
        var a=''
        if(planProduct[index].includes('Watch'))
            var a = '<h6 class="titleText red-text">Special Offer</h6>';
        if(storeID === undefined)
            return;
        var storeName = getStoreInfo(planStoreID)[0];
        var storesLogo = getStoreInfo(planStoreID)[1];
        plansHtml = plansHtml +
        `
        <tr>
            <td class="store-logo-box">
                <img class="responsive-img store-logo" src="${storesLogo}">
            </td>
            <td>
                <a class="black-text" id="${storeName}" href="${planLink[index]}" target="_blank"><h5 class="titleText" id="${storeName}">${planProduct[index]}</h5>${a}</a>
                ${availability}
            </td>
            <td class="truncate">
                <p>Upfront Cost: <b>€${planUpfront[index]}</b></p>
                <div class="divider"></div>
                <p>Contract Length: <b>24 Months</b></p>
                <div class="divider"></div>
                <p>Minutes&Messages: <b>${planMinutes[index]}</b></p>
                <div class="divider"></div>
            </td>
            <td>
                <div class="dataBox">
                    <p class="center dataTitle truncate">${planData[index]}</p>
                    <p class="center tip">Data</p>
                    <p class="center grey-text tip2">${tip}</p>
                </div>
            </td>
            <td>
                <div class="dataBox">
                    <p class="center dataTitle">€${planMonthly[index]}</p>
                    <p class="center tip">Per Month</p>
                </div>
            </td>
            <td>
                <div class="price-section right">
                    <b class="planName">${planName[index]}</b>
                    <p class="grey-text tip3">Handset can be adjusted.</p><br>
                    <a rel=”canonical” id="${storeName}" href="${planLink[index]}" target="_blank" class="btn z-index-0 truncate right black" name="button">Find At Store</a>
                </div>
            </td>
        </tr>
        `;

        // Small screens
        plansHtmlSmall = plansHtmlSmall +
        `
        <tr>
            <td class="truncate">
                <b class="planName">${planName[index]}</b><br>
                <p>Upfront Cost: <b>€${planUpfront[index]}</b></p>
                <div class="divider"></div>
                <p>Contract Length: <b>24 Months</b></p>
                <div class="divider"></div>
                <div class="boxMob">
                    <div class="dataBoxMob">
                        <p class="center dataTitleMob truncate">${planData[index]}</p>
                        <p class="center tipMob">Data</p>
                        <p class="center grey-text tip2Mob truncate">${tip}</p>
                    </div>
                    <div class="dataBoxMob">
                        <p class="center dataTitleMob">€${planMonthly[index]}</p>
                        <p class="center tipMob">Per Month</p>
                    </div>
                </div>
            </td>
            <td>
                <div>
                    <img class="responsive-img store-logo" src="${storesLogo}"><br>
                    <a class="black-text" id="${storeName}" href="${planLink[index]}" target="_blank"><h5 class="titleText" id="${storeName}">${planProduct[index]}</h5>${a}</a>
                    ${availability}
                    <a rel=”canonical” id="${storeName}" href="${planLink[index]}" target="_blank" class="btn z-index-0 truncate black" name="button">Find At Store</a>
                </div>
            </td>
        </tr>
        `;
    })
}

// SOME HELPER FUNCTIONS

// Function to return id of product
// using color and storage options
// if id not found, returns -1
function getID(color, storage){
    var id=-1;
    optionsIDs.forEach(option => {
      if(option.includes(color) && option.includes(storage))
        id = option.substring(option.indexOf('id:')+3, option.indexOf(',c'))
    })

    return id;
}
// This function returns name and logo of a store
// by giving as parameter shopID
function getStoreInfo(id){
    var pos;
    var len = storesInfo.length
    // find store by id
    for(var i=0; i<len; i++){
        var idTemp = storesInfo[i].substring(storesInfo[i].indexOf("id")+3, storesInfo[i].indexOf(",name"))
        if(idTemp == id){
            pos = i;
            break;
        }
    }
    // find name and logo
    var name = storesInfo[pos].substring(storesInfo[pos].indexOf('name ')+5, storesInfo[pos].indexOf(',em'))
    if(storesInfo[pos].includes('.png'))
        var logo = storesInfo[pos].substring(storesInfo[pos].indexOf('image ')+6, storesInfo[pos].indexOf('.png')+4)
    else
        var logo = storesInfo[pos].substring(storesInfo[pos].indexOf('image ')+6, storesInfo[pos].indexOf('.jpg')+4)
    return [name, logo]
}

// RENDER HTML OPTIONS
if(storageOptions){
    const selectorOptions = document.querySelector(".options");
    const selectorOptionsSmall = document.querySelector(".optionsSmall");

    selectorOptions.innerHTML = htmlOptions;
    selectorOptionsSmall.innerHTML = htmlOptionsSmall;
}

// RENDER HTML STORES
const htmlShops = document.querySelector(".store");
const htmlShopsSmall = document.querySelector(".storeSmall");

htmlShops.innerHTML = html;
htmlShopsSmall.innerHTML = htmlSmall;

// Render Mobile-plans
const htmlPlans = document.querySelector('.plans');
const htmlPlansSmall = document.querySelector(".plansSmall");

htmlPlans.innerHTML = plansHtml;
htmlPlansSmall.innerHTML = plansHtmlSmall;

var favourite = false;
$(window).load(function () {
    $('.loader').hide();
    $('#content').removeClass('main hide').addClass('main');
        $('select').formSelect();
        $('.materialboxed').materialbox();
        $('li[id^="select-options"]').on('touchend', function (e) {
            e.stopPropagation();
    });
    $('#backLink').click(function(event){
        event.preventDefault();
        history.back(1);
    });
    $('.tabs').tabs();
    if(planName.length>1){
        // activate tab
        $('#plansTab').attr('class', 'tab col s3');
        $('#plansTabMob').attr('class', 'tab col s3');
    }
    $('.tab.col.s3.disabled').on({click: function(){
        M.toast({html: "Sorry, no plans available. Consider a different color or storage option!"})
    }})
    $('#add2Favourites').on({'click': function(){
        // if(favourite == false){
        //     // Add to favourites
        //     favourite = true;
        //     $('#add2FavouritesL').attr('src','https://cdn-icons-png.flaticon.com/512/1077/1077086.png');
        //     var prodId = <?php echo json_encode($prodId); ?>;
        //     window.location.replace('../backend/user/favouriteHandler.php?add2Fav='+prodId);
        // }
        // else {
        //     // Remove from favourites
        //     $('#add2FavouritesL').attr('src','https://cdn-icons-png.flaticon.com/512/1077/1077035.png');
        //     favourite = false;
        //     var prodId = <?php echo json_encode($prodId); ?>;
        //     window.location.replace('../backend/user/favouriteHandler.php?removeFromFav='+prodId);
        // }
    }
    });
    $('#add2FavouritesL').on({
    // 'click': function(){
    //     if(favourite == false){
    //         // Add to favourites
    //         favourite = true;
    //         $('#add2FavouritesL').attr('src','https://cdn-icons-png.flaticon.com/512/1077/1077086.png');
    //         var prodId = <?php echo json_encode($prodId); ?>;
    //         window.location.replace('../backend/user/favouriteHandler.php?add2Fav='+prodId);
    //     }
    //     else {
    //         // Remove from favourites
    //         $('#add2FavouritesL').attr('src','https://cdn-icons-png.flaticon.com/512/1077/1077035.png');
    //         favourite = false;
    //         var prodId = <?php echo json_encode($prodId); ?>;
    //         window.location.replace('../backend/user/favouriteHandler.php?removeFromFav='+prodId);
    //     }
    // }
    });
    // <?php else: ?>
    // $('#add2Favourites').on({
    //     'click': function(){
    //     window.location.replace('../backend/auth/login.php');
    //     }
    // });
    // $('#add2FavouritesL').on({
    //     'click': function(){
    //     window.location.replace('../backend/auth/login.php');
    //     }
    // });
    // <?php endif; ?>
    if(storageOptions){
        $('#storageSelection').on('change', function() {
            var option =  this.value;
            var id = getID(productColor, option);
            if(id!=-1)
                window.location.replace('viewProduct?'+id+'&'+productName);
            else{
                M.toast({html: "Sorry, this option does not exist!"})
            }
        });
        $('#colorSelection').on('change', function() {
            var option =  this.value;
            var id = getID(option, productStorage);
            if(id!=-1)
                window.location.replace('viewProduct?'+id+'&'+productName);
            else{
                M.toast({html: "Sorry, this option does not exist!"})
            }
        });
        $('#storageSelection1').on('change', function() {
            var option =  this.value;
            var id = getID(productColor, option);
            if(id!=-1)
                window.location.replace('viewProduct?'+id+'&'+productName);
            else{
                M.toast({html: "Sorry, this option does not exist!"})
            }
        });
        $('#colorSelection1').on('change', function() {
            var option =  this.value;
            var id = getID(option, productStorage);
            if(id!=-1)
                window.location.replace('viewProduct?'+id+'&'+productName);
            else{
                M.toast({html: "Sorry, this option does not exist!"})
            }
        });
        // $('.load-trigger').click(function(event){
        //     // get store name
        //     var text = event.target.id;
        //     var str = 
        //     `
        //     <title>Redirecting to ${text}</title>
        //     <meta charset="utf-8">
        //     <!-- Compiled and minified CSS -->
        //     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-rc.2/css/materialize.min.css">
        //     <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        //     <!--Let browser know website is optimized for mobile-->
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        //     <link rel="stylesheet" href="../css/loader.css">
        //     <div class="redirect-loader">
        //         <div class="loader">
        //         <span></span>
        //         <span></span>
        //         <span></span>
        //         </div>
        //         <h4 class="text center">Redirecting you to <br><b class="white-text shopTitle">${text}</b></h4>
        //     </div>
        //     <style>
        //     body {
        //         margin: 0;
        //         height: 100vh;
        //         display: flex;
        //         align-items: center;
        //         justify-content: center;
        //         background: #ffd4a9;
        //     }
            
        //     .loader {
        //         animation-duration: 0s !important;
        //         -webkit-animation-duration: 0s !important;
        //         width: 16em;
        //         height: 8em;
        //         position: absolute;
        //         overflow: hidden;
        //     }
            
        //     .loader::before,
        //     .loader::after {
        //         content: '';
        //         position: absolute;
        //         bottom: 0;
        //     }
            
        //     .loader::before {
        //         width: inherit;
        //         height: 0.2em;
        //         background-color: hsla(0, 0%, 100%);
        //     }
            
        //     .loader::after {
        //         box-sizing: border-box;
        //         width: 50%;
        //         height: inherit;
        //         border: 0.2em solid hsla(0, 0%, 100%);
        //         border-radius: 50%;
        //         left: 25%;
        //     }
        //     h4{
        //       font-family: "Arial Black", "Arial Bold", Gadget, sans-serif;
        //       text-transform:uppercase;
        //       margin-top:130px;
        //       font-size: 20px;
        //     }
            
        //     .loader span {
        //         position: absolute;
        //         width: 5%;
        //         height: 10%;
        //         background-color: black;
        //         border-radius: 50%;
        //         bottom: 0.2em;
        //         left: -5%;
        //         animation: 2s linear infinite;
        //         transform-origin: 50% -3em;
        //         animation-name: run, rotating;
        //     }
        //     .shopTitle{
        //         font-size: 25px;
        //     }
            
        //     .loader span:nth-child(2) {animation-delay: 0.075s;}
        //     .loader span:nth-child(3) {animation-delay: 0.15s;}
            
        //     @keyframes run {
        //         0% {left: -5%;}
        //         10%, 60% {left: calc((100% - 5%) / 2);}
        //         70%, 100% {left: 100%;}
        //     }
            
        //     @keyframes rotating {
        //         0%, 10% {transform: rotate(0deg);}
        //         60%, 100% {transform: rotate(-1turn);}
        //     }            
        //     </style>
        //     `;
        //     $("body").html(str);

        // });
    }
});
