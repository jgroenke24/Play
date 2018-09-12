const commentCollapser = document.querySelector("#commentCollapser");
const collapseComment = document.querySelector("#collapseComment");
commentCollapser.addEventListener("click", function(e) {
    collapseComment.classList.toggle("collapse");
});

function editComment(id) {
    document.querySelector(`#collapseEditText${id}`).classList.toggle("collapse");
    document.querySelector(`#collapseEdit${id}`).classList.toggle("collapse");
    
};

function updatePlayers(id) {
    let request = new XMLHttpRequest();
    request.open("GET", `/games/${id}/get-players`, true);
    
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            const data = JSON.parse(request.responseText);
            const list = document.querySelector(".info-player-list");
            while (list.firstChild) {
                list.removeChild(list.firstChild);
            }
            Array.from(data, (player) => {
                let playerNode = document.createElement("li");
                playerNode.className = "info-player";
                playerNode.textContent = player.username;
                list.appendChild(playerNode);
            });
        } else {
            // We reached our target server, but it returned an error

        }
    };
    
    request.onerror = function() {
        // There was a connection error of some sort
    };
    
    request.send();
}

function addPlayer(gameId, userId) {
    
    let addPlayerButton = document.querySelector("#addPlayer");
    let removePlayerButton = document.querySelector("#removePlayer");
    
    let data = `user=${userId}`;
    
    let request = new XMLHttpRequest();
    request.open("POST", `/games/${gameId}/add-player`, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
        // Success!
        updatePlayers(gameId);
        addPlayerButton.classList.add("selected");
        addPlayerButton.setAttribute("onclick", "");
        removePlayerButton.classList.remove("selected");
        removePlayerButton.setAttribute("onclick", `removePlayer('${gameId}', '${userId}')`);
        } else {
        // We reached our target server, but it returned an error
        }
    };
    request.send(data);
}

function removePlayer(gameId, userId) {
    
    let addPlayerButton = document.querySelector("#addPlayer");
    let removePlayerButton = document.querySelector("#removePlayer");
    
    let data = `user=${userId}`;
    
    let request = new XMLHttpRequest();
    request.open("POST", `/games/${gameId}/remove-player`, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
        // Success!
        updatePlayers(gameId);
        removePlayerButton.classList.add("selected");
        removePlayerButton.setAttribute("onclick", "");
        addPlayerButton.classList.remove("selected");
        addPlayerButton.setAttribute("onclick", `addPlayer('${gameId}', '${userId}')`);
        } else {
        // We reached our target server, but it returned an error
        }
    };
    request.send(data);
}