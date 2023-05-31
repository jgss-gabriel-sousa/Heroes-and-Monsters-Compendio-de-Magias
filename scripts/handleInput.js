window.onclick = e => {
    if(e.target.classList.contains("sort-by-name")){  
        spells.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
        });
        drawList();
    }
    if(e.target.classList.contains("sort-by-magic-circle")){
        spells.sort((a, b) => a.magic_circle - b.magic_circle);
        drawList();
        console.log(spells[0])
    }
    if(e.target.classList.contains("sort-by-cast-time")){  
        spells.sort((a, b) => a.cast_time - b.cast_time);
        drawList();
    }

    if(e.target.classList.contains("spell")){
        updateContent(e.srcElement.outerText);
    }
}