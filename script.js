// clock
function updateTime() {
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
updateTime();
setInterval(updateTime, 1000); 

// draggable window
function dragElement(element) {
    var initialX = 0;
    var initialY = 0;
    var currentX = 0;
    var currentY = 0;

    if (document.getElementById(element.id + "header")) {
        document.getElementById(element.id + "header").onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e = e || window.event;

        if (e.target.closest(".window-controls")) {
            return; // don't drag if a control button is clicked
        }

        e.preventDefault();

        var wasMaximized = element.classList.contains("window-maximized");

        if (wasMaximized) {
            var rect = element.getBoundingClientRect();
            element.classList.remove("window-maximized");
            element.style.removeProperty("position");
            element.style.removeProperty("right");
            element.style.removeProperty("bottom");
            element.style.removeProperty("max-width");
            element.style.removeProperty("max-height");

            var parentRect = element.offsetParent.getBoundingClientRect();
            element.style.width = rect.width + "px";
            element.style.height = rect.height + "px";
            element.style.top = (rect.top - parentRect.top) + "px";
            element.style.left = (rect.left - parentRect.left) + "px";
            element.style.transform = "none";
        } else {
            var parentRect = element.offsetParent.getBoundingClientRect();
            var rect = element.getBoundingClientRect();
            element.style.top = (rect.top - parentRect.top) + "px";
            element.style.left = (rect.left - parentRect.left) + "px";
            element.style.transform = "none";
        }

        element.style.transition = "none";

        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = moveElement;

        handleWindowTap(element);
    }

    function moveElement(e) {
        e = e || window.event;
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;

        var newTop = element.offsetTop - currentY;
        var newLeft = element.offsetLeft - currentX;
        var parentRect = element.offsetParent.getBoundingClientRect();

        if (newTop < 0) {
            newTop = 0;
        }
        if (newLeft < 0) {
            newLeft = 0;
        }
        if (newLeft + element.offsetWidth > parentRect.width) {
            newLeft = parentRect.width - element.offsetWidth;
        }
        if (newTop + element.offsetHeight > parentRect.height) {
            newTop = parentRect.height - element.offsetHeight;
        }

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// window fuctions

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.classList.remove("window-minimizing");
    element.style.display = "flex";
    handleWindowTap(element);
}

function minimizeWindow(element) {
    if (element.classList.contains("window-maximized")) {
        element.classList.remove("window-maximized");
        clearMaximizedInlineStyles(element);
    }

    element.classList.add("window-minimizing");
    setTimeout(function () {
        element.style.display = "none";
    }, 200);
}

function toggleMaximizeWindow(element) {
    var isMaximizing = !element.classList.contains("window-maximized");
    element.classList.toggle("window-maximized");

    if (isMaximizing) {
        applyMaximizedSize(element);
    } else {
        restoreFromMaximized(element);
    }
}

function restoreFromMaximized(element) {
    var maximizedRect = element.getBoundingClientRect();

    clearMaximizedInlineStyles(element);
    var restingRect = element.getBoundingClientRect();
    var parentRect = element.offsetParent.getBoundingClientRect();

    element.style.position = "fixed";
    element.style.top = maximizedRect.top + "px";
    element.style.left = maximizedRect.left + "px";
    element.style.width = maximizedRect.width + "px";
    element.style.height = maximizedRect.height + "px";
    element.style.transform = "none";

    void element.offsetHeight;

    element.style.position = "absolute";
    element.style.top = (restingRect.top - parentRect.top) + "px";
    element.style.left = (restingRect.left - parentRect.left) + "px";
    element.style.width = restingRect.width + "px";
    element.style.height = restingRect.height + "px";

    setTimeout(function () {
        clearMaximizedInlineStyles(element);
    }, 260);
}

function clearMaximizedInlineStyles(element) {
    ["position", "width", "height", "top", "left", "right", "bottom",
     "max-width", "max-height", "transform"].forEach(function (prop) {
        element.style.removeProperty(prop);
    });
}

function applyMaximizedSize(element) {
    var rootStyle = getComputedStyle(document.documentElement);
    var topbarHeight = parseFloat(rootStyle.getPropertyValue("--topbar-height")) || 34;
    var bottombarHeight = parseFloat(rootStyle.getPropertyValue("--bottombar-height")) || 64;

    var rect = element.getBoundingClientRect();
    var parentRect = element.offsetParent.getBoundingClientRect();
    element.style.top = (rect.top - parentRect.top) + "px";
    element.style.left = (rect.left - parentRect.left) + "px";
    element.style.width = rect.width + "px";
    element.style.height = rect.height + "px";
    element.style.transform = "none";

    void element.offsetHeight;

    element.style.setProperty("position", "fixed", "important");
    element.style.setProperty("top", (topbarHeight + 16) + "px", "important");
    element.style.setProperty("left", "16px", "important");
    element.style.setProperty("right", "16px", "important");
    element.style.setProperty("bottom", (bottombarHeight + 16) + "px", "important");
    element.style.setProperty("width", "auto", "important");
    element.style.setProperty("height", "auto", "important");
    element.style.setProperty("max-width", "none", "important");
    element.style.setProperty("max-height", "none", "important");
    element.style.setProperty("transform", "none", "important");
}

// z-index 

var biggestIndex = 1;
var topBar = document.querySelector(".top-bar");

function handleWindowTap(element) {
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topBar.style.zIndex = biggestIndex + 1;
}

function addWindowTapHandling(element) {
    element.addEventListener("mousedown", function() {
        handleWindowTap(element);
    });
}

//

function wireWindowControls(element, idPrefix, onClose) {
    document.querySelector("#" + idPrefix + "close").addEventListener("click", function () {
        closeWindow(element);
        if (onClose) {
            onClose();
        }
    });

    document.querySelector("#" + idPrefix + "minimize").addEventListener("click", function () {
        minimizeWindow(element);
    });

    document.querySelector("#" + idPrefix + "maximize").addEventListener("click", function () {
        toggleMaximizeWindow(element);
    });

    dragElement(element);
    addWindowTapHandling(element);
}

// welcome window

var welcomeWindow = document.querySelector("#welcome");
var windowOpen = document.querySelector("#windowopen");

windowOpen.addEventListener("click", function() {
    openWindow(welcomeWindow);
});

wireWindowControls(welcomeWindow, "welcome");

// frog notes

var notesStorageKey = "frogos-notes";

var defaultNotes = [
    {
        title: "Note 1",
        content: "This is your first note. Click the title or the text below to start writing."
    },
    {
        title: "Note 2",
        content: "Second note goes here."
    }
];

function loadNotes() {
    try {
        var saved = localStorage.getItem(notesStorageKey);
        if (saved) {
            var parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                var valid = parsed.every(function (note) {
                    return note && typeof note === "object";
                });
                if (valid) {
                    return parsed;
                }
            }
        }
    } catch (err) {
        console.error("Couldn't read saved notes:", err);
    }
    return defaultNotes.slice();
}

function saveNotes() {
    try {
        localStorage.setItem(notesStorageKey, JSON.stringify(notes));
    } catch (err) {
        console.error("Couldn't save notes:", err);
    }
}

function getPreview(text) {
    var trimmed = (text || "").replace(/\s+/g, " ").trim();
    return trimmed.length > 60 ? trimmed.slice(0, 60) + "..." : trimmed;
}


var notes = loadNotes();
var currentNoteIndex = 0;
var sidebar = document.querySelector("#sidebar");
var notesHeaderText = document.querySelector("#notesHeaderText");
var notesTitleField = document.querySelector("#notesTitleField");
var notesBodyField = document.querySelector("#notesBodyField");
var notesAddBtn = document.querySelector("#notesAddBtn");
var notesDeleteBtn = document.querySelector("#notesDeleteBtn");

function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function renderSidebar() {
    sidebar.innerHTML = "";

    notes.forEach(function (note, index) {
        var entry = document.createElement("div");
        entry.className = "notes-entry" + (index === currentNoteIndex ? " active " : "");

        entry.innerHTML = `
            <p class="notes-entry-title">${escapeHtml(note.title || "Untitled")}</p>
            <p class="notes-entry-preview">${escapeHtml(getPreview(note.content))}</p>
        `;

        entry.addEventListener("click", function () {
            selectNote(index);
        });

        sidebar.appendChild(entry);
    });
}

function selectNote(index) {
    currentNoteIndex = index;
    var note = notes[index];

    notesTitleField.innerText = note.title || "";
    notesBodyField.innerText = note.content || "";
    notesHeaderText.textContent = note.title || "Untitled";

    renderSidebar();
}

notesTitleField.addEventListener("input", function () {
    notes[currentNoteIndex].title = notesTitleField.innerText;
    notesHeaderText.textContent = notes[currentNoteIndex].title || "Untitled";
    saveNotes();
    renderSidebar();
});

notesTitleField.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        notesBodyField.focus();
    }
});

