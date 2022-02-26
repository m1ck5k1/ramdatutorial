/**
 * Created: 17/12/20
 * Updated: 26/02/22
 * Author(s): Michael Brewer & Cris Blanco
 */

/**
 * Disabled for Dev
 * Enabled for Prod
 */
//console.clear();
`use strict`;

// Definition of key Classes for Modal Window
const modal = document.querySelector(`.modal`),
  overlay = document.querySelector(`.overlay`),
  btnCloseModal = document.querySelector(`.close-modal`);

// Global vars
let boats, modalImgArr, imgIndex;

/**
 * PULLS DATA FROM HTTPS://API.BOATS.COM, VIA A CORS PROXY
 * @ref:
 * https://howtocreateapps.com/fetch-and-display-json-html-javascript/
 * https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141#43881141
 */
const proxyurl = `https://metamorphic-cors.herokuapp.com/`;
const url = `https://api.boats.com/inventory/search?salesstatus=active,sale%20pending&rows=75&sort=length|desc&key=6fdd67895e324a1a9e5f9faecff2cd`;
const boatHeaders = new Headers();
boatHeaders.append(`Accept`, `application/vnd.dmm-v1+json`);

const requestOptions = {
  method: `GET`,
  headers: boatHeaders,
  redirect: 'follow',
};

/** Fetch API Promise (proxied due to CORS issues) */
fetch(proxyurl + url, requestOptions)
  .then(function (response) {
    return response.json();
  })
  .then(function (boatData) {
    loadTableData(boatData);
  })
  .catch(function (err) {
    console.log(`error: ` + err);
  });

/**
 * FORMAT RETRIEVED API DATA FROM BOATS.COM AND LOAD INTO CURRENT-INVENTORY WEBPAGE
 * @author(s): Michael Brewer/Cris Blanco
 * @param (boatdata) - Returned JSON Data.
 * @returns - Div with all Level 1 Boat data/image
 */
const loadTableData = (boatData) => {
  const mainContainer = document.getElementById(`myBoatData`);
  boats = Object.values(boatData.results); // CB
  let dataHtml = ``,
    div = document.createElement(`div`);

  for (let boat of boats) {
    boatSalesStatus = boat.SalesStatus;
    let img = boat.Images[0].Uri,
      id = boat.DocumentID,
      boatYearMakeModel =
        boat.ModelYear + ` ` + boat.MakeString + ` ` + boat.Model,
      trimYearMakeModel = truncText(boatYearMakeModel, 30),
      price = numWithCommas(boat.NormPrice),
      boatCityState =
        boat.BoatLocation.BoatCityName + `, ` + boat.BoatLocation.BoatStateCode,
      trimCityState = truncText(boatCityState, 13),
      boatLength = boat.NominalLength,
      emailIcon = `<a href="mailto:Info@SouthpawYachtSales.com?subject=Boat%20Enquiry%3A%20${trimYearMakeModel}&body=Please%20could%20you%20get%20back%20to%20me%20regarding%20the%20following%20boat%20listing.%0D%0A%0D%0AModel%3A%20${boatYearMakeModel}%0D%0APrice%3A%20$%20${price}%0D%0ALocation%3A%20${boatCityState}%0D%0ALength%3A%20${boat.NominalLength}"><ion-icon name="mail-outline" class="ion-social"></ion-icon></a>`,
      phoneIcon = `<a href="tel:+1-203-340-9203"><ion-icon name="call-outline" class="ion-social"></ion-icon></a>`,
      shareIcon = `<a href="mailto:%20?subject=${trimYearMakeModel}%20&#8211%20Have%20a%20look&#33&body=URL%3A%20https://www.southpawyachtsales.com/current-inventory%0D%0A%0D%0AModel%3A%20${boatYearMakeModel}%0D%0APrice%3A%20$%20${price}%0D%0ALocation%3A%20${boatCityState}%0D%0ALength%3A%20${boat.NominalLength}"><ion-icon name="share-social-outline" class="ion-social show-modal"></ion-icon></a>`;

    dataHtml += `
    <div class="boat-container">
        <div class="col-2-image">
          <div class="image" align="center">
            <img src="${img}" onclick="openModal(${id})">
          </div>
        </div>
        <div class="col-2">
            <div class="year-model txt-black">${trimYearMakeModel}</div>
        </div>
        <div class="col-1 left">
            <div class="txt-small txt-grey left">PRICE</div>
            <div class="txt-big txt-blue left">$${price}</div>
        </div>
        <div class="col-1 right">
            <div class="txt-small txt-grey">LOCATION</div>
            <div class="txt-big txt-black">${trimCityState}</div>
        </div>
        <div class="col-1 left">
            <div class="txt-small txt-grey left">LENGTH</div>
            <div class="txt-big txt-black left">${boatLength}</div>
        </div>
        <div class="col-1 right">
            <div class="txt-blue contact-us">
              <span>${phoneIcon}</span>
              <span>${emailIcon}</span>
              <span>${shareIcon}</span>
            </div>
        </div>
    </div>`;
    mainContainer.appendChild(div);
  }
  div.innerHTML = dataHtml;
};

