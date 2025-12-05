const searchBtn = document.querySelector(".searchBtn");
const inputSearch = document.querySelector("#searchInput");
const mealsHolder = document.querySelector(".mealsHolder");
const mainMealDetail = document.querySelector(".mainDetail");
const TheMainDiv = document.querySelector('.meal-info-holder')
let storeMealData;
searchBtn.addEventListener("click", mealInfoFunc);
function mealInfoFunc() {
  let mealName = inputSearch.value.trim();
  if (!mealName) return;
  searchBtn.disabled = true;
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    .then((res) => {
      if (!res.ok) throw new Error("no response");
      return res.json();
    })
    .then((res) => {
      if (!res.meals) {
       throw new Error('mael not found ')
      }
      return showMealsFunc(res);
    })
    .then((res) => {
      showResultInTheDomFunc(res);
      showRecipeFunc(storeMealData);
    })
    .catch(() => showErr("meal not found"))
    .finally(() => (searchBtn.disabled = false));
}
// function to show error message
function showErr(msg) {
  // mainMealDetail.textContent = ''
  mealsHolder.classList.remove('hidden')
  mealsHolder.innerHTML = `<h3>${msg}</h3>`
}
// functon to make meal structer
function showMealsFunc(data) {
  // storeMealData = data
  let mealsStructers = "";
  let mealsInfo = Object.values(data.meals);
  storeMealData = mealsInfo;
  mealsInfo.forEach((Meal, index) => {
    mealsStructers += `<div class='${Meal.strMeal}' id='${"meal-" + index}'>
                                <div class ='imageHolder'>
                                    <img src="${Meal.strMealThumb}" alt="${
      Meal.strMeal
    }">
                                </div>
                                <div class = 'clickMeal mealInfo' id='${
                                  Meal.idMeal
                                }'>
                                    <p class ='meal name'>${Meal.strMeal}</p>
                                    <p class = 'meal area'>${Meal.strArea}</p>
                                </div>
                        </div>`;
  });
  return mealsStructers;
}
//functon to show the result in the dom
function showResultInTheDomFunc(data) {
  mealsHolder.classList.remove("hidden");
  mealsHolder.innerHTML = data;
}

// function to show how to make the dish
function showRecipeFunc(mealsData) {
  const clickedMeal = document.querySelectorAll(".clickMeal");
  clickedMeal.forEach((meal) => {
    meal.addEventListener("click", () => {
      const mealId = meal.id;
      filterMeal(mealId);
    });
  });
}
//function to filter the meal
function filterMeal(mealId) {
  chosingMeal = storeMealData.find((meal) => {
    return meal.idMeal === mealId;
  });
  showMealInfo(chosingMeal);
}
//function to show the meal recipe
let recipInstructionseDiv;
let instractionHolder;
let closeBtnOne;
let btnClose;
let instractionTmplate;
let mealDetailHolder;
function showMealInfo(chosingMeal) {
  let mealDetail = `<div class ='mealDetailHolder'>
                            <div class = 'iconDiv'>
                                               <button id = ${chosingMeal.idMeal} class ='iconCloseOne btnClose'><i class="fa-solid fa-xmark"></i></button>
                                          </div>
                          <div class='currentMeal ${chosingMeal.strMeal}'>
                              <div>
                                      <div class ='imageHolder'>
                                          <img src="${chosingMeal.strMealThumb}" alt="${chosingMeal.strMeal}">
                                      </div>
                                      <div class ='clickMeal mealInfo' id='${chosingMeal.idMeal}'>
                                          <p class ='mealname'>${chosingMeal.strMeal}</p>
                                          <p class ='mealarea'>${chosingMeal.strArea}</p>
                                      </div>
                              </div>
                          </div>
                          <div class ='ingredientHolder'>
                            <div class ='detail'></div>
                          </div> 
        
                      </div>
                        `
  instractionTmplate = ` <div class ='recipInstructionseDiv'>
                                          <div class = 'iconDiv'>
                                               <button id = ${chosingMeal.idMeal} class ='icon btnClose'><i class="fa-solid fa-xmark"></i></button>
                                          </div>
                                          <div class = 'instractionHolder'></div>
                          </div>   `
      
  // creating ingredient
  let ingredientDetail = "";
  for (let i = 1; i <= 20; i++) {
    ingredientDetail += `<li><div class ='ingredient ingredient-${i}'>
                                  <span>${
                                    chosingMeal[`strMeasure${i}`]
                                  }</span><p> ${
      chosingMeal[`strIngredient${i}`]
    }
                              </p></div></li>`;
  }
  // creating teh recipe button
  let reciptBtnDivHolder = document.createElement("div");
  reciptBtnDivHolder.classList = "divForRecipeBtnHolder";
  let recipeBtn = document.createElement("button");
  recipeBtn.textContent = "recipe";
  recipeBtn.classList = "recipeBtn";
  recipeBtn.id = chosingMeal.idMeal;
  reciptBtnDivHolder.appendChild(recipeBtn);
  //insert the first template to mealdiv
  mainMealDetail.insertAdjacentHTML("afterbegin", mealDetail);
  mealDetailHolder = document.querySelector(".mealDetailHolder");
  const ingredientContainer = document.querySelector(".ingredientHolder");
  const ingredientHolder = document.querySelector(".ingredientHolder .detail");
  closeBtnOne = document.querySelector(".iconCloseOne");
  ingredientHolder.insertAdjacentHTML("beforeend", ingredientDetail);
  // ingredientHolder.insertAdjacentHTML("beforeend", reciptBtnDivHolder);
  let IngredientDivs = document.querySelectorAll(".ingredient");
  recipInstructionseDiv = document.querySelector(".recipInstructionseDiv");
  btnClose = document.querySelector(".icon");
  removeEmptyDivs(IngredientDivs);
  buttonRecipeFunc(recipeBtn, chosingMeal);
  ingredientContainer.appendChild(reciptBtnDivHolder);
  closeDivBtnFunc();
  //appending the button recipe
}
// function to remove empty divs
function removeEmptyDivs(divs) {
  // console.log(divs)
  document.querySelectorAll(".ingredient span").forEach((span) => {
    if (span.textContent.trim() !== "") {
      span.classList.add("styledSpan");
    }
  });
  divs.forEach((div) => {
    const span = div.querySelector("span");
    const p = div.querySelector("p");
    if (
      !span ||
      (span.textContent.trim() === "" && !p) ||
      p.textContent.trim() === ""
    ) {
      div.parentElement.remove();
    }
  });
}
// function when i click on the recipe button
let MealInstructionseDiv;
function buttonRecipeFunc(recipeBtn, chosingMeal) {
  MealInstructionseDiv = `<p>${chosingMeal.strInstructions}</p>`;
  recipeBtn.addEventListener("click", () => {
    // recipInstructionseDiv.classList.remove("hidden");
    mainMealDetail.insertAdjacentHTML('beforeend',instractionTmplate)
    instractionHolder = document.querySelector(".instractionHolder");
    instractionHolder.insertAdjacentHTML("beforeend", MealInstructionseDiv);
    // instractionHolder.textContent = "";
  });
}

//function for btnclose
function closeDivBtnFunc() {
  TheMainDiv.addEventListener('click',(itm)=>{
    if (!itm.target.closest('.btnClose')) return;
    itm.target.closest('.btnClose').parentElement.parentElement.remove()
  })
}
