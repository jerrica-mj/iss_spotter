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
      return callback(error, null);
    }

    // if HTTP status code != 200, assume server error; pass an error message and null (IP)
    if (response.statusCode !== 200) {
      const message = `Status code ${response.statusCode} when fetching IP: ${body}`;
      return callback(Error(message), null);
    }

    // if returned in the wrong format (not JSON--url problem) or some other spelling mistakes not covered above, pass an error message and null (IP)
    if (body[0] !== "{") {
      const message = `There was a problem fetching IP: ${body}`;
      return callback(Error(message), null);
    }

    // if no problems, pass null (error) and the IP (string) from the parsed JSON reply
    const ipAddress = JSON.parse(body).ip;
    callback(null, ipAddress);
  });
};


// API Call #2: Fetch Geo Coordinates by IP
const fetchCoordsByIP = function(ip, callback) {
  // use request to fetch geo coordinates of IP from JSON API (Free Geo IP)
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    // if error occurs, pass the error and null (coord's) to callback
    if (error) return callback(error, null);

    // if other problem (statusCode != 200), pass error message and null to callback
    if (response.statusCode !== 200) {
      const message = `Status code ${response.statusCode} when fetching geo coordinates for IP. Response: ${body}`;
      return callback(Error(message), null);
    }

    // if no problems, parse and get the latitude and longitude to create a coordinates object
    const {latitude, longitude} = JSON.parse(body); // parses body and adds specified key-value pairs into an object

    // pass to the callback null (error) and the coordinates object
    callback(null, {latitude, longitude});
  });
};


// API Call #3: Fetch Next ISS Flyovers at Coordinates



module.exports = {
  fetchMyIP,
  fetchCoordsByIP
};