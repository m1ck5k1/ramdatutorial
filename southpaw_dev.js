/**
 * Created: 24/01/22
 * Updated: 25/02/22
 * Author(s): Michael Brewer
 */

/** Require(s) */
const R = require('ramda');
const table = require('text-table');
const boatData = require('./southpaw.json');

/** Global(s) */
const results = boatData.results; // All results
// console.log(results);

/**
 * Get(s) => 1st Boat(s) => 1st Image.Uri
 */
// const imageUri = results[0].Images[0].Uri;
// console.log(imageUri);

/**
 * Create Obj(s) of Boat(s)
 */
console.log(`
  \n*** Create Object(s) of Boat(s) ***
`);
const boatsToObject = (boat) => {
  const {
    DocumentID,
    SalesStatus,
    ModelYear,
    MakeString,
    Model,
    NormPrice,
    BoatLocation,
    BoatName,
    BoatCategoryCode,
    BoatHullMaterialCode,
    GeneralBoatDescription,
    BoatBeamMeasure,
    DryWeightMeasure,
    NumberOfEngines,
    Engines: [{ Fuel }],
    TotalEnginePowerQuantity,
    HeadsCountNumeric,
    FuelTankCapacityMeasure,
    WaterTankCapacityMeasure,
    HoldingTankCapacityMeasure,
    Images: [Image, { Uri }],
  } = boat;
  return {
    DocumentID,
    SalesStatus,
    ModelYear,
    MakeString,
    Model,
    NormPrice,
    BoatLocation,
    BoatName,
    BoatCategoryCode,
    BoatHullMaterialCode,
    GeneralBoatDescription,
    BoatBeamMeasure,
    DryWeightMeasure,
    NumberOfEngines,
    // Engines,
    Fuel,
    TotalEnginePowerQuantity,
    HeadsCountNumeric,
    FuelTankCapacityMeasure,
    WaterTankCapacityMeasure,
    HoldingTankCapacityMeasure,
    Uri,
  };
};
const bBoat = R.pipe(R.map(boatsToObject))(results);
console.log(bBoat);
