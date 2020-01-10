var pokemonRepository =(function(){
  var repository= [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
//  var ul = document.querySelector(".pokemon-list");
  var $pokemonList =$('ul');
  var $modalContainer =$("#modal-container");

//adding new pokemon to var repository//
  function add(pokemon) {
  repository.push(pokemon);
  }

  function getAll() {
  return repository;
 }

//funcion to add a list for each pokemon object//
    function addListItem(pokemon){
    var $li = $('<li></li>');
    $pokemonList.append($li);
    var $button = $('<button type="button" class="btn btn-secondary"> '+pokemon.name+' </button>');
    $li.append($button);
    $button.on("click",function(event){
    showDetails(pokemon);
  });
}

//function to show details of each pokemon
function showDetails(repository){
pokemonRepository.loadDetails(repository).then(function(){
 showModal(repository);
});
}



//funtion that loads pokemon list from API
function loadList() {
   return $.ajax(apiUrl, {dataType: 'json'}).then(function(responseJSON) {
     return responseJSON;
   }).then(function(json) {
     json.results.forEach(function(item) {
       var pokemon = {
         name: item.name,
         detailsUrl: item.url
       };
       add(pokemon);
     });
   }).catch(function(e) {
     console.error(e);
   });
 }


//loading details of each pokemon that is clicked
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, {dataType:'json'})
    .then(function(responseJSON){
      return responseJSON;
    }).then(function(details){
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      //item.types = Object.keys(details.types);
   if (details.types.length == 2 ) {
    item.types = [details.types[0].type.name, details.types[1].type.name];
    } else {
   item.types = [details.types[0].type.name];
    }
    }).catch(function (error) {
      console.error(error);
   });
  }



function showModal(item) {
  // Clear all existing modal content
  $modalContainer.innerHTML = "";

  var modal = document.createElement("div");
  modal.classList.add("modal");

  // Add the new modal content
  var closeButtonElement = document.createElement("button");
  closeButtonElement.classList.add("modal-close");
  closeButtonElement.innerText = "Close";
  closeButtonElement.addEventListener("click", hideModal);


var nameElement = document.createElement("h1");
nameElement.innerText = item.name.toUpperCase();

var imageElement = document.createElement("img");
imageElement.src = item.imageUrl;
imageElement.classList.add("modal-img");

var heightElement = document.createElement("p");
heightElement.innerText = "Height: " + item.height + "m";

var weightElement = document.createElement("p");
weightElement.innerText = "Weight: " + item.weight + "kg";

var typesElement = document.createElement("p");
typesElement.innerText = "Type(s): " + item.types;

modal.appendChild(closeButtonElement);
modal.appendChild(nameElement);
modal.appendChild(imageElement);
modal.appendChild(heightElement);
modal.appendChild(weightElement);
modal.appendChild(typesElement);
$modalContainer.appendChild(modal);

$("#modalContainer").addClass("is-visible");
}

function hideModal() {
  $("#modalContainer").remove("is-visible");
}


//window.addEventListener("keydown", (e) => {
//  if (e.key === "Escape" && $modalContainer.classList.contains("is-visible")) {
  //  hideModal();
//  }
//});

//$modalContainer.addEventListener("click", (e) => {
  // Since this is also triggered when clicking INSIDE the modal container,
  // We only want to close if the user clicks directly on the overlayvar target = e.target  if (target === $modalContainer) {
  //  hideModal();
  //}
//});



return {
add: add,
getAll: getAll,
addListItem: addListItem,
loadList: loadList,
loadDetails: loadDetails,
showModal:showModal,
hideModal:hideModal,
};
})();

pokemonRepository.loadList().then(function(){
pokemonRepository.getAll().forEach(function(pokemon){
pokemonRepository.addListItem(pokemon);
 });
});