notesBodyField.addEventListener("input", function() {
    notes[currentNoteIndex].content = notesBodyField.innerText;
    saveNotes();
    renderSidebar();
});

notesAddBtn.addEventListener("click", function () {
    notes.push({ title: "", content: "" });
    saveNotes();
    selectNote(notes.length - 1);
    notesTitleField.focus();
});

notesDeleteBtn.addEventListener("click", function () {
    if (notes.length <= 1) {
        notes[0] = { title: "", content: "" };
    } else {
        notes.splice(currentNoteIndex, 1);
        currentNoteIndex = Math.max(0, currentNoteIndex - 1);
    }

    saveNotes();
    selectNote(currentNoteIndex);
});

renderSidebar();
selectNote(0);

// notes window

var notesWindow = document.querySelector("#notes");

wireWindowControls(notesWindow, "notes", function () {
    deselectIcon(selectedIcon);
    setAppOpen(Array.from(notesIcons), false);
});

// desktop and dock icons

var selectedIcon = undefined;
var notesIcons = document.querySelectorAll('[data-app="notes"]');

function selectIcon(icons) {
    icons.forEach(function (icon) {
        icon.classList.add("selected");
    });
    selectedIcon = icons;
}

function deselectIcon(icons) {
    if (!icons) {
        return;
    }

    icons.forEach(function (icon) {
        icon.classList.remove("selected");
    });

    selectedIcon = undefined;
}

