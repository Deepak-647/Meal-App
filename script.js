//it will make an favourite meals array if doesn't exist in localStorage
if (localStorage.getItem("favouriteList") == null) {
  localStorage.setItem("favouriteList", JSON.stringify([]));
}
//it will fetch meals from api and return it
async function fetchMealsFromApi(url, value) {
  const response = await fetch(`${url + value}`);
  const meals = await response.json();
  return meals;
}

//fetching the url
async function showMealList() {
  let inputValue = document.getElementById("input-field").value;
  // console.log(inputValue);
  let arr = JSON.parse(localStorage.getItem("favouriteList"));
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let html = "";
  let meals = fetchMealsFromApi(url, inputValue);
  meals.then((data) => {
     
    if (data.meals) {
      data.meals.forEach((element) => {
        console.log(element);
        let isFav = false;
        for (let index = 0; index < arr.length; index++) {
          if (arr[index] == element.idMeal) {
            isFav = true;
          }
        }
        if (isFav) {
          html += `
            <div id="movie-card" class="movie-card">
              <img src="${element.strMealThumb}" class="card-img-top" alt="...">
              <div class="card-body">
                  <h2 class="card-title">${element.strMeal}</h2>
                  <div class="buttons">
                    <button type="button id="details-button" class="details-button" onclick="showMealDetails(${element.idMeal})">More details</button>
                    <button  id="main${element.idMeal}" class="like-button" onclick="addRemoveToFavList(${element.idMeal})">
                    <i class="fa-solid fa-heart" style="color: #c61515;"></i>
                    </button>
                  </div>
              </div>
            </div>
              `;
        } else {
          html += `
              <div id="movie-card" class="movie-card">
              <img src="${element.strMealThumb}" class="card-img-top" alt="...">
              <div class="card-body">
                  <h2 class="card-title">${element.strMeal}</h2>
                  <div class="buttons">
                    <button type="button id="details-button" class="details-button" onclick="showMealDetails(${element.idMeal})">More details</button>
                    <button  id="main${element.idMeal}" class="like-button" onclick="addRemoveToFavList(${element.idMeal})">
                    <i class="fa-solid fa-heart fa-beat"></i>
                    </button>
                  </div>
              </div>
             </div>
              `;
        }
      });
    } else {
      html += `
        <div class="container">
                <span>404</span>
                <div class="error">
                    The meal you are looking for was not found.
                </div>
             
         
    </div>
        `;
    }
    document.getElementById("results-container").innerHTML = html;

    
  });
}

 

// it will show full meal details
async function showMealDetails(id) {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  await fetchMealsFromApi(url, id).then((data) => {
    html += ` 
        <div class ="meal-details-container">
          <button id="close-btn" class="close-btn"><img src="https://img.icons8.com/ios-filled/50/null/multiply.png"/></button>
          <div  class="meal-details-highlight">
            <div class="meal-thumbail">
                <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
              </div>
            <div class="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h4>Category : ${data.meals[0].strCategory}</h4>
                <h4>Area : ${data.meals[0].strArea}</h4>

                <div class="text-center">
                <a href="${data.meals[0].strYoutube}" target="_blank">Watch Video</a>
                </div>                

            </div>
          </div>
            <div  class="meal-instruction">
              <h5 class="text-center">Instruction :</h5>
              <p>${data.meals[0].strInstructions}</p>
              
            </div>
           
      </div>
        
      `;
  });
  document.getElementById("results-container").innerHTML = html;

  //Ths is the close button of the receipe
  let closeBtn = document.getElementById("close-btn");

  closeBtn.addEventListener("click", function () {
    document.getElementById("results-container").innerHTML = "";
  });
}
//it shows all favourites
async function showFavMealList() {
  let arr = JSON.parse(localStorage.getItem("favouriteList"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  if (arr.length == 0) {
    html += `
  
     
      <div class="fav-error">
        <span>404</span>
        <p> No meal added in your favourites list.</p>
      </div>
    </div>
   
    `;
  } else {
    for (let index = 0; index < arr.length; index++) {
      await fetchMealsFromApi(url, arr[index]).then((data) => {
       console.log("favlist",data)
        html += ` 
        
        <div class="favlist-card">
            <div class="img-thumb">
             <img src="${data.meals[0].strMealThumb}" alt="receipe-img" srcset="">
            </div>
              <div class="fav-list-desc">
                  <h5>${data.meals[0].strMeal}</h5>
                  <button onclick="showMealDetails(${data.meals[0].idMeal})">Show details</button>
              </div>
              <button class="unfav-btn" onclick="addRemoveToFavList(${data.meals[0].idMeal})"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
         
        `;
      });
    }
  }
  document.getElementById("fav-list-body").innerHTML = html;

  //grabbing the favourite list
  let favListContainer =document.getElementById('fav-list');

 

//this is to show the favourite list
  let favListBtn =document.getElementById('favourite-list-btn');
  favListBtn.addEventListener("click",function(){
    favListContainer.style.display = 'block';
  })
 

  //this is to close favourite list
  let favCloseBtn = document.getElementById("fav-close-btn");
  favCloseBtn.addEventListener("click", function () {
    favListContainer.style.display = 'none';
  });
}

//it will add or remove favourite meal to list
function addRemoveToFavList(id){
  let arr =JSON.parse(localStorage.getItem("favouriteList"));
  let contain =false ;
  for (let index=0; index<arr.length ;index++){
    if (id == arr[index]) {
      contain = true;
    }

  }
    if(contain){
      let number = arr.indexOf(id);
      arr.splice(number,1);
      // alert("your meal removed from your favourites list");
    }else{
      arr.push(id);
    // alert("Added to favourites list");
    }
    localStorage.setItem("favouriteList", JSON.stringify(arr));
    showMealList();
   showFavMealList();
}