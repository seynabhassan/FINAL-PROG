class Food {
  constructor(foodID, foodName, qty, energy, protein, fat, fiber) {
    this.foodID = foodID;
    this.foodName = foodName;
    this.qty = qty;
    this.energy = energy;
    this.protein = protein;
    this.fat = fat;
    this.fiber = fiber;
  }

  static async fetchFoodItem() {
    try {
      const response = await fetch('https://nutrimonapi.azurewebsites.net/api/FoodItems', {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
          'X-API-Key': 168985
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.text();
      localStorage.setItem("fooditems", data);

    } catch (error) {
      console.error('Error during fetch:', error);
    }
  }
}

// food list
function populatefoodSelect() {
  let selectElement = document.getElementById("select1");
  selectElement.innerHTML = "";
  let fooditems = JSON.parse(localStorage.getItem("fooditems"))
  fooditems.forEach(function (item) {
    let option = document.createElement("option");
    option.text = item.foodName;
    option.value = item.foodID; 
    selectElement.add(option);
  });
}

//filter
function filterfoodSelect() {
  let filter = document.getElementById("filter");
  if (filter == null) return populatefoodSelect();
  let selectElement = document.getElementById("select1");
  selectElement.innerHTML = "";
  let fooditems = JSON.parse(localStorage.getItem("fooditems"))
  fooditems.forEach(function (item) {
    if(item.foodName.toLowerCase().includes(filter.value)) {
      let option = document.createElement("option");
      option.text = item.foodName;
      option.value = item.foodID; 
      selectElement.add(option);
    }
  });
}

async function getfoodData(foodID, sortkey, lkey, fqty, f) {
  try {
    const response = await fetch(`https://nutrimonapi.azurewebsites.net/api/FoodCompSpecs/ByItem/${foodID}/BySortKey/${sortkey}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json', 
        'X-API-Key': 168985
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    f[lkey] = Number(((data[0].resVal).replace(/,/g, '.') * fqty / 100).toFixed(2));

  } catch (error) {
    console.error('Error during fetch:', error);
    throw error;
  }
}

// For Converting Date YYYY-MM-DD to DD-MM-YYYY
function convertDateFormat(ymdDate) {

  let parts = ymdDate.split("-");
  let dateObject = new Date(parts[0], parts[1] - 1, parts[2]);

  let day = dateObject.getDate();
  let month = dateObject.getMonth() + 1;
  let year = dateObject.getFullYear();

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  let dmyDate = day + "-" + month + "-" + year;

  return dmyDate;
}

function compareDates(a, b) {
  let dateA = new Date(a);
  let dateB = new Date(b);

  return dateA - dateB;
}

// today date Dashboard, nurition report
function todaydata(key) {
  let ml = JSON.parse(localStorage.getItem("meal"));
  let today = new Date().toISOString().split('T')[0];
  let total = 0;

  if (ml && ml.length > 0) {
    for (let i = 0; i < ml.length; i++) {
      if (ml[i].addedOn === today) {
        total += ml[i][key];
      }
    }
  }
  return total.toFixed(2);
}

function showind(i) {

  let myModal = new bootstrap.Modal(document.getElementById('indmodel'));
  myModal.show();

  let ml = JSON.parse(localStorage.getItem("meal"));

  tdata = `<table>
  <thead>
    <tr>
      <th class="text-center">Name</th>
      <th class="text-center">Qty.</th>
      <th class="text-center">Energy</th>
      <th class="text-center">Protien</th>
      <th class="text-center">Fat</th>
      <th class="text-center">Fiber</th>
    </tr>
  </thead>
  <tbody>`;
  let tqty = 0;
  let tenergy = 0;
  let tp = 0;
  let tfat = 0
  let tfiber = 0

  for (const e of ml[i].ingredients) {
    tdata += `<tr><td>${e.foodName}</td><td>${e.qty}</td><td>${e.energy}</td><td>${e.protein}</td><td>${e.fat}</td><td>${e.fiber}</td></tr>`;
    tqty += Number(e.qty);
    tenergy += Number(e.energy);
    tp += Number(e.protein);
    tfat += Number(e.fat);
    tfiber += Number(e.fiber);
  }

  tdata += `<tr><td><b>Total</b></td><td>${tqty}</td><td>${tenergy.toFixed(2)}</td><td>${tp.toFixed(2)}</td><td>${tfat.toFixed(2)}</td><td>${tfiber.toFixed(2)}</td></tr>
</tdata></table>`;
  indmodelheader.innerHTML = ml[i].mealName + " Ingredients:";
  indmdata.innerHTML = tdata;
}

// show time, and the time is saved in local storage
function setTodayDate() {
  const todayDate = new Date().toISOString().split('T')[0];
  document.getElementById('addedOn').value = todayDate;
}

function setFirstTimeLocal(x) {
  if (localStorage.getItem(x) == null) {
    localStorage.setItem(x, "[]");
  }
}

// Innitializing Meal Key for fresh start
setFirstTimeLocal("meal");
setFirstTimeLocal("mealtracker");
setFirstTimeLocal("ind");

Food.fetchFoodItem();

//Geolokation for meal tracker
const findMyCity = () => {
  const status = document.querySelector('.status');

  const success = (position) => {
    console.log(position)
  }

  const error = () => {
    status.textContent = 'Error: Lokation ikke fundet'; 
  }

  navigator.geolocation.getCurrentPosition(success, error);

}

document.querySelector('.find-city').addEventListener('click',findMyCity);

function shownutrireport() { // Fetch data from localStorage
  let mt = JSON.parse(localStorage.getItem("mealtracker"));
  let ml = JSON.parse(localStorage.getItem("meal"));
  let uniqueDates = [...new Set(mt.map(item => item.addedOn))];
  uniqueDates.sort(compareDates);

  // Initialize variables for total values
  let tdata = "";
  let tenergy = 0;
  let tp = 0;
  let tfat = 0;
  let tfiber = 0;
  let twater = 0;
  let mtData;

  uniqueDates.forEach(dt => {
    tenergy = 0;
    tp = 0;
    tfat = 0;
    tfiber = 0;
    twater = 0;

    mtData = mt.filter(item => item.addedOn === dt);

    // Calculate total values for each nutrient
    mtData.forEach(e => {
      tenergy += ml[e.mealIndex].totalKcal / ml[e.mealIndex].weight * e.cweight;
      tp += ml[e.mealIndex].protein / ml[e.mealIndex].weight * e.cweight;
      tfat += ml[e.mealIndex].fat / ml[e.mealIndex].weight * e.cweight;
      tfiber += ml[e.mealIndex].fiber / ml[e.mealIndex].weight * e.cweight;
      if (ml[e.mealIndex].mealtype == "liquid") twater += e.cweight;
    });

    // Build the HTML table row for each date
    tdata += `<tr><td>${convertDateFormat(dt)}</td><td>${mtData.length} Meals</td><td>${(twater / 1000).toFixed(2)} L </td><td>${(tenergy).toFixed(2)} Kcal</td><td>${tp.toFixed(2)}</td>
            <td>${tfat.toFixed(2)}</td><td>${tfiber.toFixed(2)}</td></tr>`;
  });

  // Update the HTML content of the specified element
  document.getElementById("nutri").innerHTML = tdata;
}

function updateDailyNutriTables() {
  let mealTrackData = JSON.parse(localStorage.getItem('mealtracker'));
  console.log('Meal Track Data:', mealTrackData); // Check what's actually in meal tracker data

  let mealData = JSON.parse(localStorage.getItem('meal'));
  console.log('Meal Data:', mealData); // Check the meal data

  let selectedDate = new Date(document.getElementById('dayInput').value);
  let dateString = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD

  console.log('Selected Date:', dateString); // Ensure date is correctly captured

  let filteredMeals = mealTrackData.filter(m => m.addedOn === dateString);
  console.log('Filtered Meals:', filteredMeals); // Check if filtering is working

  const dailyNutriBody = document.getElementById('hourlyNutri');
  dailyNutriBody.innerHTML = ''; // Clear previous entries

  if (filteredMeals.length === 0) {
    console.log('No meals found for selected date');
  }

  filteredMeals.forEach(meal => {
    let mealDetails = mealData[meal.mealIndex]; // Assuming mealIndex correlates correctly
    if (!mealDetails) {
      console.log('No details found for meal index:', meal.mealIndex);
      return;
    }

    let row = dailyNutriBody.insertRow();

    let cellTime = row.insertCell(0);
    cellTime.textContent = meal.ctime; // Display consumption time

    let cellEnergy = row.insertCell(1);
    cellEnergy.textContent = `${(mealDetails.totalKcal / mealDetails.weight * meal.cweight).toFixed(2)} kcal`;

    let cellWater = row.insertCell(2);
    cellWater.textContent = '0 ml'; // Placeholder, update based on actual data if available

    let cellBurned = row.insertCell(3);
    cellBurned.textContent = '0 kcal'; // Placeholder, update based on actual data if available

    let cellNet = row.insertCell(4);
    cellNet.textContent = '0 kcal'; // Placeholder, calculate net calorie if needed
  });
}

// Event listener to trigger data update
document.getElementById('dayInput').addEventListener('change', updateDailyNutriTables);