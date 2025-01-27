//Unordered list element to hold parameter name and value
let unorderedList = document.querySelector("ul") as HTMLUListElement;
//Lists of parameter names
let parameterNames: string[] = [];
//Lists of parameter values
let parameterValues: string[] = [];
//Button element for submitting the form
let buttonElement = document.querySelector("button") as HTMLButtonElement;
//Form element
let formElement = document.querySelector("form") as HTMLFormElement;


//After loading a page query for the host url using chrome API
document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTabId = tabs[0].id;
    //If there is a tab
    if (activeTabId) {
      //Send a message to the content.js
      chrome.tabs.sendMessage(activeTabId, { type: "Get url" }, (response) => {
        //If response if success
        if (response.success) {
          //Remove the ?
          response.text = response.text.slice(1);
          //Separate the response with &
          let nameAndValues: string[] = response.text.split("&");

          //Loop nameAndValues array and assign name and value to parameterNames and parameterValues list
          for (let i = 0; i < nameAndValues.length; i++) {
            parameterNames.push(nameAndValues[i].split("=")[0]);
            parameterValues.push(nameAndValues[i].split("=")[1]);
          }

          // Loop either parameterNames or parameterValues list and
          // append each to the corresponding parameterName and parameterValue variable.
          for (let i = 0; i < parameterNames.length; i++) {
            //List item for each parameter name and value
            let listItem = document.createElement("li");
            //Input element for the parameter name
            let parameterName = document.createElement("span");
            parameterName.classList.add("easy-param-span");
            //Input element for the parameter value
            let parameterValue = document.createElement("input");
            //Add class
            parameterValue.classList.add("easy-param-input")
            parameterName.textContent = parameterNames[i];
            listItem.appendChild(parameterName);
            parameterValue.value = parameterValues[i];
            parameterValue.name = parameterNames[i];
            listItem.appendChild(parameterValue);
            //Add listItem to unorderedList
            unorderedList.appendChild(listItem);
          }
        } else {
          console.log("Error");
        }
      });
    }
  });
});


//Listen for click event
buttonElement.addEventListener("click", (e) => {
  e.preventDefault();
  //Getting all name and value
  let formData = new FormData(formElement);
  //Convert FormData to a plain object to send it to content.js
  let plainData: Record<string, string> = {};
  formData.forEach((value, key) => {
    plainData[key] = value.toString();
  });

  //Sending to content.js
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTabId = tabs[0].id;
    if (activeTabId) {
      chrome.tabs.sendMessage(
        activeTabId,
        { type: "Form data", data: plainData },
        (response) => {
          if (response) {
            console.log("Data received");
          } else {
            console.log("Failed to send");
          }
        }
      );
    }
  });
});
