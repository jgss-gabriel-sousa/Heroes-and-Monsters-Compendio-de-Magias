let sortBy = "";
let ascOrDes = "";

function sort(by){
    if(ascOrDes != "asc")
        ascOrDes = "asc"
    else
        ascOrDes = "des"

    if(by == "name"){
        if(ascOrDes == "asc"){
            spells.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
        else{
            spells.sort((a, b) => {
                if (a.name > b.name) {
                    return -1;
                }
                if (a.name < b.name) {
                    return 1;
                }
                return 0;
            });
        }
    }

    if(by == "magic-circle"){
        if(ascOrDes == "asc"){
            spells.sort((a, b) => a.magic_circle - b.magic_circle);
        }
        else{
            spells.sort((a, b) => b.magic_circle - a.magic_circle);
        }
    }

    if(by == "cast-time"){
        if(ascOrDes == "asc"){
            spells.sort((a, b) => {
                if (a.cast_time < b.cast_time) {
                    return -1;
                }
                if (a.cast_time > b.cast_time) {
                    return 1;
                }
                return 0;
            });
        }
        else{
            spells.sort((a, b) => {
                if (a.cast_time > b.cast_time) {
                    return -1;
                }
                if (a.cast_time < b.cast_time) {
                    return 1;
                }
                return 0;
            });
        }
    }

    drawList();
}

function textSort(){
    let elements = document.querySelectorAll(".spell-index");
    const searchKey = sanitizeString(document.querySelector("#name-filter").value);

    elements.forEach(e => {
        if(e.classList[0].includes(searchKey)){
            e.classList.remove("hidden");
        }
        else{
            e.classList.add("hidden");
        }
    });
}