(function() {

    const spam_mode = document.getElementById("spam_mode");
    const list      = document.getElementById("list");

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

    function setListMode() {
        function setPlaceHolder(str) {
            list.setAttribute("placeholder", str);
        }
        function setLabel(text) {
            document.querySelector("label[for='list']").innerHTML = text;
        }
        switch(spam_mode.value) {
            case "pm":
                setLabel("Идентификаторы пользователей для рассылки. Каждый пользователь с новой строки. <a href='#pm_guide'>[?]</a>");
                mark("a[href='#pm_guide']", "pm_guide");
                setPlaceHolder("vanya_101\nid497257108\nkseniya2015\nи т.д.");
                list.value = localStorage.getItem("pm");
                break;
            case "conversations":
                setLabel("Идентификаторы бесед для рассылки. Каждая беседа с новой строки. <a href='#conversations_guide'>[?]</a>");
                mark("a[href='#conversations_guide']", "conversations_guide");
                setPlaceHolder("345\n101\n239\nи т.д.");
                list.value = localStorage.getItem("conversations");
                break;
            case "conversations_auto_exit":
                setLabel("Идентификаторы бесед для рассылки. Каждая беседа с новой строки. <a href='#conversations_auto_exit_guide'>[?]</a>");
                mark("a[href='#conversations_auto_exit_guide']", "conversations_auto_exit_guide");
                setPlaceHolder("345\n101\n239\nи т.д.");
                list.value = localStorage.getItem("conversations_auto_exit");
                break;
            case "users_walls":
                setLabel("Стандартные идентификаторы пользователей. Каждый с новой строки. <a href='#users_walls_guide'>[?]</a>");
                mark("a[href='#users_walls_guide']", "users_walls_guide");
                setPlaceHolder("115858632\n247829289\n27788181\nи т.д.");
                list.value = localStorage.getItem("users_walls");
                break;
            case "group_walls":
                setLabel("Стандартные идентификаторы групп. Каждый с новой строки. <a href='#group_walls_guide'>[?]</a>");
                mark("a[href='#group_walls_guide']", "group_walls_guide");
                setPlaceHolder("115755632\n248849289\n25818121\nи т.д.");
                list.value = localStorage.getItem("group_walls");
                break;
            case "comments":
                setLabel("Идентификаторы записей. Для групп всегда начинается с \"-\". Каждый с новой строки. <a href='#comments_guide'>[?]</a>");
                mark("a[href='#comments_guide']", "comments_guide");
                setPlaceHolder("157489262_420\n-227257809_3255\n297529259_1203\nи т.д.");
                list.value = localStorage.getItem("comments");
                break;
            case "discussions":
                setLabel("Идентификаторы обсуждений. Каждый с новой строки. <a href='#discussions_guide'>[?]</a>");
                mark("a[href='#discussions_guide']", "discussions_guide");
                setPlaceHolder("82514921_14544220\n84625170_24736522\n75625033_34796850\nи т.д.");
                list.value = localStorage.getItem("discussions");
                break;
        }
    }

    setListMode();

    spam_mode.addEventListener("input", () => {
        setListMode();
    });

})();