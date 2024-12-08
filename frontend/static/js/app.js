const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Function to add a message to the chat UI
function addMessage(text, sender = 'bot') {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    const p = document.createElement('p');
    p.textContent = text;
    msgDiv.appendChild(p);
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    userInput.value = '';
    sendBtn.disabled = true;

    // Add a placeholder message for the bot
    const botMessageDiv = document.createElement('div');
    botMessageDiv.classList.add('message', 'bot');
    const botText = document.createElement('p');
    botText.textContent = '...'; // initial placeholder
    botMessageDiv.appendChild(botText);
    messagesDiv.appendChild(botMessageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
        // Pointing to the local Flask server running on port 5001
        const response = await fetch('http://localhost:5001/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Note the payload key: local_server.py expects "text" not "message"
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            const errorText = await response.text();
            botText.textContent = 'Error: ' + errorText;
            return;
        }

        const data = await response.json();
        if (data.error) {
            botText.textContent = 'Error: ' + data.error;
        } else {
            // The Flask server returns { "response": "...model output..." }
            botText.textContent = data.response;
        }
    } catch (err) {
        botText.textContent = 'Error: ' + err.toString();
    } finally {
        sendBtn.disabled = false;
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') sendMessage();
});
