/**
 * Created: 24/01/22
 * Updated: 25/02/22
 * Author(s): Michael Brewer
 */

/** Require(s) */
const { forEach } = require('ramda');
const R = require('ramda');
const boats = require('./southpaw.json');

/** Global(s) */
const results = boats.results;

/** Output DocumentID of 1st [0] boat */
// console.log(results[0].DocumentID);

/** mapAccum  */
const boatList = results;
console.log(boatList[0]);
