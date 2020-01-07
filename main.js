/**
 * @summary keyboard to control with arduino
 * @author Liquidrinu
 */

// keybaord layout to generate
const keyboard = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ""],
    ["z", "x", "c", "v", "b", "n", "m", "", "", ""]
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

/**
 * [ Code Execution (init) ]
 */

///////////////////////////////////
(() => {

    // create keyboard layout in html
    createKeyboard(keyboard, "container");

    // initialize event listener on the document
    document.addEventListener("keyup", (e) => {
        // set event key and triggers
        let t = triggers;
        let key = event.which;

        if (key == t.left) {
            alert('left');
        }
        if (key == t.right) {
            alert('right');
        }
        if (key == t.up) {
            alert('up');
        }
        if (key == t.down) {
            alert('down');
        }
        if (key == t.enter) {
            alert('enter');
        }
    });
})(triggers);

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

function createKey (row = 0, col = 0, char = '') {
    // get viewer element
    let rowElement = document.getElementById(`row-${row}`);

    // create element
    let btn = document.createElement("button");
    btn.setAttribute('data-key', `col-${col}`);

    // add css class
    btn.classList.add('key-default');

    // add char attribute + visually
    btn.setAttribute('data-char', char || 'empty');
    btn.innerHTML = char || '[empty]';

    // add to element;
    rowElement.appendChild(btn);
};
