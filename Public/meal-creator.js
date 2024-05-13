class Meal {
  constructor(mealName, totalKcal, weight, protein, fat, fiber, addedOn, timeEaten, ingredients, timeAdded) {
    this.mealName = mealName;
    this.totalKcal = totalKcal;
    this.weight = weight;
    this.protein = protein;
    this.fat = fat;
    this.fiber = fiber;
    this.addedOn = addedOn;
    this.timeEaten = timeEaten;
    this.ingredients = ingredients;
    this.timeAdded = timeAdded; // New property to store the time added
  }

  // Method to add meal model with a given meal type
  static addMealmodel() { // Popup green and blue button 
    const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
      backdrop: 'static',
      keyboard: false
    });
    localStorage.setItem("ind", "[]");
    // Trigger the modal to show
    modal.show();
  }

  // Asynchronous method to add food to the meal
  static async addfood() {
    tfood.innerHTML = `<h3 class="pt-5 text-danger">Fetching Data from API...</h3>`;
    if (select1.selectedIndex == -1) {
      alert("Please Select any food item.");
      return;
    }

    let fid = select1.options[select1.selectedIndex].value;
    let fname = select1.options[select1.selectedIndex].text;
    let fqty = sqty.value;
    let ind = JSON.parse(localStorage.getItem("ind"));

    // Creating a Food instance and fetching the nutritional content
    let f = new Food(fid, fname, fqty, 0, 0, 0, 0);
    await getfoodData(fid, "1030", "energy", fqty, f);
    await getfoodData(fid, "1110", "protein", fqty, f);
    await getfoodData(fid, "1310", "fat", fqty, f);
    await getfoodData(fid, "1240", "fiber", fqty, f);

    ind.push(f); // Ingredient list for the meal 
    localStorage.setItem("ind", JSON.stringify(ind));
    let tdata = `<table>
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

    ind.forEach(e => {
      tdata += `<tr><td>${e.foodName}</td><td>${e.qty}</td><td>${e.energy}</td><td>${e.protein}</td><td>${e.fat}</td><td>${e.fiber}</td></tr>`;
      tqty += Number(e.qty);
      tenergy += Number(e.energy);
      tp += Number(e.protein);
      tfat += Number(e.fat);
      tfiber += Number(e.fiber);
    });
    tdata += `<tr><td><b>Total</b></td><td>${tqty}</td><td>${tenergy.toFixed(2)}</td><td>${tp.toFixed(2)}</td><td>${tfat.toFixed(2)}</td><td>${tfiber.toFixed(2)}</td></tr>
  </tdata></table>`;
    tfood.innerHTML = tdata;
  }
  // Method to add a meal
  static addmeal() {
    let ml = JSON.parse(localStorage.getItem("meal"));
    let m = ml.length;
    let tqty = 0;
    let tenergy = 0;
    let tp = 0;
    let tfat = 0
    let tfiber = 0
    let ind = JSON.parse(localStorage.getItem("ind"));
    ind.forEach(e => {
      tqty += Number(e.qty);
      tenergy += Number(e.energy);
      tp += Number(e.protein);
      tfat += Number(e.fat);
      tfiber += Number(e.fiber);
    });

    ml[m] = new Meal(mealName.value, tenergy, tqty, tp, tfat, tfiber, addedOn.value, timeEaten.value, ind, new Date().toLocaleTimeString());
    localStorage.setItem("meal", JSON.stringify(ml)); // Saving the meal 
    localStorage.setItem("ind", "[]");
    Meal.showmeal(); // Displaying meals
    mealForm.reset();
    tfood.innerHTML = "";
  }

  // Method to delete a meal
  static delmeal(indexToRemove) {
    let ml = JSON.parse(localStorage.getItem("meal"));
    ml.splice(indexToRemove, 1);
    localStorage.setItem("meal", JSON.stringify(ml));
    Meal.showmeal();
  }

  // Method to display meals
  static showmeal() {
    let ml = JSON.parse(localStorage.getItem("meal"));
    let tdata = "";
    let i;
    for (i = 0; i < ml.length; i++) {
      tdata += `
      <tr>
          <td>${i + 1}</td>
          <td id="mealsource"><p id="mealsourceicon">+</p> ${ml[i].mealName}</td>
          <td>${(ml[i].totalKcal / ml[i].weight * 100).toFixed(2)}</td>
          <td>${convertDateFormat(ml[i].addedOn)}</td>
          <td>${ml[i].ingredients.length}</td>
          <td id="timeseaten"> <p>${ml[i].timeEaten}</p> </td>
          <td>${ml[i].timeAdded}</td> <!-- Displaying time added -->
          <td> 
              <i id="greenicon" onclick='showind(${i})' class="material-icons">book</i>
              <i id="blueicon" onclick='Meal.editmeal(${i})' class="material-icons">create</i>
              <i id="redicon" onclick='Meal.delmeal(${i})' class="material-icons">delete</i>
          </td>
      </tr>`;
    }
    document.getElementById("tablebody").innerHTML = tdata;
  }

  // Method for the editing button
  static editmeal(i) {

    let ml = JSON.parse(localStorage.getItem("meal"));
    let rowNumber = i + 1;
    mltable.rows[rowNumber].cells[1].innerHTML = `<input id=mname type="text" value=${ml[i].mealName}>`;
    mltable.rows[rowNumber].cells[3].innerHTML = `<input id=mdt type="text" value=${ml[i].addedOn}>`;
    mltable.rows[rowNumber].cells[5].innerHTML = `<input id=meaten type="text" value=${ml[i].timeEaten}>
  <button onclick=Meal.editmealupdate(${i})>Save</button>`;
  }

  // Method to update a meal after editing
  static editmealupdate(i) {
    let ml = JSON.parse(localStorage.getItem("meal"));
    ml[i].mealName = mname.value;
    ml[i].addedOn = mdt.value;
    ml[i].timeEaten = meaten.value;
    localStorage.setItem("meal", JSON.stringify(ml));
    Meal.showmeal(); // Displaying meals after editing
  }
}