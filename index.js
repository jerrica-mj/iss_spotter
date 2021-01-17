// ISS SPOTTER
// Build an app for space enthusiasts interested in spotting the International Space Station (ISS).
// The ISS can only be seen at dawn or dusk at a given location, because it reflects the sunlight but isn't  bright enough to be seen during the day.
// => it needs to be dark where the observer is, and the space station needs to be going overhead, but we won't worry about that for this app

/**
 * The Approach
 * We'll be making API requests to 3 different services to solve this problem:
 * 1. Fetch our IP address
 * 2. Fetch the geo coordinates (lat & long) for our IP
 * 3. Fetch the next ISS flyovers for our coordinates
 * Note: each step is dependent on the previous one
**/


// STEP 1 DRIVER CODE
const {fetchMyIP, fetchCoordsByIP} = require("./iss");


// fetchMyIP((err, ip) => {
//   if (err) {
//     console.log("It didn't work!", err);
//     return;
//   }
//   console.log("It worked! IP Address:", ip);
// });



// STEP 2 DRIVER CODE
fetchCoordsByIP("172.218.46.150", (err, data) => {
  if (err) {
    console.log("It didn't work!", err);
    return;
  }
  console.log("It worked! Coordinates:", data);
});