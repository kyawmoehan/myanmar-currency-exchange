// const PROXY_URL = "https://thingproxy.freeboard.io/fetch/";
const PROXY_URL = "https://cors-anywhere.herokuapp.com/";
const BASE_URL = "http://forex.cbm.gov.mm/api/latest";
const Country_URL = "http://forex.cbm.gov.mm/api/currencies";

const loading = document.getElementById('loading');
const currencyContent = document.getElementById('converter-content');
const selectCountries = document.getElementById('countries');
const countryInput = document.getElementById('countryInput');
const myanmarInput = document.getElementById('myanmarInput');

let rates = {};
let selectRate = 0;


function calculateExchangeFromCountry(selectRate, countryAmount) {
    return (selectRate * countryAmount).toFixed(2);
}

countryInput.addEventListener('keyup', (event) => {
    const exchangeValue = calculateExchangeFromCountry(selectRate, event.target.value);
    myanmarInput.value = exchangeValue;
});

function calculateExchangeFromMyanmar(selectRate, myanmarAmount) {
    return (myanmarAmount / selectRate).toFixed(2);
}

myanmarInput.addEventListener('keyup', (event) => {
    const exchangeValue = calculateExchangeFromMyanmar(selectRate, event.target.value);
    countryInput.value = exchangeValue;
});


selectCountries.addEventListener('change', (event) => {
    const selectCountry = event.target.value;
    selectRate = parseFloat(rates[selectCountry].replace(/,/g, ""));

    const countryAmount = countryInput.value;
    const exchangeValue = calculateExchangeFromCountry(selectRate, countryAmount);
    myanmarInput.value = exchangeValue;
});

// initial value
function initialValue(selectRate) {
    const countryAmount = countryInput.value;
    const exchangeValue = calculateExchangeFromCountry(selectRate, countryAmount);
    myanmarInput.value = exchangeValue;
}


// fetch exchange rate
fetch(PROXY_URL + BASE_URL)
    .then((res) => res.json())
    .then((data) => {
        loading.classList.add('hide');
        currencyContent.classList.remove('hide');

        rates = data.rates;
        selectRate = parseFloat(data.rates["USD"].replace(/,/g, ""));
        initialValue(selectRate);
    })
    .catch((error) => {
        console.log(error);
    });


// fetch currencies 
fetch(PROXY_URL + Country_URL)
    .then((res) => res.json())
    .then((data) => {
        Object.keys(data.currencies).forEach(function (key) {
            const option = document.createElement("option");
            const country = document.createTextNode(data.currencies[key]);
            option.value = key;
            option.appendChild(country);
            selectCountries.append(option);
        });
    })
    .catch((error) => {
        console.log(error);
    });
