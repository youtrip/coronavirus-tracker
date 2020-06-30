const sessionKey = 'covid_location';
const buttonStyle = 'btn-warning';
const sessionLocationIDKey = 'covid_location_id';
let baseLocalJson = {
    225: '美国',
    131: '印度',
    120:'德国',
    116: '法国',
    137: '意大利',
    196: '新加坡',
    187: '俄罗斯',
    200: '南非',
    205: '瑞典',
    139: '日本',
    201: '西班牙',
    223: '英国',
    28: '巴西',
    153: '马来西亚',
    143: '韩国'
};

window.onload = function () {
    setAddLocationsSelect();
    setLacationButton();
    getCovidStats(225);
};

//取所有地区ID，增加到下拉框选项中
function setAddLocationsSelect() {
    let ids = getAllLocationID();
    for(let id in ids){
        addOptionList(id,ids[id]);
    }
}

//填充地区按钮
//从本地缓存取自定义地区列表，没有则用默认地区列表，最后填充到html中。
function setLacationButton() {

    let location = localStorage.getItem(sessionKey);
    if (location == null){
        localStorage.setItem(sessionKey, JSON.stringify(baseLocalJson));
        location = localStorage.getItem(sessionKey);
    }

    let localJson = JSON.parse(location);
    for (let id in localJson){
        newBotton(id,localJson);
    }
}

//增加到下拉框option选项中。
function addOptionList(id,name) {
    let selectList = document.getElementById('selectCountryID');
    let option = document.createElement('option');
    option.setAttribute('value', id);
    option.innerText = name;
    selectList.appendChild(option);
}

//恢复到默认地区按钮列表。并强制浏览器刷新。
function resetLocation() {
    localStorage.removeItem(sessionKey);
    localStorage.removeItem(sessionLocationIDKey);
    window.location.reload();
}

//从接口获取所有的地区ID和名称，并缓存到本地。
//返回所有地区id的json数据。
function getAllLocationID() {
    let ids = localStorage.getItem(sessionLocationIDKey);
    if (ids==null){
        let allID = {};
        fetch('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=jhu&timelines=false')
            .then(function (resp) {
                return resp.json()
            }).then(function (data) {
            let name ='';
            for(let key in data.locations){
                if (data.locations[key].province ==''){
                    name = data.locations[key].country + '(' + data.locations[key].country_code + ')';
                }else{
                    name = data.locations[key].country + '(' + data.locations[key].country_code + ')-' + data.locations[key].province;
                }
                allID[data.locations[key].id] = name;
            }
            localStorage.setItem(sessionLocationIDKey, JSON.stringify(allID));
            return JSON.parse(localStorage.getItem(sessionLocationIDKey));
        }).catch(error => {
            console.log('error!');
            console.error("error");
        });

    }else{
        return JSON.parse(ids);
    }


}

//新增地区按钮组
function newBotton(id,localJson) {
    let buttonRowGroup = document.getElementById('buttonGroup');
    let buttonGroup = document.createElement('div');
    buttonGroup.setAttribute('id','location-'+id);
    buttonGroup.classList.add('btn-group');

    let localButton = document.createElement('button');
    localButton.setAttribute('onclick', 'getCovidStats('+id+')');
    localButton.setAttribute('type','button');
    localButton.classList.add('btn');
    localButton.classList.add(buttonStyle);
    localButton.innerText = localJson[id];
    buttonGroup.appendChild(localButton);

    let localButtonCaret = document.createElement('button');
    localButtonCaret.setAttribute('type','button');
    localButtonCaret.setAttribute('data-toggle','dropdown');
    localButtonCaret.setAttribute('aria-expanded','false');
    localButtonCaret.setAttribute('aria-haspopup','true');
    localButtonCaret.classList.add('btn');
    localButtonCaret.classList.add(buttonStyle);
    localButtonCaret.classList.add('dropdown-toggle');
    buttonGroup.appendChild(localButtonCaret);

    let spanCaret = document.createElement('span');
    spanCaret.classList.add('caret');
    localButtonCaret.appendChild(spanCaret);

    let ul = document.createElement('ul');
    ul.classList.add('dropdown-menu');
    buttonGroup.appendChild(ul);

    let li = document.createElement('li');
    ul.appendChild(li);

    let link = document.createElement('a');
    link.setAttribute('href','#');
    link.setAttribute('onclick', 'deleteLocation('+id+')');

    link.innerText = '删除';
    li.appendChild(link);

    buttonRowGroup.appendChild(buttonGroup);
}

// 删除指定ID的地区按钮
function deleteLocation(id) {
    let location = localStorage.getItem(sessionKey);
    let localJson = JSON.parse(location);
    delete localJson[id];
    localStorage.setItem(sessionKey, JSON.stringify(localJson));

    let delLocation = document.getElementById('location-'+id);
    delLocation.classList.add('hidden');
}

// 增加地区按钮
function addLocation() {
    let location = localStorage.getItem(sessionKey);
    let newid = document.getElementById('selectCountryID');
    let newname = document.getElementById('inputName');
    let localJson = JSON.parse(location);
    let id = newid.value;
    let name = newname.value;
    if (id !=='' && name !==''){
        let location = localStorage.getItem(sessionKey);
        localJson[id] = name;
        localStorage.setItem(sessionKey, JSON.stringify(localJson));
        newBotton(id,localJson);
    } else if(id === '-1'){
        alert('请选择正确的国家或地区！')
    }
}

// 获取接口指定地区的数据，并填充到html中。
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

function pushToInput() {
    let newid = document.getElementById('selectCountryID');
    let inputLocation = document.getElementById('inputName');
    // inputLocation.value = newid.innerText
}
