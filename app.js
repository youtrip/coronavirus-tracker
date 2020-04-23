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

        document.getElementById('population').innerHTML = population.toLocaleString('en');
        document.getElementById('country').innerHTML = us.toLocaleString('en');
        document.getElementById('update').innerHTML = update.substr(0, 10);
        document.getElementById('cases').innerHTML = confirmedCases.toLocaleString('en');
        document.getElementById('deaths').innerHTML = deaths.toLocaleString('en');
        document.getElementById('percent').innerHTML = ((Number(deaths)/Number(confirmedCases))*100).toLocaleString('en', {minimumFractionDigits:2, maximumFractionDigits:2}) + "%";
    }).catch(function () {
        console.log("error");
    })
    setTimeout(getCovidStats, 3600) // update every 1h
}