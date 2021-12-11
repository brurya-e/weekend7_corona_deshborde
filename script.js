myStorage = window.localStorage;
// myStorage.clear();
const coronaByCountyCodeURL = `https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/`;//+countryCode
const countriesByRegionURL = `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/`;//+crruntRegion

let crruntRegion = '';
let dataToShow = 'confirmed';
let data = (myStorage.getItem(crruntRegion)) && JSON.parse(myStorage.getItem(crruntRegion));

const allCountriesBtn = document.querySelector('.allCountries');
const regionBtn = document.querySelector('.allRegion').addEventListener('click', regionClick)
const dataToShowBtn = document.querySelector('.options').addEventListener('click', dataHandler)

async function regionClick(cruRegion) {
    //לא עובד לי ההמתנה, אז ביינתים העבדתי את זה, מילאתי את הנתונים של כל היבשות ובפעם השניה שקראתי להם הפונקציה המשיכה להצגת הנתונים וכו'
    crruntRegion = event.target.value;

    if (myStorage.getItem(crruntRegion) == null) {
        //https://stackoverflow.com/questions/43302584/why-doesnt-the-code-after-await-run-right-away-isnt-it-supposed-to-be-non-blo
        await getCountries(crruntRegion);
    }
    else {
        data = (myStorage.getItem(crruntRegion)) && JSON.parse(myStorage.getItem(crruntRegion));
        regionHandler();
    }
}

async function getCountries(crruntRegion) {
    const data = await (await fetch((countriesByRegionURL + crruntRegion), { mode: 'cors' })).json();
    let tempArray = [];
    data.forEach(country => {
        let tempobj = {
            'country': country.name.common,
            'code': country.cca2,
        };
        getInfo(country.cca2).then((res) => {
            Object.assign(tempobj, res);
            tempArray.push(tempobj);
            myStorage.setItem([crruntRegion], JSON.stringify(tempArray));
        })
    });
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
        resolve(tempobj);
    });
}

function regionHandler() {
    allCountriesBtn.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        addCountryBtn(data[i], i);
    }
    createContinentChart(data, dataToShow);
}

function addCountryBtn(country, i) {
    const element = document.createElement("input");
    element.setAttribute("type", "button");
    element.setAttribute("class", `country  ${country.country}`);
    element.setAttribute("value", country.country);
    element.addEventListener('click', () => { countryHandler(i) });
    allCountriesBtn.appendChild(element);
}
function dataHandler() {
    dataToShow = event.target.value;
    createContinentChart(data, dataToShow);
}

function countryHandler(countryIndex) {
    createContryChart(data[countryIndex]);
    //todo::remove country and code
}

function createContinentChart(cont, whichData) {
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }
    let ctx = document.querySelector('#myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: whichData + ' in ' + crruntRegion,
                    fontSize: 30
                }
            },
            legend: {
                position: 'right'
            }
        },
        data: {
            labels: cont.map(countryData => countryData.country),
            datasets: [{
                label: whichData,
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
        }
    });
}

function createContryChart(data) {
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }
    let ctx = document.querySelector('#myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'pie',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'data for ' + data.country,
                    fontSize: 30
                }
            },
            legend: {
                position: 'right'
            }
        },
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: data.country,
                data: Object.values(data),
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
        }
    });
}
