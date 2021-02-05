let bl = {
    you: {
        scoreSpan: "#your-result",
        div: "#your-box",
        score: 0,
    },
    bot: {
        scoreSpan: "#bot-result",
        div: "#bot-box",
        score: 0,
    },
    cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A", "J", "K", "Q"],
    cardsMap: {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        A: [1, 11],
        J: 10,
        K: 10,
        Q: 10,
    },
    wins: 0,
    losses: 0,
    draws: 0,
    isStand: false,
    turnsOver: false,
};
const YOU = bl["you"];
const BOT = bl["bot"];
const SOUNDS = [
    new Audio("swish.m4a"),
    new Audio("cash.mp3"),
    new Audio("aww.mp3"),
];

document.querySelector("#bl-hit-btn").addEventListener("click", blHit);
document.querySelector("#bl-deal-btn").addEventListener("click", blDeal);
document.querySelector("#bl-stand-btn").addEventListener("click", blStand);

function blHit() {
    if (bl["isStand"] === false) {
        bl["turnsOver"] = true;
        showCard(YOU);
    }
}

function blDeal() {
    if (bl["isStand"] == true && bl["turnsOver"] == true) {
        document.querySelector("#bl-result").textContent = "Lets Play!";
        document.querySelector("#bl-result").style.color = "black";
        bl["isStand"] = false;
        bl["turnsOver"] = false;
        removeCard(YOU);
        removeCard(BOT);
    }
}
blDeal1();

function blDeal1() {
    document.querySelector("#bl-result").textContent = "Lets Play!";
    document.querySelector("#bl-result").style.color = "black";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blStand() {
    if (bl["turnsOver"]) {
        while (BOT["score"] < 18) {
            showCard(BOT)
            await sleep(500)
        };
        bl["isStand"] = true;
        computeWinner();
    }
}

function showCard(activePlayer) {
    if (activePlayer["score"] > 21) return;
    let cardImage = document.createElement("img");
    let value = bl["cards"][Math.floor(Math.random() * 13)];
    showScore(activePlayer, value);
    cardImage.src = `static/img/${value}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    SOUNDS[0].play();
}

function showScore(activePlayer, value) {
    if (value == "A") {
        if (activePlayer["score"] == 11) activePlayer["score"] += 11;
        else activePlayer["score"] += 1;
    } else activePlayer["score"] += bl["cardsMap"][value];
    if (activePlayer["score"] > 21) {
        document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
        document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
        return;
    } else
        document.querySelector(activePlayer["scoreSpan"]).textContent =
        activePlayer["score"];
}

function removeCard(activePlayer) {
    let yourImage = document
        .querySelector(activePlayer["div"])
        .querySelectorAll("img");
    for (let i = 0; i < yourImage.length; i++) {
        yourImage[i].remove();
    }
    activePlayer["score"] = 0;
    document.querySelector(activePlayer["scoreSpan"]).textContent = 0;
    document.querySelector(activePlayer["scoreSpan"]).style.color = "white";
}

function computeWinner() {
    let winner;
    if (YOU["score"] <= 21) {
        if (YOU["score"] > BOT["score"] || BOT["score"] > 21) winner = YOU;
        else if (YOU["score"] < BOT["score"]) winner = BOT;
        else if (YOU["score"] == BOT["score"]) winner = null;
    } else if (YOU["score"] > 21 && BOT["score"] <= 21) winner = BOT;
    else if (YOU["score"] > 21 && BOT["score"] > 21) winner = null;
    console.log(winner);
    showResult(winner);
}

function showResult(winner) {
    if (winner === YOU) {
        document.querySelector("#bl-result").textContent = "You won!";
        document.querySelector("#bl-result").style.color = "green";
        SOUNDS[1].play();
        bl["wins"] += 1;
        document.querySelector("#wins").textContent = bl["wins"];
    } else if (winner === BOT) {
        document.querySelector("#bl-result").textContent = "You Lost!";
        document.querySelector("#bl-result").style.color = "red";
        SOUNDS[2].play();
        bl["losses"] += 1;
        document.querySelector("#losses").textContent = bl["losses"];
    } else if (winner === null) {
        document.querySelector("#bl-result").textContent = "Draw!";
        document.querySelector("#bl-result").style.color = "black";
        bl["draws"] += 1;
        document.querySelector("#draws").textContent = bl["draws"];
        SOUNDS[2].play();
    }
}