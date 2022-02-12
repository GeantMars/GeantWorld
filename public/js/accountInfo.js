var accountInfo = document.querySelector(".accountInfo");
var loginBtn = document.querySelector("#loginBtn");
var isDown = false;
var isRefreshing = false;

function check() {
    if(isRefreshing === false) {
        isRefreshing = true;
        axios.get("/api/v1/auth/info")
        .then(function(response) {
            isRefreshing = false;
            isDown = false;
            loginBtn.style.display = "none";
            accountInfo.style.display = "flex";
        }).catch(function(err) {
            if(err.response.status === 401) {
                loginBtn.style.display = "flex";
                accountInfo.style.display = "none";
            } else {
                if(isDown === true) return;
                isDown = true;
                isRefreshing = false;
                loginBtn.style.display = "none";
                accountInfo.style.display = "none";
            }
        });
    }
}

check();