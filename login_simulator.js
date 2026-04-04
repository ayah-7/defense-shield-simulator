const correctUser = {
    username: "Mike",
    password: "c0mp14x_password",
    twoFA: "27892",
    securityAnswer: "Fluffy"
};

let failedAttempts = 0;
let isLocked = false;

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const twoFAInput = document.getElementById("twoFA");
const securityQuestionDiv = document.getElementById("securityQuestion");
const securityAnswerInput = document.getElementById("securityAnswer");
const messageDiv = document.getElementById("message");

function updateSecurityLayers() {
    if (failedAttempts >= 1) {
        twoFAInput.classList.remove("hidden");
    } else {
        twoFAInput.classList.add("hidden");
        twoFAInput.value = "";
    }

    if (failedAttempts >= 2) {
        securityQuestionDiv.classList.remove("hidden");
        securityAnswerInput.classList.remove("hidden");
    } else {
        securityQuestionDiv.classList.add("hidden");
        securityAnswerInput.classList.add("hidden");
        securityAnswerInput.value = "";
    }
}

function failLogin(text) {
    failedAttempts++;
    messageDiv.textContent = `${text} Failed attempts: ${failedAttempts}/3`;
    messageDiv.style.color = "#E86252";

    updateSecurityLayers();

    if (failedAttempts >= 3) {
        isLocked = true;
        messageDiv.textContent = "Too many failed attempts. Account locked.";
        form.querySelector("button").disabled = true;

        setTimeout(() => {
            window.location.href = "game.html?mode=hard";
        }, 2500);
    }
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (isLocked) {
        messageDiv.textContent = "Account is locked. Please contact support.";
        messageDiv.style.color = "#E86252";
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const twoFA = twoFAInput.value.trim();
    const securityAnswer = securityAnswerInput.value.trim();

    if (username !== correctUser.username) {
        failLogin("Incorrect username.");
        return;
    }

    if (password !== correctUser.password) {
        failLogin("Incorrect password.");
        return;
    }

    if (failedAttempts >= 1 && twoFA !== correctUser.twoFA) {
        failLogin("Incorrect 2FA code.");
        return;
    }

    if (failedAttempts >= 2 && securityAnswer !== correctUser.securityAnswer) {
        failLogin("Incorrect security answer.");
        return;
    }

    messageDiv.textContent = "Login successful! Redirecting...";
    messageDiv.style.color = "#871F78";

    setTimeout(() => {
        window.location.href = "game.html?mode=easy";
    }, 1500);
});

updateSecurityLayers();
