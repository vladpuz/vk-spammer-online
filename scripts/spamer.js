"use strict";
(function() {
    class Spam {

        constructor(mode, list, text, media, tokens, delay, multiAccountMode, multiAccountDelay) {
            this._mode              = mode;
            this._list              = list.split("\n");
            this._text              = spamRandomization([], text);
            this._media             = spamRandomization([], media);
            this._tokens            = tokens.split("\n");
            this._delay             = +delay;
            this._multiAccountMode  = multiAccountMode;
            this._multiAccountDelay = +multiAccountDelay;

            function spamRandomization(arr, source) {
                let index = 0;
                for (let i = 0; i < source.length; i++) {
                    if (source[i] === "[" && source[i+1] === "[") {
                        i += 2;
                        arr.push([]);
                        if (typeof arr[index] === "string") {
                            index++;
                            arr[index].push("");
                        } else {
                            arr[index].push("");
                        }


                        while (source[i] !== "]" && source[i+1] !== "]") {
                            arr[index] += source[i];
                            i++;
                        }

                        if (source[i+1] === "]") {
                            i += 2;
                            arr[index] = arr[index].split("|");
                            for (let j = 0; j < arr[index].length; j++) {
                                arr[index][j] = arr[index][j].trim();
                            }
                            index++;
                        }

                    } else if (arr[index]) {
                        arr[index] += source[i];
                    } else {
                        arr[index] = source[i];
                    }
                }
                return arr;
            }

            for (let i = 0; i < this._text.length; i++) {
                if (typeof this._text[i] === "string") {
                    this._text[i] = this._text[i].replace(new RegExp("\n", "g"), "%0A");
                }
            }

            if (this._mode === "comments" || this._mode === "discussions") {
                for (let i = 0; i < this._list.length; i++) {
                    this._list[i] = this._list[i].split("_");
                }
            }

            function removeBlankLines(arr) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === "") {
                        arr.splice(i, 1);
                        i--;
                    }
                }
            }
            removeBlankLines(this._list);
            removeBlankLines(this._media);
            removeBlankLines(this._tokens);

        }

        static _random(min, max) {
            let rand = min - 0.5 + Math.random() * (max - min + 1);
            return Math.round(rand);
        }

        _generateMessage() {
            let message = "";
            for (let i = 0; i < this._text.length; i++) {
                if (typeof this._text[i] === "string") {
                    message += this._text[i];
                } else {
                    message += this._text[i][Spam._random(0, this._text[i].length-1)]
                }
            }
            return message;
        }

        _generateMedia() {
            let media = "";
            for (let i = 0; i < this._media.length; i++) {
                if (typeof this._media[i] === "string") {
                    media += this._media[i].trim() + ",";
                } else {
                    media += this._media[i][Spam._random(0, this._media[i].length-1)].trim() + ",";
                }
            }
            return media.slice(0, media.length-1);
        }

        _initialUrl() {
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            let url = proxyUrl + "https://api.vk.com/method/";

            switch(this._mode) {
                case "pm":
                case "conversations":
                case "conversations_auto_exit":
                    url += "messages.send?";
                    break;
                case "users_walls":
                case "group_walls":
                    url += "wall.post?";
                    break;
                case "comments":
                    url += "wall.createComment?";
                    break;
                case "discussions":
                    url += "board.createComment?";
                    break;
            }

            url += "v=5.52&";

            return url;
        }

        _setTarget() {
            switch(this._mode) {
                case "pm":
                    return "domain=";
                case "conversations":
                case "conversations_auto_exit":
                    return "chat_id=";
                case "users_walls":
                    return "owner_id=";
                case "group_walls":
                    return "owner_id=-";
                case "comments":
                    return ["owner_id=", "post_id="];
                case "discussions":
                    return ["group_id=", "topic_id="];
            }
        }

        static _consoleLog(str, success) {
            let div = document.createElement("div");
            div.innerHTML = (str);
            div.classList.add((success) ? "success" : "error");

            const date = new Date();
            let time = document.createElement("div");
            time.textContent = (date.getHours() >= 10 ? date.getHours() : "0" + date.getHours())
                + ":"
                + (date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes())
                + ":"
                + (date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds());
            time.classList.add("time");
            div.append(time);
            const console = document.getElementById("console");
            console.insertBefore(div, console.firstElementChild);
        }

        start() {
            const initialUrl = this._initialUrl();
            const target     = this._setTarget();
            let listIndex    = 0;
            let tokensIndex  = 0;

            const spaming = function() {
                const autoExit = function() {
                    if (this._mode === "conversations_auto_exit") {
                        fetch("https://cors-anywhere.herokuapp.com/https://api.vk.com/method/"
                            + "users.get?" + "v=5.52&" + `access_token=${this._tokens[0]}`)
                            .then(data => data.json())
                            .then(data => {
                                fetch("https://cors-anywhere.herokuapp.com/https://api.vk.com/method/"
                                    + "messages.removeChatUser?v=5.52&"
                                    + "chat_id=" + this._list[listIndex] + "&"
                                    + "user_id=" + data.response[0].id + "&"
                                    + `access_token=${this._tokens[0]}`)
                                    .then(data => data.json())
                                    .then(data => {
                                        if (data.error) {
                                            Spam._consoleLog(data.error.error_msg, false);
                                        } else {
                                            Spam._consoleLog("Успешный выход из беседы", true);
                                        }
                                    });
                            });
                    }
                }.bind(this);

                let url = initialUrl;
                url += `message=${this._generateMessage()}&`;
                url += `attachment=${this._generateMedia()}&`;
                console.log(this._generateMedia())

                // Set url target
                if (this._mode !== "comments" && this._mode !== "discussions") {
                    url += target + this._list[listIndex] + "&";
                } else {
                    url += target[0] + this._list[listIndex][0] + "&";
                    url += target[1] + this._list[listIndex][1] + "&";
                }
                listIndex++;
                if (listIndex === this._list.length) {
                    listIndex = 0;
                }

                // Set url token
                if (this._tokens.length === 1) {
                    url += `access_token=${this._tokens[0]}`;
                    fetch(url)
                        .then(data => data.json())
                        .then(data => {
                            if (data.error) {
                                Spam._consoleLog(data.error.error_msg, false);
                            } else {
                                Spam._consoleLog("Успешно отправлено - " + this._list[listIndex], true);
                            }
                        });
                    autoExit();
                } else {
                    const tokensInc = function() {
                        tokensIndex++;
                        if (tokensIndex === this._tokens.length) {
                            tokensIndex = 0;
                        }
                    }.bind(this);

                    switch(this._multiAccountMode) {

                        case "alternately":
                            url += `access_token=${this._tokens[tokensIndex]}`;
                            tokensInc();
                            fetch(url)
                                .then(data => data.json())
                                .then(data => {
                                    if (data.error) {
                                        Spam._consoleLog(data.error.error_msg, false);
                                    } else {
                                        Spam._consoleLog("Успешно отправлено - " + this._list[listIndex-1], true);
                                    }
                                });
                            autoExit();
                            break;

                        case "simultaneously":
                            for (let i = 0; i < this._tokens.length; i++) {
                                url += `access_token=${this._tokens[tokensIndex]}`;
                                tokensInc();
                                fetch(url)
                                    .then(data => data.json())
                                    .then(data => {
                                        if (data.error) {
                                            Spam._consoleLog(data.error.error_msg, false);
                                        } else {
                                            Spam._consoleLog("Успешно отправлено - " + this._list[listIndex-1], true);
                                        }
                                    });
                                autoExit();
                            }
                            break;

                        case "switching":
                            this._timerAccountSwitch = setInterval(function() {
                                tokensInc();
                            }.bind(this), this._multiAccountDelay * 1000);
                            url += `access_token=${this._tokens[tokensIndex]}`;
                            fetch(url)
                                .then(data => data.json())
                                .then(data => {
                                    if (data.error) {
                                        Spam._consoleLog(data.error.error_msg, false);
                                    } else {
                                        Spam._consoleLog("Успешно отправлено - " + this._list[listIndex-1], true);
                                    }
                                });
                            autoExit();
                            break;
                    }
                }
            }.bind(this);

            spaming();
            this._timerSpam = setInterval(spaming, this._delay * 1000);
        }

        stop() {
            clearInterval(this._timerSpam);
            this._timerSpam = null;
            clearInterval(this._timerAccountSwitch);
            this._timerAccountSwitch = null;
        }

    }

    document.getElementById("start").addEventListener("click", () => {
        try {
            if (document.spam._timerSpam) {
                document.spam.stop();
            }
        } catch (err) {}

        const spam_mode           = document.getElementById("spam_mode");
        const list                = document.getElementById("list");
        const text                = document.getElementById("text");
        const media               = document.getElementById("media");
        const tokens              = document.getElementById("tokens");
        const delay               = document.getElementById("delay");
        const multi_account_mode  = document.getElementById("multi_account_mode");
        const multi_account_delay = document.getElementById("multi_account_delay");

        document.spam = new Spam(
            spam_mode.value,
            list.value,
            text.value,
            media.value,
            tokens.value,
            delay.value,
            multi_account_mode.value,
            multi_account_delay.value
        );

        document.spam.start();
    });

    document.getElementById("stop").addEventListener("click", () => {
        try {
            if (document.spam) {
                document.spam.stop();
            }
        } catch (err) {}
    });
})();