function setAppOpen(icons, isOpen) {
    icons.forEach(function (icon) {
        icon.classList.toggle("open", isOpen);
    });
}

function handleIconTap(icons) {
    var alreadySelected = icons[0].classList.contains("selected");

    if (selectedIcon) {
        deselectIcon(selectedIcon);
    }

    if (!alreadySelected) {
        selectIcon(icons);
    }
}

notesIcons.forEach(function (icon) {
    icon.addEventListener("click", function () {
        var icons = Array.from(notesIcons);
        handleIconTap(icons);
        openWindow(notesWindow);
        setAppOpen(icons, true);
    });
});

// browser

var ecosiaSearchUrl = "https://www.ecosia.org/search?q=";
var proxyBase = "https://frog-os-proxy.vercel.app/api/proxy?url=";
var blockedLoadDelay = 8000;

var browserFrame = document.querySelector("#browserFrame");
var browserHome = document.querySelector("#browserHome");
var browserBlocked = document.querySelector("#browserBlocked");
var browserAddressInput = document.querySelector("#browserAddressInput");
var browserAddressForm = document.querySelector("#browserAddressForm");
var browserHomeInput = document.querySelector("#browserHomeInput");
var browserHomeForm = document.querySelector("#browserHomeForm");
var browserBack = document.querySelector("#browserBack");
var browserForward = document.querySelector("#browserForward");
var browserReload = document.querySelector("#browserReload");
var browserOpenNewTab = document.querySelector("#browserOpenNewTab");
var browserBlockedOpen = document.querySelector("#browserBlockedOpen");

