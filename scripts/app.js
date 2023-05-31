const listElement = document.getElementById("list");
const firstRow = `
    <table>
        <tr>
            <th class="sort-by-magic-circle">Círculo Mágico</th>
            <th class="sort-by-name">Nome</th>
            <th class="sort-by-cast-time">Tempo de Conjuração</th>
        </tr>
`;

const checkLoading = setInterval(() => {
    if(spells.length < spell_List.length){
        drawList();
    }
    else{
        drawList();
        clearInterval(checkLoading)
    }
}, 250);

function drawList(){
    let html;
    html = firstRow;

    spells.forEach(spell => {
        html += `
            <tr class="spell ${spell.name} ${spell.magic_circle} ${spell.cast_time}" value="${spell.name}">
                <td class="spell">${spell.magic_circle}º</td>
                <td class="spell">${spell.name}</td>
                <td class="spell">${spell.cast_time}</td>
            </tr>
        `;
    });

    listElement.innerHTML = html;
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


    html = `
        <h1>${spell.name}</h1>
        <div id="spell-stats">
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
                <h3>${spell.duration}</h3>
            </div>
        </div>
    `

    spell.description.forEach(e => {
        html += `<p>${e}</p>`
    });


    document.querySelector("#content").innerHTML = html;
}