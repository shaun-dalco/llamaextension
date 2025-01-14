
// Reference to the input field
const textInput = document.getElementById("textInput");

// Listen for the 'keydown' event
textInput.addEventListener("keydown", async (event) => {
  // Check if the Enter key was pressed
  if (event.key === "Enter") {
    const inputValue = textInput.value.trim();

    if (inputValue) {
      console.log("Sending data:", inputValue);

      // Example: Sending data to an API
      queryOllama(inputValue);

      // Clear the input field after sending
      textInput.value = "";
    }
  }
});

async function queryOllama(prompt) {
    // Create an XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3001/query-ollama", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Handle the response
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Parse and display the response
        const data = JSON.parse(xhr.responseText);
        document.getElementById("response").textContent = JSON.stringify(data.message, null, 2);
      } else {
        // Handle errors
        document.getElementById("response").textContent = `Error: ${xhr.statusText}`;
      }
    };

    // Handle network errors
    xhr.onerror = () => {
      document.getElementById("response").textContent = "Network Error";
    };

    // Send the request with the prompt as JSON
    xhr.send(JSON.stringify({ prompt }));
  
}

function extractVisibleTextFromHTML(htmlContent) {
  // Create a new DOM parser
  const parser = new DOMParser();
  
  // Parse the HTML content into a document
  const doc = parser.parseFromString(htmlContent, "text/html");
  
  // Function to extract visible text from nodes
  function extractText(node) {
      if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim();
      } else if (node.nodeType === Node.ELEMENT_NODE) {
          const style = window.getComputedStyle(node);
          if (style.display === "none" || style.visibility === "hidden") {
              return ""; // Ignore hidden elements
          }
          return Array.from(node.childNodes).map(extractText).join(" ");
      }
      return "";
  }
  
  // Extract text from the <body> element
  return extractText(doc.body).replace(/\s+/g, " ").trim();
}

document.getElementById("fetchButton").addEventListener("click", async () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs.executeScript(tabs[0].id, { code: "document.documentElement.outerHTML;" })
          .then((results) => {
            //document.getElementById("html-code").textContent = extractVisibleTextFromHTML(results[0]);
            queryOllama("Here is all the visible text of a website, please summarize it: "+extractVisibleTextFromHTML(results[0]));
          })
          .catch((error) => console.error("Error fetching HTML:", error));
  });
});