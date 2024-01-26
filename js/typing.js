function $(elid) {
    return document.getElementById(elid) || null;
}

function init() {
    const cursor = $("cursor");
    cursor.style.left = "0px";
}

function nl2br(txt) {
    return txt.replace(/\n/g, '');
}

function typeIt(from, e) {
    e = e || window.event;
    const typerElement = $("typer");
    const typedText = from.value;
    typerElement.innerHTML = nl2br(typedText);
}

function moveIt(count, e) {
    e = e || window.event;
    const keycode = e.keyCode || e.which;
    const cursor = $("cursor");

    if (keycode == 37 && parseInt(cursor.style.left) >= (0 - ((count - 1) * 10))) {
        cursor.style.left = `${parseInt(cursor.style.left) - 10}px`;
    } else if (keycode == 39 && (parseInt(cursor.style.left) + 10) <= 0) {
        cursor.style.left = `${parseInt(cursor.style.left) + 10}px`;
    }
}