var browserHistory = [];
var browserHistoryIndex = -1;
var browserCurrentUrl = null;
var browserLoadTimeout = null;
var browserNavId = 0;

function looksLikeUrl(input) {
    if (/^https?:\/\//i.test(input)) {
        return true;
    }

    return /^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(input);
}

function resolveInputToUrl(input) {
    var trimmed = input.trim();

    if (!trimmed) {
        return null;
    }

    if (looksLikeUrl(trimmed)) {
        return /^https?:\/\//i.test(trimmed)
            ? trimmed
            : "https://" + trimmed;
    }

    return ecosiaSearchUrl + encodeURIComponent(trimmed);
}

function showHome() {
    browserHome.style.display = "flex";
    browserFrame.style.display = "none";
    browserBlocked.style.display = "none";
    browserAddressInput.value = "";
    browserCurrentUrl = null;
}

function showBlocked(url) {
    browserFrame.style.display = "none";
    browserHome.style.display = "none";
    browserBlocked.style.display = "flex";

    browserBlockedOpen.onclick = function () {
        window.open(url, "_blank");
    };
}

function navigateTo(url, addToHistory) {
    if (addToHistory === undefined) {
        addToHistory = true;
    }

    browserCurrentUrl = url;
    browserAddressInput.value = url;
    browserHome.style.display = "none";
    browserBlocked.style.display = "none";
    browserFrame.style.display = "block";

    clearTimeout(browserLoadTimeout);

    var thisNavId = ++browserNavId;
    var proxiedUrl = proxyBase + encodeURIComponent(url);

    // if loadframe hangs forever: 
    loadFrame(url, proxiedUrl, thisNavId);

    browserLoadTimeout = setTimeout(function () {
        if (thisNavId === browserNavId) {
            showBlocked(url);
        }
    }, blockedLoadDelay);

    if (addToHistory) {
        if (browserHistory.length === 0) {
            browserHistory.push(null);
            browserHistoryIndex = 0;
        }

        browserHistory = browserHistory.slice(0, browserHistoryIndex + 1);
        browserHistory.push(url);
        browserHistoryIndex = browserHistory.length - 1;
    }

    updateNavButtons();
}

function loadFrame(url, proxiedUrl, thisNavId) {
    if (thisNavId !== browserNavId) {
        return;
    }

    fetch(proxiedUrl, { method: "GET" })
        .then(function (response) {
            if (thisNavId !== browserNavId) {
                return;
            }

            var botCheck = response.headers.get("X-Frog-Proxy-Bot-Check");
            var fetchFailed = response.headers.get("X-Frog-Proxy-Fetch-Failed");

            if (botCheck || fetchFailed || !response.ok) {
                clearTimeout(browserLoadTimeout);
                showBlocked(url);
                return;
            }

            var freshFrame = document.createElement("iframe");
            freshFrame.className = "browser-frame";
            freshFrame.id = "browserFrame";

            browserFrame.replaceWith(freshFrame);
            browserFrame = freshFrame;

            freshFrame.onload = function () {
                if (thisNavId !== browserNavId) {
                    return;
                }

                clearTimeout(browserLoadTimeout);
                syncAddressBarFromFrame(freshFrame, true);
                watchFrameForInPageNavigation(freshFrame, thisNavId);
            };

            freshFrame.src = proxiedUrl;
        })
        .catch(function () {
            if (thisNavId === browserNavId) {
                clearTimeout(browserLoadTimeout);
                showBlocked(url);
            }
        });
}

function updateNavButtons() {
    browserBack.disabled = browserHistoryIndex <= 0;
    browserForward.disabled = browserHistoryIndex >= browserHistory.length - 1;
}