/**
 * OPEN MODAL WINDOW FUNCTION
 * @author(s): Michael Brewer/Cris Blanco
 * @param (id) - DocumentID of selected boat.
 * @returns - JSON data/values of selected boat
 */
const openModal = (id) => {
  let curBoat = boats.find((e) => e.DocumentID == id),
    curBoatImgs = new Array(curBoat.Images),
    curBoatImgArr = curBoatImgs[0];
  let curImg = curBoatImgArr[0].Uri,
    cameraIcon = `<ion-icon name="camera-outline" class="ion-camera"></ion-icon>`,
    curNumOfImgs = curBoatImgArr.length;
  imgIndex = 1;
  let curMake = capFirstLetter(curBoat.MakeString),
    curModel = capFirstLetter(curBoat.ModelExact),
    curYear = curBoat.ModelYear,
    curBoatLocation =
      curBoat.BoatLocation.BoatCityName +
      `, ` +
      curBoat.BoatLocation.BoatStateCode,
    curPrice = numWithCommas(curBoat.NormPrice),
    curBoatLength = curBoat.NominalLength,
    curBoatCategoryCode = objChecker(curBoat.BoatCategoryCode),
    curBoatHullMaterialCode = objChecker(curBoat.BoatHullMaterialCode);
  let curGeneralBoatDescription = curBoat.GeneralBoatDescription[0];
  let curBoatBeamMeasure = objChecker(curBoat.BoatBeamMeasure),
    curDryWeightMeasure = objChecker(curBoat.DryWeightMeasure);
  let curEnginesMake = objChecker(curBoat.Engines[0].Make),
    curEnginesModel = objChecker(curBoat.Engines[0].Model),
    curNumberOfEngines = curBoat.NumberOfEngines,
    curTotalEnginePowerQuantity = objChecker(curBoat.TotalEnginePowerQuantity),
    curEnginesType = objChecker(curBoat.Engines[0].Type),
    curEnginesFuelType = capFirstLetter(curBoat.Engines[0].Fuel);
  let curHeadsCountNumeric = objChecker(curBoat.HeadsCountNumeric);
  let curFuelTankCapacityMeasure = tankFormat(curBoat.FuelTankCapacityMeasure),
    curWaterTankCapacityMeasure = tankFormat(curBoat.WaterTankCapacityMeasure),
    curHoldingTankCapacityMeasure = tankFormat(
      curBoat.HoldingTankCapacityMeasure
    );
  let modalDivContainer = document.getElementById(`myBoatModal`),
    modalDiv = ``,
    div = document.createElement(`div`);
  div.setAttribute(`class`, `modal-container`);
  modal.classList.remove(`hidden`);
  overlay.classList.remove(`hidden`);
  overlay.addEventListener(`click`, closeModal);
  document.querySelector(`body`).style.overflow = `hidden`;

  // Modal HTML Output
  modalDiv += `
  <div class="modal-container" align="center">
    <div class="modal-header txt-black">
      <span class="close-modal" onclick="closeModal()">&times;</span>
      <h1>${curMake}</h1>
    </div>
    <div class="modal-body">
      <div class="modal-body-image">
        <img src="${curImg}" id="mainImage">
        <div class="modal-image-previous">
          <ion-icon class="chevron movePrev" name="chevron-back-outline"></ion-icon>
        </div>
        <div class="modal-image-next">
          <ion-icon class="chevron moveNext" name="chevron-forward-outline">
          </ion-icon>
        </div>
        <div class="modal-image-counter">
          <a href"#" class="camera-icon">${cameraIcon}</a>
          <span id="image-index">${imgIndex}</span>
          <span id="num-images">/ ${curNumOfImgs}</span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="modal-footer-content">
        <button type="button" class="accordion txt-black">Details</button>
        <div class="panel">
          <div class="col-1-modal-left txt-black">Model</div>
          <div class="col-1-modal-right">${curModel}</div>
          <div class="col-1-modal-left txt-black">Year</div>
          <div class="col-1-modal-right">${curYear}</div>
          <div class="col-1-modal-left txt-black">Location</div>
          <div class="col-1-modal-right">${curBoatLocation}</div>
          <div class="col-1-modal-left txt-black">Price</div>
          <div class="col-1-modal-right">$ ${curPrice}</div>
          <div class="col-1-modal-left txt-black">Length</div>
          <div class="col-1-modal-right">${curBoatLength}</div>
          <div class="col-1-modal-left txt-black">Type</div>
          <div class="col-1-modal-right">${curBoatCategoryCode}</div>
          <div class="col-1-modal-left txt-black">Hull Material</div>
          <div class="col-1-modal-right">${curBoatHullMaterialCode}</div>
        </div>
        <button type="button" class="accordion">Description</button>
        <div class="panel">
          <div class="col-2-modal">${curGeneralBoatDescription}</div>
        </div>
        <button type="button" class="accordion">Measurements</button>
        <div class="panel">
          <div class="col-1-modal-left txt-black">Beam</div>
          <div class="col-1-modal-right">${curBoatBeamMeasure}</div>
          <div class="col-1-modal-left txt-black">Dry Weight</div>
          <div class="col-1-modal-right">${curDryWeightMeasure}</div>
        </div>
        <button type="button" class="accordion">Propulsion</button>
        <div class="panel">
          <div class="col-1-modal-left txt-black">Engine Make</div>
          <div class="col-1-modal-right">${curEnginesMake}</div>
          <div class="col-1-modal-left txt-black">Engine Model</div>
          <div class="col-1-modal-right">${curEnginesModel}</div>
          <div class="col-1-modal-left txt-black">Number of Engines</div>
          <div class="col-1-modal-right">${curNumberOfEngines}</div>
          <div class="col-1-modal-left txt-black">Total Power</div>
          <div class="col-1-modal-right">${curTotalEnginePowerQuantity}</div>
          <div class="col-1-modal-left txt-black">Engine Type</div>
          <div class="col-1-modal-right">${curEnginesType}</div>
          <div class="col-1-modal-left txt-black">Fuel Type</div>
          <div class="col-1-modal-right">${curEnginesFuelType}</div>
        </div>
        <button type="button" class="accordion">Accommodation</button>
        <div class="panel">
          <div class="col-1-modal-left txt-black">Heads</div>
          <div class="col-1-modal-right">${curHeadsCountNumeric}</div>
        </div>
        <button type="button" class="accordion">Tanks</button>
        <div class="panel">
          <div class="col-1-modal-left txt-black">Fuel Tanks</div>
          <div class="col-1-modal-right">${curFuelTankCapacityMeasure}</div>
          <div class="col-1-modal-left txt-black">Fresh Water Tanks</div>
          <div class="col-1-modal-right">${curWaterTankCapacityMeasure}</div>
          <div class="col-1-modal-left txt-black">Holding Tanks</div>
          <div class="col-1-modal-right">${curHoldingTankCapacityMeasure}</div>
        </div>
    </div>
  </div>`;
  modalDivContainer.appendChild(div);
  div.innerHTML = modalDiv;
  createModalImgUriArr(curBoatImgArr);
  accordionContent();
  setEventListeners();
};

