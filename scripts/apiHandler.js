let spell_List;
let spells = [];

//const API_URL = "http://127.0.0.1:5000/";
const API_URL = "https://heroes-and-monsters-api.onrender.com/";

async function getData(){
    cachedSpellList = localStorage.getItem("hnm_spell_list");
    cacheDate = localStorage.getItem("hnm_spell_list_date");
    
    if(cachedSpellList && new Date().getDay() == new Date(cacheDate).getDay()){
        spell_List = JSON.parse(cachedSpellList);
        console.log(cacheDate)
        console.log(cachedSpellList)
    }
    else{
        const response = await fetch(API_URL);
        spell_List = await response.json();
        spell_List = spell_List.spell;
        localStorage.setItem("hnm_spell_list", JSON.stringify(spell_List));
        localStorage.setItem("hnm_spell_list_date", String(new Date()));
    }
}
getData().then(() => {
    spell_List.forEach(async spellName => {

        cachedSpell = localStorage.getItem("hnm_spells_"+spell_List.spell);
        if(localStorage.getItem("hnm_spells_"+spell_List.spell) && new Date().getDay() != localStorage.getItem("hnm_spells_"+spell_List.spell)){
            
            const last = new Date(localStorage.getItem("lastTodayBibi"));
        }


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