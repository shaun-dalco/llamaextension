
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