// Asynchronous function to fetch data for a specific food item
async function fdata(foodID, flag) {
  try {
    const response = await fetch(`https://nutrimonapi.azurewebsites.net/api/FoodItems/${foodID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': 168795
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    return data[flag];

  } catch (error) {
    console.error('Error during fetch:', error);
    throw error;
  }
}

// Asynchronous function to fetch detailed nutritional information for a specific food item and a given sort key
async function fodoinsp(foodID, sortkey) {
  try {
    const response = await fetch(`https://nutrimonapi.azurewebsites.net/api/FoodCompSpecs/ByItem/${foodID}/BySortKey/${sortkey}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': 168795
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Parse the response body as JSON

    return (Number(((data[0].resVal).replace(/,/g, '.')))).toFixed(2);

  } catch (error) {
    console.error('Error during fetch:', error);
    throw error;
  }
}

// Asynchronous function to inspect and display nutritional information for a selected food item
async function foodinspector() {
  try {
    // Display a loading message while fetching data
    productimage.innerHTML = "<h3>Loading Data from API...</h3>";
    fid = select1.value;
    pid.innerHTML = fid;

    // Fetch and display various nutritional information using the previously defined functions
    foodgroup.innerHTML = await fdata(fid, "fødevareGruppe");
    tisk.innerHTML = await fdata(fid, "taxonomicName");
    kj.innerHTML = await fodoinsp(fid, "1010");
    kcal.innerHTML = await fodoinsp(fid, "1030");
    protien.innerHTML = await fodoinsp(fid, "1110");
    fiber.innerHTML = await fodoinsp(fid, "1240");
    fedt.innerHTML = await fodoinsp(fid, "1310");
    kulhydrat.innerHTML = await fodoinsp(fid, "1210");
    vand.innerHTML = await fodoinsp(fid, "1620");
    torstof.innerHTML = await fodoinsp(fid, "1610");

    productimage.innerHTML = "<p>Sorry! Image Not Available.</p>"; // Display a message if the image is not available

  } catch (error) {
    // Log and handle errors that occur during the food inspection
    console.error('Error during food inspection:', error);
    // Handle or log the error as needed
  }
}
