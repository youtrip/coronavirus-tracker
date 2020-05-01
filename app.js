window.onload = function () {
    getCovidStats(225)
}

function getCovidStats(id) {
    fetch('https://coronavirus-tracker-api.herokuapp.com/v2/locations/' + id)
        .then(function (resp) {
            return resp.json()
        }).then(function (data) {
            let population = data.location.country_population;
            let update = data.location.last_updated;
            let confirmedCases = data.location.latest.confirmed;
            let deaths = data.location.latest.deaths;
            let us = data.location.country + " - " + data.location.province;
            let hisConfirmedTimelines = data.location.timelines.confirmed.timeline;
            let hisDeathsTimelines = data.location.timelines.deaths.timeline;

            let arrayConfirmedTime = [];
            let arrayConfirmedCounter = [];

            let arrayDeathsTime = [];
            let arrayDeathsCounter = [];

            for (let k in hisConfirmedTimelines){
                arrayConfirmedTime.push(k.substr(5,5));
                arrayConfirmedCounter.push(hisConfirmedTimelines[k]);
            }

            for (let k in hisDeathsTimelines){
                arrayDeathsTime.push(k.substr(5,5));
                arrayDeathsCounter.push(hisDeathsTimelines[k]);
            }

            let todayConfirmedCounter = arrayConfirmedCounter[arrayConfirmedCounter.length-1] - arrayConfirmedCounter[arrayConfirmedCounter.length-2];
            let todayDeathsCounter = arrayDeathsCounter[arrayDeathsCounter.length-1] - arrayDeathsCounter[arrayDeathsCounter.length-2];

            let ctx = document.getElementById('ConfirmedChart').getContext('2d');
            const ConfirmedChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: arrayConfirmedTime,
                    datasets: [{
                        label: 'Confirmed',
                        data: arrayConfirmedCounter,
                        fill: false,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                        ],
                        borderWidth: 1
                    }]
                },
            });

            let ctx2 = document.getElementById('DeathsChart').getContext('2d');
            const DeathsChart = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: arrayDeathsTime,
                    datasets: [{
                        label: 'Deaths',
                        data: arrayDeathsCounter,
                        fill: false,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                        ],
                        borderWidth: 1
                    }]
                },
            });

            document.getElementById('incrCases').innerText = todayConfirmedCounter.toLocaleString('en');
            document.getElementById('incrDeaths').innerText = todayDeathsCounter.toLocaleString('en');
            document.getElementById('population').innerHTML = population.toLocaleString('en');
            document.getElementById('country').innerHTML = us.toLocaleString('en');
            document.getElementById('update').innerHTML = update.substr(0, 10);
            document.getElementById('cases').innerHTML = confirmedCases.toLocaleString('en');
            document.getElementById('deaths').innerHTML = deaths.toLocaleString('en');
            document.getElementById('percent').innerHTML = ((Number(deaths) / Number(confirmedCases)) * 100).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
        }).catch(error => {
            console.log('error!');
            console.error("error");
        })

}