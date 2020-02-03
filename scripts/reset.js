const reset = document.getElementById("reset");

reset.addEventListener("click", () => {
    const spam_mode = document.getElementById("spam_mode");
    const list = document.getElementById("list");
    const text = document.getElementById("text");
    const media = document.getElementById("media");
    const tokens = document.getElementById("tokens");
    const delay = document.getElementById("delay");
    const multi_account_mode = document.getElementById("multi_account_mode");
    const multi_account_delay = document.getElementById("multi_account_delay");

    spam_mode.value = "pm";
    list.value = "";
    text.value = "";
    media.value = "";
    tokens.value = "";
    delay.value = "10";
    multi_account_mode.value = "alternately";
    multi_account_delay.value = "300";

    function mark(anchor, id) {
        document.querySelector(anchor).onclick = function() {
            const elem = document.getElementById(id);
            elem.classList.add("mark");
            elem.style.transition = "0.1s";

            setTimeout(function () {
                elem.classList.remove("mark");
            }, 1000);
        };
    }

    document.querySelector("label[for='list']").innerHTML =
        "Идентификаторы пользователей для рассылки. Каждый пользователь с новой строки. <a href='#pm_guide'>[?]</a>";
    mark("a[href='#pm_guide']", "pm_guide");
    list.setAttribute("placeholder", "vanya_101\nid497257108\nkseniya2015\nи т.д.");
    tokens.style.height = "auto";

    const log = document.getElementById("console").childNodes;
    for (let i of log) {
        i.remove();
    }

    localStorage.clear();
});

