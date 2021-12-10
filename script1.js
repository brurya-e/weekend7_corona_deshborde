myStorage = window.localStorage;
const coronaByCountyCodeURL = `https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/`;//+countryCode
const countriesByRegionURL = `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/`;//+crruntRegion
const region = ['africa', 'americas', 'asia', 'europe', 'oceania']
const Africa = 0;
const America = 1;
const Asia = 2;
const Europe = 3;
const Oceania = 4;
let crruntRegion = '';
const info = {}
let tempArray = [];

const allCountries = document.querySelector('.allCountries');
const label = document.querySelector('.label');

const asiaBtn = document.querySelector('.asia');
asiaBtn.addEventListener('click', () => { regionClick(Asia) });
const americaBtn = document.querySelector('.america');
americaBtn.addEventListener('click', () => { regionClick(America) });
const africaBtn = document.querySelector('.africa');
africaBtn.addEventListener('click', () => { regionClick(Africa) });
const europeBtn = document.querySelector('.europe');
europeBtn.addEventListener('click', () => { regionClick(Europe) });
const oceaniaBtn = document.querySelector('.oceania');
oceaniaBtn.addEventListener('click', () => { regionClick(Oceania) });



async function regionClick(_region) {
    // myStorage.clear();
    //לא עובד לי ההמתנה, אז ביינתים העבדתי את זה, מילאתי את הנתונים של כל היבשות ובפעם השניה שקראתי להם הפונקציה המשיכה להצגת הנתונים וכו'
    tempArray = [];
    crruntRegion = _region;
    console.log(myStorage.getItem(region[crruntRegion]));
    if (myStorage.getItem(region[crruntRegion]) == null) {
        //https://stackoverflow.com/questions/43302584/why-doesnt-the-code-after-await-run-right-away-isnt-it-supposed-to-be-non-blo
        await getCountries(crruntRegion);

    }
    // console.log(tempArray);
    // myStorage.setItem([crruntRegion], JSON.stringify(tempArray));
    // console.log(myStorage)
    // getCountries(crruntRegion).then((res)=>{
    //     console.log(res);
    //     myStorage.setItem([crruntRegion], JSON.stringify(res));
    //     console.log(myStorage)
    // })

    // .then((res) => save(res));
    label.innerText = region[crruntRegion];

    listOfCountry();

    // }
}
function save(res) {
    console.log(res);
    myStorage.setItem([crruntRegion], JSON.stringify(res));
    console.log(myStorage)
}
async function getCountries(crruntRegion) {
    const data = await (await fetch((countriesByRegionURL + region[crruntRegion]), { mode: 'cors' })).json();
    data.forEach(country => {
        let tempobj = {
            'country': country.name.common,
            'code': country.cca2,
        };
        getInfo(country.cca2).then((res) => {
            Object.assign(tempobj, res);
            tempArray.push(tempobj)
            console.log(tempArray)
            myStorage.setItem([region[crruntRegion]], JSON.stringify(tempArray));
            console.log(myStorage)
        })
    });
    // listOfCountry();
    // myStorage.setItem([crruntRegion], JSON.stringify(tempArray));
    // console.log('in',myStorage)

}

async function getInfo(countryCode, obj) {
    const data = await (await fetch((coronaByCountyCodeURL + countryCode), { mode: 'cors' })).json();
    return new Promise((resolve, reject) => {
        let tempobj = {
            'deaths': data.data.latest_data.deaths,
            'confirmed': data.data.latest_data.confirmed,
            'recovered': data.data.latest_data.recovered,
            'critical': data.data.latest_data.critical
        }
        resolve(tempobj)
    })
}

function listOfCountry() {
    let value = myStorage.getItem(region[crruntRegion]);
    value = value && JSON.parse(value);
    console.log(value)
    const nameList = [];
    const confirmedList = [];
    const deathsList = [];
    const recoveredList = [];
    const criticalList = [];
    allCountries.innerHTML = '';
    for (let i = 0; i < value.length; i++) {
        addCountryBtn(value[i],i);

        nameList.push(value[i].country);
        confirmedList.push(value[i].confirmed);
        deathsList.push(value[i].deaths);
        recoveredList.push(value[i].recovered);
        criticalList.push(value[i].critical);

    }
    createContinentChart(value, confirmed);

function addCountryBtn(country,i) {
    let element = document.createElement("input");
    element.setAttribute("type", "button");
    element.setAttribute("class", `country  ${country.country}`);
    element.setAttribute("value", country.country);
    // element.setAttribute("onclick", `(e) => { countryClick(e) }`);
    element.addEventListener('click', ()=> {countryClick(i)});
    allCountries.appendChild(element);
    console.log(element);
}


function countryClick(countryBtn) {
    console.log(countryBtn)
}


function createContinentChart(cont, whichData) {
    // destroy the old chart
    let ctx = document.querySelector('#myChart').getContext('2d');

    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: cont.map(countryData => countryData.name),
            datasets: [{
                label: '# of Votes',
                data: cont.map(countryData => countryData[whichData]),
                backgroundColor: [
                    'rgba(0, 99, 132, 0.2)',
                    'rgba(0, 0, 0, 0.2)',
                    'rgba(255, 255, 255, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}