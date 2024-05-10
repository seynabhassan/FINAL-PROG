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

