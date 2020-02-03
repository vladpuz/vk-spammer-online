"use strict";
(function() {
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

    mark("a[href='#media_guide']", "media_guide");
    mark("a[href='#tokens_guide']", "tokens_guide");
    mark("a[href='#text_guide']", "text_guide");
})();