window.onclick = e => {
    if(e.target.classList.contains("sort-by-name"))
        sort("name");
    if(e.target.classList.contains("sort-by-magic-circle"))
        sort("magic-circle");
    if(e.target.classList.contains("sort-by-cast-time"))
        sort("cast-time");
}

document.querySelector("#name-filter").addEventListener("input", () => {textSort()});

function setSpellLinks(){
    const menuLinks = document.querySelectorAll("#spell-list-container a");

    function handleLinkClick(event) {
        event.preventDefault();
        const href = this.getAttribute("href");
        updateContent(href.slice(1));
        history.pushState({ href }, "", href);
    }
    
    function handlePopState(event) {
        try {  
            const href = event.state.href;
            updateContent(href.slice(1));
        } catch (error) {
            ;
        }
    }

    menuLinks.forEach(function (link) {
        link.addEventListener("click", handleLinkClick);
    });

    window.addEventListener("popstate", handlePopState);
}