/**
 * CREATE URI IMAGE ARRAY
 */
const createModalImgUriArr = (arr) => {
  modalImgArr = new Array();
  for (i = 0; i < arr.length; i++) {
    let boatImg = arr[i].Uri;
    modalImgArr.push(boatImg);
  }
};

/**
 * COLLAPSES SECTIONS IN MODAL
 * @ref: https://www.w3schools.com/howto/howto_js_accordion.asp
 */
const accordionContent = function () {
  let acc = document.getElementsByClassName(`accordion`);
  let i;
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener(`click`, function () {
      this.classList.toggle(`active`);
      let panel = this.nextElementSibling;
      if (panel.style.display === `block`) {
        panel.style.display = `none`;
      } else {
        panel.style.display = `block`;
      }
    });
  }
};

/**
 * SET EVENT LISTENERS
 */
const setEventListeners = () => {
  let next = document.getElementsByClassName('moveNext')[0],
    prev = document.getElementsByClassName('movePrev')[0];

  // Set Image Nav Event Listeners
  next.addEventListener(`click`, moveNext);
  prev.addEventListener(`click`, movePrev);

  // Global Keyboard Event Listeners 'e' Event
  document.addEventListener(`keydown`, function (e) {
    if (e.key === `Escape` && !modal.classList.contains(`hidden`)) {
      closeModal();
    }
  });
};

