const searchBtn = document.querySelector('.searchBtn')
const inputSearch = document.querySelector('#searchInput')

searchBtn.addEventListener('click',mealInfoFunc)
function mealInfoFunc(){
    fetch('http://www.themealdb.com/api/json/v1/1/search.php?s=big mac').then(res => {
        if(!res.ok) throw new Error('no response from fetch')
        return res.json()
    }).then(res=>console.log(res))
}