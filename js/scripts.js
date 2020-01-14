var pokemonRepository =(function(){
  var repository= [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $pokemonList =$('ul');
  var $modalContainer = $("#modal-container");

//adding new pokemon to var repository//
  function add(pokemon) {
  repository.push(pokemon);
  }

  function getAll() {
  return repository;
 }

//funcion to add a list for each pokemon object//
    function addListItem(pokemon){
    var $button = $('<button type="button" class="btn btn-secondary btn-lg btn-block"> '+pokemon.name+' </button>');
    var $li = $('<li></li>');
    $pokemonList.append($li);
    $li.append($button);
    $('button').on("click",function(){
    showDetails(pokemon);
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
  $modalContainer.html("");

  var modal = $("<div></div>");
  $("<div></div>").addClass("modal");

 var $closeButtonElement = $('<button type ="button" class="modal-close">'+close+'</button>');
$("<button></button>").on("click", hideModal());
$("modal").append($closeButtonElement);

var $nameElement=$("h1");
$nameElement.html(item.name);
$("modal")append($nameElement);


$modalContainer.addClass("is-visible");
$("modal").append("modalContainer");
}

function hideModal() {
  $modalContainer.removeClass("is-visible")
}

function showDetails(repository){
pokemonRepository.loadDetails(repository).then(function(){
showModal(repository);
});
}

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
