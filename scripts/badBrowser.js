var ua = window.navigator.userAgent.toLowerCase();
var is_ie = (/trident/gi).test(ua) || (/msie/gi).test(ua);
if (is_ie) {
    alert("Вы используете устаревший браузер!\n" +
        "Наш сайт не работает на Internet Explorer.\n" +
        "Скачайте один из современных браузеров: Chrome, Yandex, Firefox, Opera.")
}