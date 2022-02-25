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

/** Get(s) 1st Boat => 1st Image.Uri  */
const imageUri = boats[0].Images[0].Uri;
console.log(imageUri);

/**
 * Create Obj(s) of Boat(s)
 */
console.log('*** Create Object(s) of Boat(s) ***');
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
    Engines,
    NumberOfEngines,
    TotalEnginePowerQuantity,
    HeadsCountNumeric,
    FuelTankCapacityMeasure,
    WaterTankCapacityMeasure,
    HoldingTankCapacityMeasure,
    Images,
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
    Engines,
    NumberOfEngines,
    TotalEnginePowerQuantity,
    HeadsCountNumeric,
    FuelTankCapacityMeasure,
    WaterTankCapacityMeasure,
    HoldingTankCapacityMeasure,
    Images,
  };
};
// const bBoat = R.pipe(R.map(boatsToObject))(results);
// console.log(bBoat);
