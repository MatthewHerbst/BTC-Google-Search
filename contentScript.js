$(document).ready(function() {
    chrome.runtime.onMessage.addListener(function(msg) {
        console.log("Received a message!");
        if(msg && msg.hasOwnProperty('html') && msg.html) {
            console.log("The message is in the html property! Appending...");
            $('#rso').prepend(domElement);
        }
    });
});