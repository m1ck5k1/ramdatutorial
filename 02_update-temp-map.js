/**
 * Created: 25/02/22
 * Updated: 26/02/22
 * Author(s): Michael Brewer & mjgpy3
 *
 * Ref:
 * https://courses.knowthen.com/courses/453979/lectures/6977390
 * https://github.com/mjgpy3/presentations
 */

const R = require('ramda');
const cities = require('./cities.json');

const KtoC = (k) => k - 273.15;

/** Update cities.json temp(s) from Kelvin > Celcius */
const updateTemperature = (city) => {
  /** Set temp = KtoC fn() passing in each temp */
  const temp = KtoC(city.temp);
  /** Return & mergeRight Value { temp } */
  return R.mergeRight(city, { temp });
};

/** map(loop) the updateTemperature fn() */
const updatedCities = cities.map(updateTemperature);

/** Output to CLI */
console.log(updatedCities);
