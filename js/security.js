(function() {
    'use strict';

    try {
        Object.defineProperty(window, "console", {
            value: console,
            writable: false,
            configurable: false
        });

        setInterval(function() {

            console.clear();
        }, 1000);
    } catch (e) {}

    document.addEventListener('contextmenu', event => event.preventDefault());

    document.onkeydown = function(e) {
        if (
            e.keyCode === 123 ||
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 67 || e.keyCode === 74)) ||
            (e.ctrlKey && e.keyCode === 85)
        ) {
            return false;
        }
    };

    const trap = function() {
        function d(i) {
            if (("" + i / i).length !== 1 || i % 20 === 0) {
                (function() {}.constructor("debugger")());
            } else {
                (function() {}.constructor("debugger")());
            }
            d(++i);
        }
        try {

        } catch (e) {}
    };

    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }

})();
