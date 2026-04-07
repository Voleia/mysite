const PopupMap = new Map();

PopupMap.set("test", "test text!")
PopupMap.set(":D","<h1 style='font-family:lexend'>:D</h1>")

function getPopup(title) {
    if (PopupMap.has(title)) {
        openPopup(title, PopupMap.get(title))
    } else {
        openPopup(title, "This popup doesn't exist!")
    }
}

function closepopup() {
    $("#infoPopup").removeClass("show");
}

function openPopup(title, text) {
    document.getElementById("popupTitle").innerHTML = title;
    document.getElementById("popupContent").innerHTML = text;
    $("#infoPopup").addClass("show");
}