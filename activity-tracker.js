function calculateCalories() {
  const exerciseSelect = document.getElementById("exerciseSelect");
  const selectedExercise = exerciseSelect.value;

  let caloriesBurned;

  switch (selectedExercise) {
      case "walking":
          caloriesBurned = 215; //Kalorier brændt per time ved hver aktivitet
          break;
      case "walkingDown":
          caloriesBurned = 414; 
          break;
      case "walkingUp":
          caloriesBurned = 1079; 
          break;
      case "mowing":
          caloriesBurned = 281; 
          break;
      case "foodBed":
          caloriesBurned = 236; 
          break;
      case "weeding":
          caloriesBurned = 362; 
          break;
      case "clearSnow":
          caloriesBurned = 481; 
          break;
      case "readTV":
          caloriesBurned = 74; 
          break;
      case "standing":
          caloriesBurned = 89; 
          break;
      case "cycling":
          caloriesBurned = 310; 
          break;
      case "dusting":
          caloriesBurned = 163; 
          break;
      case "washFloor":
          caloriesBurned = 281; 
          break;
      case "washWindow":
          caloriesBurned = 159; 
          break;

  //Kalorier forbrændt i "Sports" katogorien
      case "cardio":
          caloriesBurned = 814; 
          break;
      case "weightTraining":
          caloriesBurned = 348; 
          break;
      case "badminton":
          caloriesBurned = 318; 
          break;
      case "volleyball":
          caloriesBurned = 236; 
          break;
      case "tableTennis":
          caloriesBurned = 355; 
          break;
      case "dancingHard":
          caloriesBurned = 355; 
          break;
      case "dancingMod":
          caloriesBurned = 259; 
          break;
      case "football":
          caloriesBurned = 510; 
          break;
      case "walkingFast":
          caloriesBurned = 384; 
          break;
      case "golf":
          caloriesBurned = 244; 
          break;
      case "handball":
          caloriesBurned = 466; 
          break;
      case "squash":
          caloriesBurned = 466; 
          break;
      case "jogging":
          caloriesBurned = 666; 
          break;
      case "crossCoun":
          caloriesBurned = 405; 
          break;
      case "runningMod":
          caloriesBurned = 872; 
          break;
      case "runningFast":
          caloriesBurned = 1213; 
          break;
      case "horseRide":
          caloriesBurned = 414; 
          break;
      case "iceSkate":
          caloriesBurned = 273; 
          break;
      case "swim":
          caloriesBurned = 296; 
          break;
      case "cycling":
          caloriesBurned = 658; 

    //Kalorier forbrændt i "forskellige typer af arbejde" katogorien 
 case "car":
          caloriesBurned = 355; 
          break;
      case "excavation":
          caloriesBurned = 414; 
          break;
      case "agricultural":
          caloriesBurned = 236; 
          break;
      case "officeWork":
          caloriesBurned = 185; 
          break;
      case "paintHouse":
          caloriesBurned = 215; 
          break;
      case "masonry":
          caloriesBurned = 207; 
          break;
      case "firewood":
          caloriesBurned = 1168; 
          break;
          
      default:
          caloriesBurned = 0;
  }

  const caloriesElement = document.getElementById("caloriesBurned");
  caloriesElement.textContent = `Calories burned: ${caloriesBurned} per hour`;
}