/**
 * NEXT/PREVIOUS NAVIGATION HANDLER(S)
 * @ref: https://medium.com/@marcusmichaels/how-to-build-a-carousel-from-scratch-in-vanilla-js-9a096d3b98c9
 */
const moveNext = () => {
  let modalImgUriArr = modalImgArr,
    boatImg = document.getElementById(`mainImage`),
    boatImgIndex = document.getElementById(`image-index`),
    curImg = boatImg.src;

  imgIndex = modalImgUriArr.indexOf(curImg);

  if (imgIndex === modalImgUriArr.length - 1) {
    imgIndex = 0;
    boatImg.setAttribute('src', modalImgUriArr[imgIndex]);
    boatImgIndex.textContent = imgIndex + 1;
  } else {
    imgIndex++;
    boatImg.setAttribute('src', modalImgUriArr[imgIndex]);
    boatImgIndex.textContent = imgIndex + 1;
  }
};

const movePrev = () => {
  let modalImgUriArr = modalImgArr,
    boatImg = document.getElementById(`mainImage`),
    boatImgIndex = document.getElementById(`image-index`),
    curImg = boatImg.src;

  imgIndex = modalImgUriArr.indexOf(curImg);

  if (imgIndex === 0) {
    imgIndex = modalImgUriArr.length - 1;
    boatImg.setAttribute('src', modalImgUriArr[imgIndex]);
    boatImgIndex.textContent = imgIndex + 1;
  } else {
    imgIndex--;
    boatImg.setAttribute('src', modalImgUriArr[imgIndex]);
    boatImgIndex.textContent = imgIndex + 1;
  }
};

/**
 * CLOSE(S) MODAL WINDOW
 * @ref: https://codepen.io/geoffgraham/pen/LogERe?editors=0110
 */
const closeModal = () => {
  modal.classList.add(`hidden`);
  overlay.classList.add(`hidden`);
  document.querySelector(`body`).style.overflow = `visible`;
  document.querySelector(`.modal-container`).remove();
};

/**
 * TRUNCATES A STRING AND APPENDS ELLIPSIS
 * @param text - the text to parse
 * @param length - number of character's after which to truncate
 * @returns {truncateText} - the result of the truncation process
 * @ref: https://stackoverflow.com/questions/18146354/how-can-i-cut-a-string-after-x-characters
 */
const truncText = (text, length) => {
  // When text string length is less than length
  if (text.length <= length) {
    // just return text
    return text;
  }
  // If not, trim & add ellipsis
  return text.substr(0, length) + ` \u2026`;
};

/**
 * PRINTS A NUMBER W/ COMMAS AS THOUSAND SEPARATORS
 * @param price - The value that you want to format with thousand separators.
 * @returns {number}
 * @ref: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript/2901298#2901298
 */
const numWithCommas = (price) => {
  let curStatus = boatSalesStatus;
  if (curStatus == `Active`) {
    // If API Status=Active, return price
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
  } else {
    // If API Status!=Active, return ' Sale Pending'
    return ` Sale Pending`;
  }
};

/**
 * CAPITALIZES THE FIRST CHARACTER OF A STRING (CHECKS TYPEOF)
 * @param string - the String to parse
 * @returns Capitalized - first letter (of each string?)
 * @ref: https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
 */
const capFirstLetter = (s) => {
  if (typeof s !== `string`) return ``;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * REMOVES THE PIPE CHARACTER FROM RETURNED JSON FIELD
 * @param (s) - the String/Field to parse
 * @returns {removes `|` AND/OR returns `str`}
 * @ref: https://www.geeksforgeeks.org/how-to-remove-a-character-from-string-in-javascript/
 */
const tankFormat = (s) => {
  // If it's empty
  if (typeof s !== `string`) {
    return `TBC`;
  }
  // If it's got a pipe char
  else if (s.includes(`|`)) {
    return s.replace(`|`, ` `);
  } else {
    return s;
  }
};

/**
 * CHECKS FOR `undefined` && `null` VALUES IN JSON/FIELD DATA
 * @param (obj) - the Object/Field to check
 * @returns {sanitized `obj`}
 * @ref: https://stackoverflow.com/questions/2647867/how-can-i-determine-if-a-variable-is-undefined-or-null
 */
const objChecker = (obj) => {
  if (typeof obj == `undefined`) {
    return `TBC`;
  } else if (obj == null) {
    return `N/A`;
  } else {
    return obj;
  }
};
