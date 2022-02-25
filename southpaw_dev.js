/**
 * Created: 24/01/22
 * Updated: 25/02/22
 * Author(s): Michael Brewer
 */

/** Require(s) */
const R = require('ramda');
const table = require('text-table');
const boats = require('./southpaw.json');

/** Global(s) */
const results = boats.results; // All results

/**
 * I'm going round in circles here...
 * I basically want to achieve the following;
 *
 * => Download the latest JSON Data from api.boats.com
 * => Strip out all the unneccessary data write to a new file
 *
 *
 */

/** Get(s) 1st Boat => 1st Image.Uri  */
const imageUri = results[0].Images[0].Uri;
console.log(imageUri);

/**
 * Create New Object(s) from Nested JSON Data
 */
const boatLens = R.lensProp('boat');
const imageLens = R.lensProp('image');
const boatImageLens = R.compose(boatLens, imageLens);

function setBoat(boat, image) {
  return R.set(boatImageLens, boat, image);
}
console.log(setBoat(boats));

/**
 * Create Obj(s) of Boat(s)
 */
// console.log('*** Create Object(s) of Boat(s) ***');
// const boatsToObject = (boat) => {
//   const {
//     Source,
//     DocumentID,
//     SalesStatus,
//     CoOpIndicator,
//     NumberOfEngines,
//     CompanyName,
//   } = boat;
//   return {
//     Source,
//     DocumentID,
//     SalesStatus,
//     CoOpIndicator,
//     NumberOfEngines,
//     CompanyName,
//   };
// };
// const bBoat = R.pipe(R.map(boatsToObject))(results);
// console.log(bBoat);

/** Individual boat */
// const boat = results[0]; // 1st Boat
// const images = boat.Images; // 1st Boat => Images Array

// console.log(boat.Engines[0]); // 1st Boat => Single Engine
// console.log(boat.Engines); // 1st Boat => All Engines

// console.log(images); // 1st Boat => All Images

/**
 * Create Arr(s) of Boat(s)
 */
// const boatsToArray = (boat) => {
//   const {
//     Source,
//     DocumentID,
//     SalesStatus,
//     CoOpIndicator,
//     NumberOfEngines,
//     CompanyName,
//   } = boat;
//   return [
//     Source,
//     DocumentID,
//     SalesStatus,
//     CoOpIndicator,
//     NumberOfEngines,
//     CompanyName,
//   ];
// };
// const arrBoats = [
//   'Source',
//   'DocumentId',
//   'SalesStatus',
//   'CoOpIndicator',
//   'NumberOfEngines',
//   'CompanyName',
// ];
// const aBoat = R.pipe(
//   R.map(boatsToArray)
//   /** If you want Headers & Table, uncomment */
//   // R.prepend(arrBoats),
//   // table
// )(results);
// console.log(aBoat);
