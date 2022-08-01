{/* <a class="btn-floating btn-flat right white">
    .<img class="back-icon" id="${card.id}" src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="add-to-favourites">
</a> */}

// split strings into arrays
var idArr = id.split(",")
var nameArr = name.split(",");
var descriptionArr = description.split(",");
var imageArr = image.split(",");
var count = storeCount.split(",");
var lowPrice = minPrice.split(",");
var length = idArr.length;
descriptionArr[0] = descriptionArr[0].substring(1)
var cards = idArr.map((id, index) => {
    return {
        id: id,
        name: nameArr[index],
        image: imageArr[index],
        description: descriptionArr[index].substring(5),
        count: count[index], 
        minPrice: lowPrice[index]
    }
});

var productsExist = true;
// defining variable to retrieve the html strings
let htmlCode = ``, htmlCodeLast=``;

// Check if no products are found
if(cards[0].id == ""){
    productsExist = false;
    htmlCode=
    `
    <i class="material-icons">terst</i>
    
    <h4>We're sorry. We were not able to find a match.</h4>
    <p> -> Check for typos or spelling errors</p>
    <p> -> Try more general keywords</p>

    `
}
if(productsExist){
    // dynamically create cards
    // sort cards by popularity (max stores that have the product shows first)
    cards.sort((firstItem, secondItem) => secondItem.count - firstItem.count);
    cards.forEach(function(card){
        if(card.minPrice == 0){
            if(card.name.length > 43){
                card.name = card.name.substring(0, 43) + "...";
            }
            
            htmlCodeLast =
                htmlCodeLast +
                `
                    <div class="col s6 m4 l3 xl3">
                    <div class="card product-box">
                        
                        <div class="card-image img-box">
                            <a href="/viewProduct?${card.id}&${card.name}">
                            <img alt="${card.name}" src="${card.image}"></a>
                        </div>
                        <div onclick="location.href='/viewProduct?${card.id}&${card.name}';" style="cursor: pointer;" class="card-content box-info">
                            <h1 class="title">${card.name}</h1>
                            <p class="grey-text lighten-2 descriptionBox">${card.description}</p>
                            
                        </div>
                        <div class="card-action">
                            <div class="priceInfo">
                                <p class=truncate>No stores matched</p>
                                <a class="truncate" href="/viewProduct?${card.id}">View Product</a>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        }
        else{
            if(card.name.length > 43){
                card.name = card.name.substring(0, 43) + "...";
            }
            
            htmlCode =
                htmlCode +
                `
                    <div class="col s6 m4 l3 xl3">
                    <div class="card product-box">
                        
                        <div class="card-image img-box">
                            <a href="/viewProduct?${card.id}&${card.name}">
                            <img alt="${card.name}" src="${card.image}"></a>
                        </div>
                        <div onclick="location.href='/viewProduct?${card.id}&${card.name}';" style="cursor: pointer;" class="card-content box-info">
                            <h1 class="title">${card.name}</h1>
                            <p class="grey-text lighten-2 descriptionBox">${card.description}</p>
                            
                        </div>
                        <div class="card-action">
                            <div class="priceInfo">
                                <p>From <b>${card.minPrice} €</b></p>
                                <a href="/viewProduct?${card.id}">In ${card.count} Shops</a>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        }
        
    });
}

// add last elements (products that did not match any stores)
htmlCode = htmlCode+htmlCodeLast;
const htmlCards = document.querySelector(".product");

// render html
htmlCards.innerHTML = htmlCode;

$(window).load(function () {
    $('.loader').hide();
    $('#content').removeClass('main-box hide').addClass('main-box');
    $('label[for=autocomplete-input]').remove();
    $('.tooltipped').tooltip();
    $("#autocomplete-input").val(searchTitle);
    $("#autocomplete-input-mob").val(searchTitle);
});