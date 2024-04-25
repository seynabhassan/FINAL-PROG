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