function syncAddressBarFromFrame(frame, isInitialLoad) {
    var frameUrl;

    try {
        frameUrl = frame.contentWindow.location.href;
    } catch (err) {
        return;
    }

    var proxied = extractProxiedUrl(frameUrl);

    if (!proxied || proxied === browserCurrentUrl) {
        return;
    }

    browserCurrentUrl = proxied;
    browserAddressInput.value = proxied;

    if (isInitialLoad) {
        if (browserHistoryIndex >= 0) {
            browserHistory[browserHistoryIndex] = proxied;
        }
    } else {
        browserHistory = browserHistory.slice(0, browserHistoryIndex + 1);
        browserHistory.push(proxied);
        browserHistoryIndex = browserHistory.length - 1;
    }

    updateNavButtons();
}

function watchFrameForInPageNavigation(frame, thisNavId) {
    var lastSeenHref = null;

    try {
        lastSeenHref = frame.contentWindow.location.href;
    } catch (err) {
        return;
    }

    var intervalId = setInterval(function () {
        if (thisNavId !== browserNavId || frame !== browserFrame) {
            clearInterval(intervalId);
            return;
        }

        var currentHref;
        try {
            currentHref = frame.contentWindow.location.href;
        } catch (err) {
            clearInterval(intervalId);
            return;
        }

        if (currentHref !== lastSeenHref) {
            lastSeenHref = currentHref;
            syncAddressBarFromFrame(frame, false);
        }
    }, 500);
}

function extractProxiedUrl(frameUrl) {
    var marker = "?url=";
    var index = frameUrl.indexOf(marker);

    if (index === -1) {
        return null;
    }

    var rest = frameUrl.slice(index + marker.length);
    var ampIndex = rest.indexOf("&");

    if (ampIndex !== -1) {
        rest = rest.slice(0, ampIndex);
    }

    try {
        return decodeURIComponent(rest);
    } catch (err) {
        return null;
    }
}

function submitFromInput(rawValue) {
    var url = resolveInputToUrl(rawValue);

    if (url) {
        navigateTo(url);
    }
}

browserAddressForm.addEventListener("submit", function (e) {
    e.preventDefault();
    submitFromInput(browserAddressInput.value);
});

browserHomeForm.addEventListener("submit", function(e) {
    e.preventDefault();
    submitFromInput(browserHomeInput.value);
    browserHomeInput.value = "";
});

document.querySelectorAll(".browser-shortcut").forEach(function (btn) {
    btn.addEventListener("click", function () {
        navigateTo(btn.dataset.url);
    });
});

browserBack.addEventListener("click", function () {
    if (browserHistoryIndex > 0) {
        browserHistoryIndex--;
        goToHistoryEntry(browserHistory[browserHistoryIndex]);
    }
});

browserForward.addEventListener("click", function () {
    if (browserHistoryIndex < browserHistory.length - 1) {
        browserHistoryIndex++;
        goToHistoryEntry(browserHistory[browserHistoryIndex]);
    }
});

function goToHistoryEntry(entry) {
    ++browserNavId;
    clearTimeout(browserLoadTimeout);

    if (entry === null) {
        showHome();
        updateNavButtons();
    } else {
        navigateTo(entry, false);
    }
}

browserReload.addEventListener("click", function() {
    if (browserCurrentUrl) {
        navigateTo(browserCurrentUrl, false);
    }
});

browserOpenNewTab.addEventListener("click", function () {
    var url = browserCurrentUrl || resolveInputToUrl(browserAddressInput.value);

    if (url) {
        window.open(url, "_blank");
    }
});

showHome();
updateNavButtons();

// browser window

var browserWindow = document.querySelector("#browser");

wireWindowControls(browserWindow, "browser", function () {
    deselectIcon(selectedIcon);
    setAppOpen(Array.from(browserIcons), false);
});

// browser app icons

var browserIcons = document.querySelectorAll('[data-app="browser"]');

browserIcons.forEach(function (icon) {
    icon.addEventListener("click", function () {
        var icons = Array.from(browserIcons);
        handleIconTap(icons);
        openWindow(browserWindow);
        setAppOpen(icons, true);
    });
});