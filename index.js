const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', function () {
  menu.classList.toggle('active');
});

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

routeSelect.addEventListener('change', () => {
  const selectedRoute = routeSelect.value;

  if (selectedRoute) {
    // Fetch trailer and route information from a JSON file or API
    fetch('https://brian-vie3.onrender.com/trailers')
      .then(response => response.json())
      .then(data => {
        const trailers = data.trailers;
        const selectedTrailer = trailers.find(trailer => {
          return trailer.routes.find(route => route.route === selectedRoute);
        });

        if (selectedTrailer) {
          const selectedRouteInfo = selectedTrailer.routes.find(route => route.route === selectedRoute);

          if (selectedRouteInfo) {
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

            updateAvailableTrucks(0);
          } else {
            trailerInfo.innerHTML = '<p>Route information not found.</p>';
          }
        } else {
          trailerInfo.innerHTML = '<p>Trailer information not found.</p>';
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    // Clear trailer info
    imageDiv.innerHTML = '';
    costRateDiv.innerHTML = '';
    transitDaysDiv.innerHTML = '';
    tonnageCapacityDiv.innerHTML = '';
    trailerInfo.innerHTML = '';
  }
});

submitBtn.addEventListener('click', () => {
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
});
