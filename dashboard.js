function dashboard() {
  // Retrieve meal tracker and meal data from local storage
  let mt = JSON.parse(localStorage.getItem("mealtracker"));
  let ml = JSON.parse(localStorage.getItem("meal"));
  let today = new Date().toISOString().split('T')[0];
  let tenergy = 0, tp = 0, twater = 0; // Initialize variables for tracking total energy, protein, and water intake

  let mtData = mt.filter(item => item.addedOn === today);
  mtData.forEach(e => {
    tenergy += ml[e.mealIndex].totalKcal / ml[e.mealIndex].weight * e.cweight; // Calculate energy based on meal and weight
    tp += ml[e.mealIndex].protein / ml[e.mealIndex].weight * e.cweight; // Calculate protein based on meal and weight
    if (ml[e.mealIndex].mealtype == "liquid") twater += e.cweight; // Check if the meal type is "liquid" and add to water total
  });

  todaym.innerHTML = mtData.length;
  todaye.innerHTML = tenergy.toFixed(2);
  todayp.innerHTML = tp.toFixed(2);
  todayw.innerHTML = (twater / 1000).toFixed(2);
}

function todaydatawater(key) {
  let ml = JSON.parse(localStorage.getItem("meal"));
  let today = new Date().toISOString().split('T')[0];
  let total = 0;
  if (ml && ml.length > 0) {
    for (let i = 0; i < ml.length; i++) {
      if (ml[i].addedOn === today && ml[i].mtype == "liquid") {
        total += ml[i][key];
      }
    }
  }
  return total.toFixed(2);
}
