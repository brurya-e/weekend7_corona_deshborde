myStorage = window.localStorage;
// myStorage.removeItem("asia");
const coronaByCountyCodeURL = `https://corona-api.com/countries/`;//+countryCode
const countriesByRegionURL = `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/`;//+crruntRegion
const Africa = 'africa';
const America = 'americas'
const Asia = 'asia';
const Europe = 'europe';
const Oceania = 'oceania';
let crruntRegion = '';
const info = {}

const allCountries = document.querySelector('.allCountries');

const asiaBtn = document.querySelector('.asia');
asiaBtn.addEventListener('click', () => {regionClick(Asia)});
const americaBtn = document.querySelector('.america');
americaBtn.addEventListener('click', () => {regionClick(America)});
const africaBtn = document.querySelector('.africa');
africaBtn.addEventListener('click',  () => {regionClick(Africa)});
const europeBtn = document.querySelector('.europe');
europeBtn.addEventListener('click',  () => {regionClick(Europe)});
const oceaniaBtn = document.querySelector('.oceania');
oceaniaBtn.addEventListener('click',  () => {regionClick(Oceania)});

function regionClick(region) {
    console.log(myStorage)
    tempArray = []
    crruntRegion = region;
    // if (myStorage.getItem(crruntRegion) == null) {
        getCountries(crruntRegion)
    // }
    console.log(tempArray)
    // Object.assign(info,tempArray);   
    
    //         console.log('info',info)
    
    listOfCountry();
}



async function getCountries(crruntRegion) {
    try {
        const data = await (await fetch((countriesByRegionURL + crruntRegion), { mode: 'cors' })).json();
        await(  data.forEach(country => {
            let tempobj = {
                'country': country.name.common,
                'code': country.cca2,
            };
            getInfo(country.cca2, tempobj)
        })
        // console.log('llll' ,JSON.stringify(tempArray));
        // myStorage.setItem([crruntRegion],tempArray);
        // console.log(myStorage)
        )
        

    }
    catch (e) {
        console.log(e)
    }
}.than()

async function getInfo(countryCode, obj) {
    try {
        const data = await (await fetch((coronaByCountyCodeURL + countryCode), { mode: 'cors' })).json();
        let tempobj = {
            'deaths': data.data.latest_data.deaths,
            'confirmed': data.data.latest_data.confirmed,
            'recovered': data.data.latest_data.recovered,
            'critical': data.data.latest_data.critical
        }
        
        tempArray.push(Object.assign(obj, tempobj));
        // tempArray.push(JSON.stringify(Object.assign(obj, tempobj)));


    }
    catch (e) {
        console.log(e)
    }
}

function listOfCountry() {
    let value = myStorage.getItem(crruntRegion);
    value = value && JSON.parse(value);
    const nameList =[];
    const confirmedList = [];
    const deathsList = [];
    const recoveredList = [];
    const criticalList = [];
    allCountries.innerHTML ='';
    for (let i = 0; i < value.length; i++) {
        let newCountry = `<input type="button" class ="country  ${value[i].country}" value=${value[i].country}>`
        allCountries.innerHTML+=newCountry;
console.log(value[i])
        nameList.push(value[i].country);
        confirmedList.push(value[i].confirmed);
        deathsList.push(value[i].deaths);
        recoveredList.push(value[i].recovered);
        criticalList.push(value[i].critical);


    }
    console.log(countryList);
}
