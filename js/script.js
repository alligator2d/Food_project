window.addEventListener('DOMContentLoaded', () => {
    const tabs = require('./modules/tabs');
    const calc = require('./modules/calc');
    const cards = require('./modules/cards');
    const forms = require('./modules/forms');
    const modal = require('./modules/modal');
    const slider = require('./modules/slider');
    const timer = require('./modules/timer');

    tabs();
    calc();
    cards();
    forms();
    modal();
    slider();
    timer();

});
