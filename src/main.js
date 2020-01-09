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
    clear: { value: '[clear]' },
    menu: { value: '' }
};

// keybaord layout to generate
const keyboard = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", customKeys.clear],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", customKeys.backspace],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "?", customKeys.enter],
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

        switch (key) {
            case t.left:
                keySelector('left'); break;
            case t.right:
                keySelector('right'); break;
            case t.up:
                keySelector('up'); break;
            case t.down:
                keySelector('down'); break;
            case t.space:
                keySelector('space'); break;
            case t.enter:
                keySelector('enter'); break;
            case t.backspace:
                keySelector('backspace'); break;
            default:
                break;
        }
    });
}

/**
 * @method keySelector
 * @param {string} action - signifies which key is pressed
 */

function keySelector (action) {

    const matrix = [];
    let cKey = document.getElementsByClassName("current-key")[0];
    let key = {
        x: parseInt(cKey.getAttribute('data-row')), y: parseInt(cKey.getAttribute('data-col')), char: cKey.getAttribute('data-char'),
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

    // manipulate the underscore `positioner`
    const positioner = (_char) => {
        let cText = document.getElementById('viewer').innerHTML;
        document.getElementById('viewer').innerHTML = cText.slice(0, -1) + _char + '_';
    };

    // determine action/position based on trigger event
    switch (action) {
        case 'left':
            key.y = key.y === 0 ? matrix[key.x].length - 1 : key.y - 1;
            break;
        case 'right':
            key.y = key.y === matrix[key.x].length - 1 ? 0 : key.y + 1;
            break;
        case 'up':
            key.x = key.x === 0 ? matrix.length - 1 : key.x - 1;
            break;
        case 'down':
            key.x = key.x === matrix.length - 1 ? 0 : key.x + 1;
            break;
        case 'space':
            key.char === "[space]"
                ? positioner(" ")
                : key.char === "[enter]"
                    ? positioner('<br>')
                    : key.char === "[clear]"
                        ? document.getElementById('viewer').innerHTML = '' + '_'
                        // default action
                        : positioner(key.char);
            break;
        case 'enter':
            key.char !== "[enter]" && key.char !== "[space]"
                ? positioner(key.char.toUpperCase())
                : null;
            break;
        case 'backspace':
            let text = document.getElementById('viewer').innerHTML;
            document.getElementById('viewer').innerHTML =
                text.length !== 0
                    ? text = text.slice(0, -2) + '_'
                    : '';
            break;
        default:
            break;
    }

    // select key and update class
    (() => {
        cKey.classList.remove('current-key');
        document.querySelector(`[data-row="${key.x}"][data-col="${key.y}"]`).classList.add('current-key');
    })();

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
