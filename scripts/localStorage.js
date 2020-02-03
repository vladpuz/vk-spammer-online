"use strict";
(function() {
    const spam_mode           = document.getElementById("spam_mode");
    const list                = document.getElementById("list");
    const text                = document.getElementById("text");
    const media               = document.getElementById("media");
    const tokens              = document.getElementById("tokens");
    const delay               = document.getElementById("delay");
    const multi_account_mode  = document.getElementById("multi_account_mode");
    const multi_account_delay = document.getElementById("multi_account_delay");

    if (localStorage.getItem("spam_mode")) {
        spam_mode.value = localStorage.getItem("spam_mode");
    }

    function getListValue(key) {
        if (localStorage.getItem(key)) {
            list.value = localStorage.getItem(key);
        }
    }
    switch(spam_mode.value) {
        case "pm":
            getListValue("pm");
            break;
        case "conversations":
            getListValue("conversations");
            break;
        case "conversations_auto_exit":
            getListValue("conversations_auto_exit");
            break;
        case "users_walls":
            getListValue("users_walls");
            break;
        case "group_walls":
            getListValue("group_walls");
            break;
        case "comments":
            getListValue("comments");
            break;
        case "discussions":
            getListValue("discussions");
            break;
    }

    if (localStorage.getItem("text")) {
        text.value = localStorage.getItem("text");
    }
    if (localStorage.getItem("media")) {
        media.value = localStorage.getItem("media");
    }
    if (localStorage.getItem("tokens")) {
        tokens.value = localStorage.getItem("tokens");
    }
    if (localStorage.getItem("delay")) {
        delay.value = localStorage.getItem("delay");
    }
    if (localStorage.getItem("multi_account_mode")) {
        multi_account_mode.value = localStorage.getItem("multi_account_mode");
    }
    if (localStorage.getItem("multi_account_delay")) {
        multi_account_delay.value = localStorage.getItem("multi_account_delay");
    }

    spam_mode.addEventListener("input", () => {
        localStorage.setItem("spam_mode", spam_mode.value);
    });
    list.addEventListener("input", () => {
        function setListValue(key) {
            localStorage.setItem(key, list.value);
        }
        switch(spam_mode.value) {
            case "pm":
                setListValue("pm");
                break;
            case "conversations":
                setListValue("conversations");
                break;
            case "conversations_auto_exit":
                setListValue("conversations_auto_exit");
                break;
            case "users_walls":
                setListValue("users_walls");
                break;
            case "group_walls":
                setListValue("group_walls");
                break;
            case "comments":
                setListValue("comments");
                break;
            case "discussions":
                setListValue("discussions");
                break;
        }
    });
    text.addEventListener("input", () => {
        localStorage.setItem("text", text.value);
    });
    media.addEventListener("input", () => {
        localStorage.setItem("media", media.value);
    });
    tokens.addEventListener("input", () => {
        localStorage.setItem("tokens", tokens.value);
    });
    delay.addEventListener("input", () => {
        localStorage.setItem("delay", delay.value);
    });
    multi_account_mode.addEventListener("input", () => {
        localStorage.setItem("multi_account_mode", multi_account_mode.value);
    });
    multi_account_delay.addEventListener("input", () => {
        localStorage.setItem("multi_account_delay", multi_account_delay.value);
    });
})();