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


const {nextISSTimesForMyLocation} = require("./iss");

/**
 * Input:
 *   Array of data objects defining the next fly-overs of the ISS.
 *   [ { risetime: <number>, duration: <number> }, ... ]
 * Returns:
 *   undefined
 * Sideffect:
 *   Console log messages to make that data more human readable.
 *   Example output:
 *   Next pass at Mon Jun 10 2019 20:11:44 GMT-0700 (Pacific Daylight Time) for 468 seconds!
**/
// Function to print flyOverTimes in a more readable way
const printFlyOverTimes = function(flyOverTimes) {
  flyOverTimes.forEach(flyOver => {
    const time = new Date(0); // create new Date instance (Jan 01, 1970)
    time.setUTCSeconds(flyOver.risetime); // set time to flyOver time
    const duration = flyOver.duration;
    console.log(`Next pass at ${time} for ${duration} seconds!`)
  });
}


nextISSTimesForMyLocation((error, flyOverTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  // if no errors throughout, print times in a readable format
  printFlyOverTimes(flyOverTimes);
});