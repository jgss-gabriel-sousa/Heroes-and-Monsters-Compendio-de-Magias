const listElement = document.getElementById("spell-list");
const firstRow = `
    <ul>
        <li id="list-header">
            <span class="sort-by-magic-circle">Círculo Mágico</span>
            <span class="sort-by-name">Nome</span>
            <span class="sort-by-cast-time">Tempo de Conjuração</span>
        </li>
`;

function sanitizeString(string){
    const withoutSpaces = string.replace(/\s/g, '_');
    const withoutAccents = withoutSpaces.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return withoutAccents.toLowerCase();
}

const checkLoading = setInterval(() => {
    document.querySelector("#spell-list").classList.add("loading");
    document.querySelector("#content").classList.add("loading");

    if(spells.length < spell_List.length){
        drawList();
    }
    else{
        drawList();
        clearInterval(checkLoading);
        
        document.querySelector("#spell-list").classList.remove("loading");
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