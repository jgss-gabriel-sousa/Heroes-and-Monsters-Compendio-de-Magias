let spell_List;
let spells = [];

const API_URL = "https://gp-tycoon-web-service.onrender.com/hnm";
let loadFromCache = false;

async function getData(){
    let cachedSpellList = localStorage.getItem("hnm_spell_list");
    let cacheDate = localStorage.getItem("hnm_spell_list_date");
    
    if(cachedSpellList && new Date().getDay() == new Date(cacheDate).getDay()){
        spell_List = JSON.parse(cachedSpellList);
        loadFromCache = true;
    }
    else{
        const response = await fetch(API_URL+"/");
        spell_List = await response.json();
        spell_List = spell_List.spell;
        localStorage.setItem("hnm_spell_list", JSON.stringify(spell_List));
        localStorage.setItem("hnm_spell_list_date", String(new Date()));
    }
}
getData().then(() => {
    if(loadFromCache && localStorage.getItem("hnm_spells")){
        spells = JSON.parse(localStorage.getItem("hnm_spells"));
    }
    else{
        spell_List.forEach(async spellName => {
            let response = await fetch(API_URL+"/query-"+spellName);
            response = await response.json();
            spells.push(response);
            localStorage.setItem("hnm_spells", JSON.stringify(spells));
            
            spells.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        });
    }
});

const listElement = document.getElementById("spell-list-container");
const firstRow = `
    <div id="list-header">
        <span class="sort-by-magic-circle">Círculo Mágico</span>
        <span class="sort-by-name">Nome</span>
        <span class="sort-by-cast-time">Tempo de Conjuração</span>
    </div>
    <div id="spell-list">
    <ul>
`;

function sanitizeString(string){
    const withoutSpaces = string.replace(/\s/g, '_');
    const withoutAccents = withoutSpaces.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return withoutAccents.toLowerCase();
}

const checkLoading = setInterval(() => {
    document.querySelector("#spell-list-container").classList.add("loading");
    document.querySelector("#content").classList.add("loading");

    if(spells.length < spell_List.length-1){
        drawList();
    }
    else{
        drawList();
        clearInterval(checkLoading);
        
        document.querySelector("#spell-list-container").classList.remove("loading");
        document.querySelector("#content").classList.remove("loading");

        setSpellLinks();
    }
}, 250);

function drawList(){
    let html;
    html = firstRow;

    spells.forEach(spell => {
        html += `
        <li class="${sanitizeString(spell.name)} spell-index" value="${spell.name}">
            <a class="spell" href="#${spell.name}">
                <span>${spell.magic_circle}º</span>
                <span>${spell.name}</span>
                <span>${spell.cast_time}</span>
            </a>
        </li>
        `;
    });

    html += `</ul></div>`

    listElement.innerHTML = html;
    setSpellLinks();

    if(document.querySelector("#name-filter").value != "") textSort();
}

function updateContent(spellName){
    let html = "";
    let spell;

    for(let i = 0; i < spells.length; i++){
        if(spells[i].name == spellName){
            spell = spells[i];
        }
    }

    if(!spell) return;

    let classes = JSON.stringify(spell.class).replace(/[\[\]"]/g, '');
    classes = classes.replace(/,/g, ', ');

    html = `
        <h1>${spell.name}</h1>
        <h4>${classes}</h4>
        <div class="spell-stats">
            <div>
                <h2>Círculo</h2>
                <h3>${spell.magic_circle}º</h3>
            </div>
            <div>
                <h2>Tempo de Conjuração</h2>
                <h3>${spell.cast_time}</h3>
            </div>
            <div>
                <h2>Alcance</h2>
                <h3>${spell.range}</h3>
            </div>
            <div>
                <h2>Duração</h2>
                <h3>${spell.duration || "Instantânea"}</h3>
            </div>
        </div>
        <div class="spell-stats">
    `

    if(spell.concentration){
        html += `   
        <div>
            <h2>Exige Concentração</h2>
        </div>`
    }
    if(spell.attack_roll){
        html += `   
        <div>
            <h2>Exige Rolagem de Ataque</h2>
        </div>`
    }

    html += "</div><hr>"

    spell.description.forEach(e => {
        html += `<p>${e}</p>`
    });

    if(spell.damage.length || spell.heal)
        html += `<hr>`

    spell.damage.forEach(e => {
        html += `<p><b>${e[0]}:</b> ${e[1]}</p>`
    });

    if(spell.heal){
        html += `<p><b>Cura:</b> ${spell.heal}</p>`
    }

    if(spell.spell_evolution.length){
        html += `<hr>`
        if(spell.spell_evolution_type == "level")    html += `<p>Esta magia evolui conforme seu nível de conjurador:</p>`;
        if(spell.spell_evolution_type == "mana")   html += `<p>Esta magia evolui se conjurada com o custo de mana de um círculo superior:</p>`;


        html += `<table id="spell-evolution"><tr><th>`;
        if(spell.spell_evolution_type == "mana")    html += `Custo Adicional`;
        if(spell.spell_evolution_type == "level")   html += `Requisito`;
        html += `</th><th>Evolução</th></tr>`;

        spell.spell_evolution.forEach(e => {
            if(spell.spell_evolution_type == "mana"){
                html += `<tr><td>${e[0]} de Mana</td><td>${e[1]}</td>`
            }
            if(spell.spell_evolution_type == "level"){
                html += `<tr><td>${e[0]}º Nível</td><td>${e[1]}</td>`
            }
        });
        html += "</table>";
    }

    document.querySelector("#content").innerHTML = html;
}