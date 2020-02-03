"use strict";
(function() {
    // tokens
    const tokens = document.getElementById("tokens");
    tokens.addEventListener("input", () => {
        // Авто-высота
        tokens.style.height = "auto";
        tokens.style.height = tokens.scrollHeight + tokens.clientTop + tokens.clientLeft + "px";

        // Включение полей мультиаккаунтной рассылки
        let value = tokens.value.split("\n");
        for (let i = 0; i < value.length; i++) {
            if (value[i] === "") {
                value.splice(i, 1);
                i--;
            }
        }
        if (value.length > 1) {
            document.getElementById("multi_account_mode").removeAttribute("disabled");
        } else {
            document.getElementById("multi_account_mode").setAttribute("disabled", "true");
        }
        if (multi_account_mode.value !== "switching" || multi_account_mode.hasAttribute("disabled")) {
            document.getElementById("multi_account_delay").setAttribute("disabled", "true");
        } else {
            document.getElementById("multi_account_delay").removeAttribute("disabled");
        }

    });

    tokens.style.height = tokens.scrollHeight + tokens.clientTop + tokens.clientLeft + "px";
    const value = tokens.value.split("\n");
    for (let i = 0; i < value.length; i++) {
        if (value[i] === "") {
            value.splice(i, 1);
            i--;
        }
    }
    if (value.length > 1) {
        document.getElementById("multi_account_mode").removeAttribute("disabled");
    } else {
        document.getElementById("multi_account_mode").setAttribute("disabled", "true");
    }

    const multi_account_mode = document.getElementById("multi_account_mode");
    multi_account_mode.addEventListener("input", () => {
        if (multi_account_mode.value !== "switching") {
            document.getElementById("multi_account_delay").setAttribute("disabled", "true");
        } else {
            document.getElementById("multi_account_delay").removeAttribute("disabled");
        }
    });

    if (multi_account_mode.value !== "switching" || multi_account_mode.hasAttribute("disabled")) {
        document.getElementById("multi_account_delay").setAttribute("disabled", "true");
    }
})();