// ISS SPOTTER
// File/module to contain most of the logic for fetching the dara from each API

/**
 * The Approach
 * We'll be making API requests to 3 different services to solve this problem:
 * 1. Fetch our IP address
 * 2. Fetch the geo coordinates (lat & long) for our IP
 * 3. Fetch the next ISS flyovers for our coordinates
 * Note: each step is dependent on the previous one
**/


const request = require("request");

// Primary Function for calling & ochestrating all 3 API requests
/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
**/
const nextISSTimesForMyLocation = function(callback) {
  // nest the async function calls so they happen one after another, using the previous result (look at driver code used to verify output)
  fetchMyIP((error, ip) => {
    // if error occurs, log with callback (null data) and return
    if (error) {
      callback(error, null);
      return;
    }

    // if no error, continue to the next function
    fetchCoordsByIP(ip, (error, coordinates) => {
      // if error occurs, log with callback (null data) and return
      if (error) {
        callback(error, null);
        return;
      }

      // if no error, continue to the next function
      fecthISSFlyOverTimes(coordinates, (error, flyoverTimes) => {
        // if error occurs, log with callback (null data) and return
        if (error) {
          callback(error, null);
          return;
        }

        // if no error, pass result to callback, with null for error
        callback(null, flyoverTimes);
      });
    });
  });
};


// API Call #1: Fetch IP Address
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
**/
const fetchMyIP = function(callback) {
  // use request to fetch public IP address (string) from JSON API (ipify.org)
  request("https://api.ipify.org?format=json", (error, response, body) => {
    // pass appropriate error and IP to callback
    // if an error occurs, pass it and null (instead of IP)
    if (error) {
      callback(error, null);
      return;
    }

    // if HTTP status code != 200, assume server error; pass an error message and null (IP)
    if (response.statusCode !== 200) {
      const message = `Status code ${response.statusCode} when fetching IP: ${body}`;
      callback(Error(message), null);
      return;
    }

    // if returned in the wrong format (not JSON--url problem) or some other spelling mistakes not covered above, pass an error message and null (IP)
    if (body[0] !== "{") {
      const message = `There was a problem fetching IP: ${body}`;
      callback(Error(message), null);
      return;
    }

    // if no problems, pass null (error) and the IP (string) from the parsed JSON reply
    const ipAddress = JSON.parse(body).ip;
    callback(null, ipAddress);
    return ipAddress; // return value to be passed to next function
  });
};


// API Call #2: Fetch Geo Coordinates by IP
const fetchCoordsByIP = function(ip, callback) {
  // use request to fetch geo coordinates of IP from JSON API (Free Geo IP)
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    // if error occurs, pass the error and null (coord's) to callback
    if (error) {
      callback(error, null);
      return;
    }

    // if other problem (statusCode != 200), pass error message and null to callback
    if (response.statusCode !== 200) {
      const message = `Status code ${response.statusCode} when fetching geo coordinates for IP. Response: ${body}`;
      callback(Error(message), null);
      return;
    }

    // if no problems, parse and get the latitude and longitude to create a coordinates object
    const {latitude, longitude} = JSON.parse(body); // parses body and adds specified key-value pairs into an object

    // pass to the callback null (error) and the coordinates object
    callback(null, {latitude, longitude});
    return {latitude, longitude}; // return value to be passed to next function
  });
};


// API Call #3: Fetch Next ISS Flyovers at Coordinates
/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
**/
const fecthISSFlyOverTimes = function(coordinates, callback) {
  // use request to fetch flyover times at coordinates from JSON API
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;

  request(url, (error, response, body) => {
    // if error occurs, pass it and null (data) to callback
    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status code, assume server error; pass error message and null
    if (response.statusCode !== 200) {
      const message = `Status code ${response.statusCode} when fetching next ISS flyover times for coordinates. Response: ${body}`;
      callback(Error(message), null);
      return;
    }

    // if no problems, pass null and flyover times (array of objects)
    const flyoverTimes = JSON.parse(body).response;
    callback(null, flyoverTimes);
    return flyoverTimes;
  });
};


module.exports = {nextISSTimesForMyLocation};