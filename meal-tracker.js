class MealConsumption {
  constructor(mealIndex, mealName, addedOn, ctime, cweight) {
    this.mealIndex = mealIndex;
    this.mealName = mealName;
    this.addedOn = addedOn;
    this.ctime = ctime;
    this.cweight = cweight;
  }

  // Adding a meal tracker modal
  static addMealtracker(mtype) {
    const modal = new bootstrap.Modal(document.getElementById('mealtrackermodel'), {
      backdrop: 'static',
      keyboard: false
    });

    let ml = JSON.parse(localStorage.getItem("meal"));

    let selectElement = document.getElementById("meallist");
    selectElement.innerHTML = "";
    let i;
    for (i = 0; i < ml.length; i++) {
        let option = document.createElement("option");
        option.text = ml[i].mealName;
        option.value = i;
        selectElement.add(option);
    }

    modal.show();
  }

  // Adding meal consumption to local storage
  static addmealconsumption() {
    if (meallist.selectedIndex == -1) {
      alert("Please Select any meal from list.");
      return;
    }
    let mindex = meallist.options[meallist.selectedIndex].value;
    let mname = meallist.options[meallist.selectedIndex].text;
    let ml;
    let m;
    if (localStorage.getItem("mealtracker") == null) {
      ml = [];
      m = 0;
    } else {
      ml = JSON.parse(localStorage.getItem("mealtracker"));
      m = ml.length;
    }

    ml[m] = new MealConsumption(mindex, mname, addedOn.value, consume_time.value, consume_weight.value);
    localStorage.setItem("mealtracker", JSON.stringify(ml));

    mealtrackerForm.reset();
    MealConsumption.showmealtracker();
  }

  // Editing meal tracker entry
  static edittracker(i) {
    let mt = JSON.parse(localStorage.getItem("mealtracker"));
    let rowNumber = i + 1;
    let cel = mttable.rows[rowNumber].cells[3];
    cel.innerHTML = `<input id=uweight type="number" value=${mt[i].cweight}>`;
    cel = mttable.rows[rowNumber].cells[4];
    cel.inneHTML = `<input id=udate type="date" value=${mt[i].addedOn}><br><input id=utime type="time" value=${mt[i].ctime}><br><button onclick=MealConsumption.edittrackerupdate(${i})>Save</button>`;
  }

  static edittrackerupdate(i) {
    let mt = JSON.parse(localStorage.getItem("mealtracker"));
    mt[i].addedOn = udate.value;
    mt[i].ctime = utime.value;
    mt[i].cweight = uweight.value;
    localStorage.setItem("mealtracker", JSON.stringify(mt));
    MealConsumption.showmealtracker();
  }

  // Deleting a meal from meal tracker
  static delmealtracker(indexToRemove) {
    let ml = JSON.parse(localStorage.getItem("mealtracker"));
    ml.splice(indexToRemove, 1);
    localStorage.setItem("mealtracker", JSON.stringify(ml));
    MealConsumption.showmealtracker();
  }

  // Displaying the meal tracker entries
  static showmealtracker() {
    let mt = JSON.parse(localStorage.getItem("mealtracker"));
    let ml = JSON.parse(localStorage.getItem("meal"));
    let i = 0;
    let tdata = "";
    mt.forEach(element => {
      tdata += `
        <tr>
            <td>${i + 1}</td>
            <td id="mealsource"><p id="mealsourceicon">+</p> ${ml[element.mealIndex].mealName}</td>
            <td>${ml[element.mealIndex].mealtype}</td>
            <td>${element.cweight} g<br>
            ${(ml[element.mealIndex].totalKcal / ml[element.mealIndex].weight * element.cweight).toFixed(2)}Kcal</td>
            <td>${convertDateFormat(element.addedOn)}<br>${element.ctime} </td>
            <td id="dailycons"> <p id="dailycons-blue">30g</p>  <p id="dailycons-orange">12g</p>  
            <p id="dailycons-lightblue">2mg</p>  <p id="dailycons-red">15</p>  
          </td>
          <td> 
            <i id="greenicon" onclick='showind(${element.mealIndex})' class="material-icons">book</i>
            <i id="blueicon" class="material-icons" onclick='MealConsumption.edittracker(${i})'>create</i>
            <i id="redicon" onclick='MealConsumption.delmealtracker(${i})' class="material-icons">delete</i>
            </td>
        </tr>`;
      i++;
    });

    localStorage.setItem("mealtracker", JSON.stringify(mt));
    document.getElementById("mtbody").innerHTML = tdata;
  }
}

function mtcompareDates(a, b) {
  let dateA = new Date(a.addedOn);
  let dateB = new Date(b.addedOn);
  return dateA - dateB;
}