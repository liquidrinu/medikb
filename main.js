/**
 * @summary keyboard to control with peripherals (oldskool style)
 * @author Liquidrinu <liquidrinu@gmail.com>
 */

// custom function keys
const customKeys = {
    yes: { value: 'yes' },
    no: { value: 'no' },
    backspace: { value: '<-' },
    enter: { value: '[enter]' },
    space: { value: '[space]' },
    menu: { value: '' }
};

// keybaord layout to generate
const keyboard = [
    /*["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "!"],*/
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", customKeys.backspace],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "", customKeys.enter],
    ["z", "x", "c", "v", "b", "n", "m", customKeys.space, ".", customKeys.yes, customKeys.no]
];

// keybindings to interface with peripherals
const triggers = {
    // keyboard movement
    up: 38,
    down: 40,
    left: 37,
    right: 39,

    // general
    enter: 13,
    backspace: 8,
    space: 32,
};

///////////////////////////////////
/**
 * @description [ Code Execution (init) ]
 */
(() => {

    // prevent default keys that are used for browser functionality (ie. backspace going to previous webpage url)
    preventBrowserFunctionality(triggers);

    // create keyboard layout in html
    createKeyboard(keyboard, "container");

    // initialize event listener on the document
    addTriggers(triggers);

    // init first selected key
    (() => {
        document.getElementById('container').childNodes[0].childNodes[0].classList.add('current-key');
        document.getElementById('viewer').innerHTML = '_';
    })();


})();
///////////////////////////////////

/**
 * [Library Methods]
 * @summary All the methods needed to build the keyboard in html
 */

/**
 * @method createKeyboard
 *
 * @param {array} layout    - load the keyboard grid
 * @param {string} parentId - select the parent html element to latch on to
 */

function createKeyboard (layout = [], parentId = "container") {

    let container = document.getElementById(parentId);
    let rows = layout.length;
    let cols = layout[0].length;

    for (let x = 0; x < rows; x++) {
        const rowPosition = createRowElement(x, container);
        for (let y = 0; y < cols; y++) {
            const colPosition = y;
            const char = layout[rowPosition][colPosition];// supplied character from keyboard array
            createKey(rowPosition, colPosition, char);
        }
    };
}

/**
 * @method createRowElement
 * @param {number} rowPosition - id of the parent container
 */

function createRowElement (rowPosition = 0, container) {

    // create html `row` element
    let currentRow = document.createElement("div");
    // set id
    currentRow.id = `row-${rowPosition}`;

    // add css class
    currentRow.classList.add('row-default');

    // append element to parent container
    container.appendChild(currentRow);

    return rowPosition;
}

/**
 * @method createKey
 *
 *
 * @param {number} row  - current row position
 * @param {number} col  - current column position
 * @param {string} char - the character to populate the key with
 *
 * @description `Create a key with a supplied character`
 */

function createKey (row = 0, col = 0, char) {
    // get viewer element
    let rowElement = document.getElementById(`row-${row}`);

    // create element
    let btn = document.createElement("button");
    btn.setAttribute('data-row', row);
    btn.setAttribute('data-col', col);

    // add css class
    btn.classList.add('key-default');

    // assign char
    let _char = typeof char === 'object' ? customKey(char) : char;

    // add char attribute + visually
    btn.setAttribute('data-char', _char);
    btn.innerHTML = _char || '';

    // add to element;
    rowElement.appendChild(btn);
};

/**
 * @method customKey
 * @param {object} char
 *
 * @description - `add custom key functionality`
 */

function customKey (char) {
    return char.value;
}

/**
 * @method addTriggers
 * @summary `add keyboard event triggers`
 */

function addTriggers (triggers) {
    document.addEventListener("keyup", (e) => {

        // set event key and triggers
        let t = triggers;
        let key = event.which;

        if (key == t.left) {
            (() => { keySelector('left'); })();
        }
        if (key == t.right) {
            keySelector('right');
        }
        if (key == t.up) {
            keySelector('up');
        }
        if (key == t.down) {
            keySelector('down');
        }
        if (key == t.space) {
            keySelector('space');
        }
        if (key == t.enter) {
            keySelector('enter');
        }
        if (key == t.backspace) {
            keySelector('backspace');
        }
    });
}

/**
 * @method keySelector
 * @param {string} action - signifies which key is pressed
 */

function keySelector (action) {

    const matrix = [];
    let el = document.getElementsByClassName("current-key")[0];
    let key = {
        x: parseInt(el.getAttribute('data-row')), y: parseInt(el.getAttribute('data-col')), char: el.getAttribute('data-char'),
    };

    // re-create keyboard matrix (y I do this? NOTE: drink less coffee)
    document.getElementById("container")
        .querySelectorAll("div")
        .forEach(row => {
            matrix.push(
                Array.apply(null, Array(row.childNodes.length))
                    .map((n, i) =>
                        row.childNodes[i]
                            .getAttribute('data-char')
                    ));
        });

    // slice the underscore `positioner`


    switch (action) {
        case 'left':
            el.classList.remove('current-key');
            key.y = key.y === 0 ? matrix[key.x].length - 1 : key.y - 1;
            document.querySelector(`[data-row="${key.x}"][data-col="${key.y}"]`).classList.add('current-key');
            break;
        case 'right':
            el.classList.remove('current-key');
            key.y = key.y === matrix[key.x].length - 1 ? key.y = 0 : key.y + 1;
            document.querySelector(`[data-row="${key.x}"][data-col="${key.y}"]`).classList.add('current-key');
            break;
        case 'up':
            el.classList.remove('current-key');
            key.x = key.x === 0 ? key.x = matrix.length - 1 : key.x = key.x - 1;
            document.querySelector(`[data-row="${key.x}"][data-col="${key.y}"]`).classList.add('current-key');
            break;
        case 'down':
            el.classList.remove('current-key');
            key.x = key.x === matrix.length - 1 ? key.x = 0 : key.x = key.x + 1;
            document.querySelector(`[data-row="${key.x}"][data-col="${key.y}"]`).classList.add('current-key');
            break;
        case 'space':
            key.char === "[space]"
                ? (() => {
                    let t = document.getElementById('viewer').innerHTML;
                    document.getElementById('viewer').innerHTML = t.slice(0, -1);
                    document.getElementById('viewer').innerHTML += " " + '_';
                })()
                : key.char === "[enter]"
                    ? (() => {
                        let t = document.getElementById('viewer').innerHTML;
                        document.getElementById('viewer').innerHTML = t.slice(0, -1);
                        document.getElementById('viewer').innerHTML += '<br>' + '_';
                    })()
                    : (() => {
                        let t = document.getElementById('viewer').innerHTML;
                        document.getElementById('viewer').innerHTML = t.slice(0, -1);
                        document.getElementById('viewer').innerHTML += key.char + '_';
                    })();
            break;
        case 'enter':
            key.char !== "[enter]" && key.char !== "[space]" ?
                (() => {
                    let t = document.getElementById('viewer').innerHTML;
                    document.getElementById('viewer').innerHTML = t.slice(0, -1);
                    document.getElementById('viewer').innerHTML += key.char.toUpperCase() + '_';
                })() : null;
            break;
        case 'backspace':
            let text = document.getElementById('viewer').innerHTML;
            document.getElementById('viewer').innerHTML = text.length !== 0 ? text.slice(0, -1) : '';
            break;
        default:
            break;
    }

    return null;
}


/**
 * @method preventBrowserFunctionality
 */

function preventBrowserFunctionality (triggers) {

    document.onkeydown = function (e) {
        e = e || window.event;

        if (!e) return;

        e.preventDefault();
        e.stopPropagation();

    };
};