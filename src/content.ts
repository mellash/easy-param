//Listen for message request to send url parameters
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //Check for the right message type
  if (message.type === "Get url") {
    //fullUrl to send to the popup.js
    const fullUrl = document.location.search;
    //Check before sending
    if (fullUrl) {
      sendResponse({ success: true, text: fullUrl });
    } else {
      sendResponse({ success: false, error: "No url?" });
    }
  }
});

//Listen for message request to receive user url parameters
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "Form data") {
    //Construct a new query string from the received data
    const params = new URLSearchParams();
    Object.entries(message.data).forEach(([name, value]) => {
      //Add each name=value pair
      params.append(name, value as string);
    });

    //Replace the location.search with the new query string
    window.location.search = `?${params.toString()}`;

    sendResponse({ success: true });
  }
});
