if(typeof names !== "undefined"){
  names = names.split(',');
  img = img.split(',');
  var data = toObject(names, img);
}
else{
  var data = {
    "Apple iPhone 13 pro": null,
    "Apple iPhone 13 128GB": null,
    "Xiaomi 12 pro": null,
    "Samsung a52": null,
    "Xiaomi POCO X4": null
  }
}


function toObject(arr, img) {
  var rv = {};

  rv["Apple iPhone 13 pro"] = null;
  rv["Apple iPhone 13 128GB"] = null;
  rv["Xiaomi 12 pro"] = null;
  rv["Samsung a52"] = null;
  rv["Xiaomi POCO X4"] = null;

  for (var i = 0; i < arr.length; ++i){
    rv[arr[i].substring(5, arr[i].length-5)] = img[i].substring(5, img[i].length-5);
  }

  return rv;
}


$(document).ready(function(){
    $("#autocomplete-input").attr("placeholder", "e.g. iPhone 13 or Samsung");
    $("#autocomplete-input-mob").attr("placeholder", "e.g. iPhone 13 or Samsung");
    $('input.autocomplete').autocomplete({
      data: data,
      limit: 7,
      onAutocomplete(){
        var str = $("#autocomplete-input").val();
        if(str == "")
          str = $("#autocomplete-input-mob").val();
        if(str != ""){
          window.location.replace('/search?'+str);
        }
      }
    });
    $('#homeBtn').on("click",function(){
      document.location.replace("/");
    });
    // Clear bar on click
    $('#clear-btn').click(function(){
      $("#autocomplete-input").val('');
    });
    $('#clear-btn-mob').click(function(){
      $("#autocomplete-input-mob").val('');
    });
    // Slide out sidenav
    $('.sidenav').sidenav({
      edge: 'right'
    });
  });

  // On enter
  $('#autocomplete-input').keypress(function(event) {
    if (event.keyCode == 13) {
      var str = $("#autocomplete-input").val();
      if(str != ""){
        window.location.replace('/search?'+str);
      }
    }
  });
  $('#autocomplete-input-mob').keypress(function(event) {
    if (event.keyCode == 13) {
      var str = $("#autocomplete-input-mob").val();
      if(str != ""){
        window.location.replace('/search?'+str);
      }
    }
  });

  $('#login-btn').on("click",function(){
    M.toast({html: "Sorry, this feature is not implemented yet!"})
  });

 