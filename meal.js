const searchBtn = document.querySelector(".searchBtn");
const inputSearch = document.querySelector("#searchInput");
const mealsHolder = document.querySelector(".mealsHolder");
const mainMealDetail = document.querySelector('.mainDetail')
let storeMealData;
searchBtn.addEventListener("click", mealInfoFunc);
function mealInfoFunc() {
  let mealName = inputSearch.value.trim();
  if (!mealName) return;
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    .then((res) => {
      if (!res.ok) throw new Error("no response from fetch");
      return res.json();
    })
    .then((res) => {
      if (!res.meals) {
        showErr("meal not found ");
        return;
      }
      return showMealsFunc(res);
    }).then(res=>{
      showResultInTheDomFunc(res)      
      showRecipeFunc(storeMealData)
    })
    .catch(() => showErr("someting went rong"));
}
// function to show error message
function showErr(msg) {
  console.log(msg);
}
// functon to make meal structer
function showMealsFunc(data) {
  console.log(data)
  // storeMealData = data
  let mealsStructers = "";
  let mealsInfo = Object.values(data.meals);
  storeMealData = mealsInfo
  mealsInfo.forEach((Meal,index) => {
   mealsStructers += `<div class='${Meal.strMeal}' id='${'meal-'+index}'>
                                <div class ='imageHolder'>
                                    <img src="${
                                      Meal.strMealThumb
                                    }" alt="${Meal.strMeal}">
                                </div>
                                <div class = 'clickMeal mealInfo' id='${Meal.idMeal}'>
                                    <p class ='meal name'>${Meal.strMeal}</p>
                                    <p class = 'meal area'>${Meal.strArea}</p>
                                </div>
                        </div>`
  })
  return mealsStructers ;
}
//functon to show the result in the dom
function showResultInTheDomFunc(data){
  mealsHolder.classList.remove('hidden')
  mealsHolder.innerHTML = data
}

// function to show how to make the dish
function showRecipeFunc(mealsData){
  const clickedMeal = document.querySelectorAll('.clickMeal')
  clickedMeal.forEach(meal =>{
    meal.addEventListener('click',()=>{
      const mealId = meal.id
      filterMeal(mealId)
    })
  })

}
//function to filter the meal 
function filterMeal(mealId){
  chosingMeal = storeMealData.find(meal =>{
    return meal.idMeal === mealId
  })
  showMealInfo(chosingMeal)
}
//function to show the meal recipe
let recipInstructionseDiv;
let btnClose ;
function showMealInfo(chosingMeal){

  let mealDetail = `<div class ='mealDetailHolder'>
                          <div class='currentMeal ${chosingMeal.strMeal}'>
                              <div>
                                      <div class ='imageHolder'>
                                          <img src="${
                                            chosingMeal.strMealThumb
                                          }" alt="${chosingMeal.strMeal}">
                                      </div>
                                      <div class ='clickMeal mealInfo' id='${chosingMeal.idMeal}'>
                                          <p class ='mealname'>${chosingMeal.strMeal}</p>
                                          <p class ='mealarea'>${chosingMeal.strArea}</p>
                                      </div>
                              </div>
                          </div>
                          <div class ='ingredientHolder'>
                          </div> 
                          <div class ='recipInstructionseDiv hidden'>
                                          <div class = 'iconDiv'>
                                               <button id = ${chosingMeal.idMeal} class ='icon'><i class="fa-solid fa-xmark"></i><button>
                                          </div>
                          </div>           
                      </div>
                        `
        // creating ingredient 
        let ingredientDetail = '';
        for(let i=1 ; i <= 20 ; i++){
          ingredientDetail += `<li><div class ='ingredient ingredient-${i}'>
                                  <span>${chosingMeal[`strMeasure${i}`]}</span><p> ${chosingMeal[`strIngredient${i}`]}
                              </p></div></li>`
        }
        // creating teh recipe button
        let reciptBtnDivHolder = document.createElement('div')
        reciptBtnDivHolder.classList = 'divForRecipeBtnHolder'
        let recipeBtn = document.createElement('button')
        recipeBtn.textContent = 'recipe'
        recipeBtn.classList = 'recipeBtn'
        recipeBtn.id = chosingMeal.idMeal
        reciptBtnDivHolder.appendChild(recipeBtn)
        //insert the first template to mealdiv
        mainMealDetail.insertAdjacentHTML('afterbegin',mealDetail)
        const mealDetailHolder = document.querySelector('.mealDetailHolder')
        const ingredientHolder = document.querySelector('.ingredientHolder') 
        ingredientHolder.insertAdjacentHTML('beforeend',ingredientDetail)
        let IngredientDivs = document.querySelectorAll('.ingredient')
        recipInstructionseDiv = document.querySelector('.recipInstructionseDiv')
        btnClose = document.querySelector('.icon')
        removeEmptyDivs(IngredientDivs)
        buttonRecipeFunc(recipeBtn,chosingMeal)
        mealDetailHolder.appendChild(reciptBtnDivHolder)
        closeDivBtnFunc()
        //appending the button recipe
}
// function to remove empty divs
function removeEmptyDivs(divs){
  // console.log(divs)
  document.querySelectorAll('.ingredient span').forEach(span=>{
    if(span.textContent.trim() !== ''){
      span.classList.add('styledSpan')
    }
  })
  divs.forEach(div=>{
    const span = div.querySelector('span')
    const p = div.querySelector('p')
    if(!span|| span.textContent.trim()=== '' && !p|| p.textContent.trim()=== ''){
      div.parentElement.remove()
    }
  })
}
// function when i click on the recipe button 
function buttonRecipeFunc(Btn,chosingMeal,){
  let MealInstructionseDiv =`<p>${chosingMeal.strInstructions}</p>` 
  Btn.addEventListener('click',()=>{
    recipInstructionseDiv.classList.remove('hidden')
    recipInstructionseDiv.insertAdjacentHTML('beforeend',MealInstructionseDiv)
  })
}

//function for btnclose
function closeDivBtnFunc(){
  btnClose.addEventListener('click',()=>{
    console.log('you just presset the close button')
        recipInstructionseDiv.classList.add('hidden')
    // btnClose.parentElement.parentElement.remove()
  })
}

