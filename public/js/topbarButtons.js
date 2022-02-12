var topbarItems = document.querySelector(".topbar_items");

Array.from(topbarItems.children).forEach(child => {
    child.onclick = () => {
        if(child.getAttribute("id") === "musicbtn") {
            window.location.href = "/music";
        }
        if(child.getAttribute("id") === "homebtn") {
            window.location.href = "/";
        }
        if(child.getAttribute("id") === "VideosBtn"){
            window.location.href = "/videos"
        }
        if(child.getAttribute("id") === "rblxbtn"){
            window.location.href = "/robloxstudioservices"
        }
        if(child.getAttribute("id") === "formsBtn"){
            window.location.href = "/rblxforms"
        }
        if(child.getAttribute("id") === "recrutBtn"){
            window.location.href = "/recrutement"
        }
        if(child.getAttribute("id") === "règlebtn"){
            window.location.href = "/reglement"
        }
        if(child.getAttribute("id") === "loginBtn") {
            window.location.href = "/account/login";
        }
        if(child.getAttribute("class") === "accountInfo") {
            window.location.href = "/account/view";
        }
    }
});