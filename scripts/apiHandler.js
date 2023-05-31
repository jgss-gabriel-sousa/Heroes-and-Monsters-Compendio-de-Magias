let spell_List;
let spells = [];

//const API_URL = "http://127.0.0.1:5000/";
const API_URL = "https://heroes-and-monsters-api.onrender.com/";

async function getData(){
    const response = await fetch(API_URL);
    spell_List = await response.json();
    spell_List = spell_List.spell;
}
getData().then(() => {
    spell_List.forEach(async spellName => {
        let response = await fetch(API_URL+"query-"+spellName);
        response = await response.json();
        spells.push(response);
        
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
});