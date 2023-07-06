const routeSelect = document.getElementById('route');
const numTrucksInput = document.getElementById('numTrucks');
const submitBtn = document.getElementById('submitBtn');
const trailerInfo = document.getElementById('trailerInfo');
const imageDiv = document.getElementById('image');
const costRateDiv = document.getElementById('costRate');
const transitDaysDiv = document.getElementById('transitDays');
const tonnageCapacityDiv = document.getElementById('tonnageCapacity');
const availableTrucksDiv = document.getElementById('availableTrucks');

let availableTrucks = 100;

function updateAvailableTrucks(count) {
  availableTrucks -= count;
  availableTrucksDiv.textContent = `Available Trucks: ${availableTrucks}`;
}

function fetchData() {
  return fetch('https://brock-logistics.onrender.com/trailers')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      populateRoutes(data);
      routeSelect.addEventListener('change', () => {
        const selectedRoute = routeSelect.value;
        updateTrailerInfo(data, selectedRoute);
      });
      submitBtn.addEventListener('click', handleSubmit);
    });
}

function populateRoutes(data) {
  data.forEach(trailer => {
    trailer.routes.forEach(route => {
      const option = document.createElement('option');
      option.value = route.route;
      option.textContent = route.route;
      routeSelect.appendChild(option);
    });
  });
}

function updateTrailerInfo(data, selectedRoute) {
  const selectedTrailer = data.find(trailer =>
    trailer.routes.some(route => route.route === selectedRoute)
  );

  if (selectedTrailer) {
    const selectedRouteInfo = selectedTrailer.routes.find(
      route => route.route === selectedRoute
    );

    imageDiv.innerHTML = '';
    costRateDiv.innerHTML = '';
    transitDaysDiv.innerHTML = '';
    tonnageCapacityDiv.innerHTML = '';

    const image = document.createElement('img');
    image.src = selectedTrailer.image;
    imageDiv.appendChild(image);

    const costRate = document.createElement('p');
    costRate.textContent = `Cost Rate: Kshs ${selectedRouteInfo.cost_rate}`;
    costRateDiv.appendChild(costRate);

    const transitDays = document.createElement('p');
    transitDays.textContent = `Transit Days: ${selectedRouteInfo.transit_days}`;
    transitDaysDiv.appendChild(transitDays);

    const tonnageCapacity = document.createElement('p');
    tonnageCapacity.textContent = `Tonnage Capacity: ${selectedRouteInfo.tonnage_capacity} tons`;
    tonnageCapacityDiv.appendChild(tonnageCapacity);
  }
}

function handleSubmit() {
  const selectedRoute = routeSelect.value;
  const numTrucks = parseInt(numTrucksInput.value);

  if (!selectedRoute || !numTrucks) {
    alert('Please select a route and enter the number of trucks.');
    return;
  }

  if (isNaN(numTrucks)) {
    alert('Please enter a valid number of trucks.');
    return;
  }

  if (numTrucks < 1 || numTrucks > availableTrucks) {
    const remainingTrucks = availableTrucks > 0 ? availableTrucks : 0;
    alert(`Sorry, there are only ${remainingTrucks} truck(s) available.`);
    return;
  }

  alert(`You have successfully booked ${numTrucks} truck(s) for the "${selectedRoute}" route. Available Trucks: ${availableTrucks - numTrucks}`);

  updateAvailableTrucks(numTrucks);

  numTrucksInput.value = '';
}

document.addEventListener("DOMContentLoaded", fetchData);