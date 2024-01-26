var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");

var git = 0;
var commands = [];

setTimeout(function() {
    loopLines(banner, "", 50);
    textarea.focus();
}, 60);

window.addEventListener("keyup", enterKey);

textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
    if (e.keyCode == 181) {
        document.location.reload(true);
    }
    if (e.keyCode == 13) {
        commands.push(command.innerHTML);
        git = commands.length;
        addLine("snow@GenBooh:~$ " + command.innerHTML, "no-animation", 0);
        commander(command.innerHTML.toLowerCase());
        command.innerHTML = "";
        textarea.value = "";
    }
    if (e.keyCode == 38 && git != 0) {
        git -= 1;
        textarea.value = commands[git];
        command.innerHTML = textarea.value;
    }
    if (e.keyCode == 40 && git != commands.length) {
        git += 1;
        if (commands[git] === undefined) {
            textarea.value = "";
        } else {
            textarea.value = commands[git];
        }
        command.innerHTML = textarea.value;
    }
}

// for correcting incorrect inputs
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // initialize the matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // fill in the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// helper method for autocorrection
function suggestCommand(input) {
    const commands = ["help", "whois", "neofetch", "history", "clear", "discord", "github"];

    let minDistance = Infinity;
    let closestCommand = "";

    // find the closest command
    for (const command of commands) {
        const distance = levenshteinDistance(input, command);
        if (distance < minDistance) {
            minDistance = distance;
            closestCommand = command;
        }
    }

    return closestCommand;
}

// command handling
function commander(cmd) {
    switch (cmd.toLowerCase()) {
        case "help":
            loopLines(help, "error margin", 80);
            break;
        case "whois":
            loopLines(whois, "error margin", 80);
            break;
        case "neofetch":
            loopLines(neofetch, "error margin", 80);
            break;
        case "history":
            addLine("<br>", "", 0);
            loopLines(commands, "error", 80);
            addLine("<br>", "command", 80 * commands.length + 50);
            break;
        case "clear":
            setTimeout(function() {
                terminal.innerHTML = '<a id="before"></a>';
                before = document.getElementById("before");
            }, 1);
            break;
        case "banner":
            loopLines(banner, "", 80);
            break;
        case "discord":
            addLine("Tag: thissnow", "error", 0);
            break;
        case "github":
            addLine("Opening GitHub...", "error", 0);
            newTab(github);
            break;
        default:
            const suggestedCommand = suggestCommand(cmd);

            // disable the text input field
            const texter = document.getElementById('texter');
            texter.disabled = true;

            addLine(`zsh: correct '${cmd}' to '${suggestedCommand}'? [yn] `, "white", 0, true);

            // handle user response
            document.addEventListener('keypress', function onResponse(event) {
                // prevent the keypress from appearing in the text field
                event.preventDefault();

                // check if the user pressed 'y'
                if (event.key.toLowerCase() === 'y') {
                    // Display the correction message and execute the corrected command
                    addLine(`zsh: corrected '${cmd}' to '${suggestedCommand}'`, "white", 0);
                    commander(suggestedCommand);
                } else {
                    addLine(`<span class="inherit">zsh: command not found: ${cmd}</span>`, "error", 100);
                }

                // enable the text input field again
                texter.disabled = false;

                // Set focus back to the text input field
                texter.focus();

                // Remove the event listener to avoid multiple responses
                document.removeEventListener('keypress', onResponse);
            });
            break;
    }
}

function newTab(link) {
    setTimeout(function() {
        window.open(link, "_blank");
    }, 500);
}

function addLine(text, style, time) {
    var t = "";
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
            t += "&nbsp;&nbsp;";
            i++;
        } else {
            t += text.charAt(i);
        }
    }
    setTimeout(function() {
        var next = document.createElement("p");
        next.innerHTML = t;
        next.className = style;

        before.parentNode.insertBefore(next, before);

        window.scrollTo(0, document.body.offsetHeight);
    }, time);
}

function loopLines(name, style, time) {
    name.forEach(function(item, index) {
        addLine(item, style, index * time);
    });
}