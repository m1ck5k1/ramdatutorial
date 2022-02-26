/**
 * Created: 26/02/22
 * Updated: 26/02/22
 * Author(s): Michael Brewer & Cris Blanco
 */

const R = require('ramda');
const table = require('text-table');
const cities = require('./cities.json');
const percentile = require('./percentile');

/**
 * Const Function(s) for Temp. Conversions
 * @param
 * @returns
 */
const KtoC = (k) => k - 273.15;
const KtoF = (k) => (k * 9) / 5 - 459.67;

/**
 * Generic fn() to convert Kelvin Temp. > F or C
 * @param
 * @returns
 */
const updateTemperature = R.curry((convertFn, city) => {
  const temp = Math.round(convertFn(city.temp));
  // R.merge => Depricated since Ramda v0.26.0
  return R.mergeRight(city, { temp });
});

/**
 * Example: Conversion of Kelvin => Celcius/Fahrenheit Conversion
 */
// const updatedCities = R.map(updateTemperature(KtoC), cities);
// const updatedCities = R.map(updateTemperature(KtoF), cities);
// console.log(updatedCities);

/** Example: Conversion of Bangkok Temp. */
// const city = cities[0];
// const updatedCity = updateTemperature(KtoC, city);
// const updatedCity = updateTemperature(KtoF, city);
// console.log(updatedCity); // Bangkok[0]

/**
 * Calculate Total Cost Reducer
 * @param {*} acc
 * @param {*} city
 * @returns
 */
const totalCostReducer = (acc, city) => {
  const { cost = 0 } = city;
  return acc + cost;
};

const totalCost = R.reduce(totalCostReducer, 0, cities);
const cityCount = R.length(cities);
// console.log(totalCost / cityCount);

/**
 *
 * @param {*} acc
 * @param {*} city
 * @returns
 */
const groupByPropReducer = (acc, city) => {
  const { cost = [], internetSpeed = [] } = acc;
  // R.merge => Depricated since Ramda v0.26.0
  return R.mergeRight(acc, {
    cost: R.append(city.cost, cost),
    internetSpeed: R.append(city.internetSpeed, internetSpeed),
  });
};

const groupedByProp = R.reduce(groupByPropReducer, {}, cities);
// console.log(groupedByProp);

/**
 * City Score Calculator
 * @param {*} city
 * @returns
 */
const calcScore = (city) => {
  const { cost = 0, internetSpeed = 0 } = city;
  const costPercentile = percentile(groupedByProp.cost, cost);
  const internetSpeedPercentile = percentile(
    groupedByProp.internetSpeed,
    internetSpeed
  );
  const score = 100 * (1.0 - costPercentile) + 20 * internetSpeedPercentile;
  // R.merge => Depricated since Ramda v0.26.0
  return R.mergeRight(city, { score });
};

// const scoredCities = R.map(calcScore, updatedCities);
// console.log(scoredCities);

/**
 * ReWrite to Generic fn() so the temp range accounts for C & F
 * @param {*} city
 * @returns
 */
const filterByWeather = (city) => {
  const { temp = 0, humidity = 0 } = city;
  return temp > 20 && temp < 30 && humidity > 30 && humidity < 70;
  // return temp > 68 && temp < 85 && humidity > 30 && humidity < 70;
};

// const filteredCities = R.filter(filterByWeather, scoredCities);
// console.log(R.length(filteredCities));

// const sortedCities = R.sortWith(
//   [R.descend(city => city.score)],
//   filteredCities,
// );
// console.log(sortedCities);

// const top10 = R.take(10, sortedCities);
// console.log(top10);
// console.log(R.length(top10));

/**
 * Convert City Object => Array
 * @param {*} city
 * @returns
 */
const cityToArray = (city) => {
  const { name, country, score, cost, temp, internetSpeed } = city;
  return [name, country, score, cost, temp, internetSpeed];
};
const interestingProps = [
  'Name',
  'Country',
  'Score',
  'Cost',
  'Temp',
  'Internet',
];

/**
 * topCities Pipe that;
 * -> Convert(s) Kelvin Temp > Celcius or Fahrenheit
 * -> Filter Cities based on preferred Temp Range
 * -> Calculate/Generate City Score, based on Cost v Internet Speed
 * -> Sort based on CityScore (High > Low)
 * -> Get the Top 10 Cities (High > Low)
 * -> Convert Cities Obj > Arr
 * -> Add Calculated Scores
 * -> Output data to CLI as Table
 */
const topCities = R.pipe(
  R.map(updateTemperature(KtoC)), // Set R.filter
  // R.map(updateTemperature(KtoF)), // Set R.filter
  R.filter(filterByWeather), // Set C = >20 <30 / Set F = >68 <85
  R.map(calcScore),
  R.sortWith([R.descend((city) => city.score)]),
  R.take(10),
  R.map(cityToArray),
  R.prepend(interestingProps),
  table
)(cities);
console.log(topCities);
