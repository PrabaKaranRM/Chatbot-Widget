const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const carouselContainer = document.getElementById('carousel-container');
const optionsContainer = document.getElementById('options-container');

// Sample responses
const responses = {
    'hi': 'Hello there!',
    'how are you?': 'I am just a bot, but thank you for asking!',
    'sample image': '<img src="image4.jpg" alt="Sample Image">',
    'sample link': '<a href="https://prabarmportfolio.netlify.app/">Sample Link</a>'
};

// Sample carousel content
const carouselContent = `
    <div><img src="image1.jpg" alt="Image 1"></div>
    <div><img src="image2.jpg" alt="Image 2"></div>
    <div><img src="image3.jpg" alt="Image 3"></div>
    <div><img src="image4.jpg" alt="Image 4"></div>
`;

// Sample options
const options = ['Option 1', 'Option 2', 'Option 3'];


// Function to print response
function printResponse(message, isUser) {
    const chatBubble = document.createElement('div');
    chatBubble.classList.add('chat-bubble');

    // Create a child element to hold the message content
    const messageContent = document.createElement('div');

    // Check if the message contains an image
    const imageRegex = /<img\b[^>]*>/;
    if (imageRegex.test(message)) {
        const imgElement = document.createElement('div');
        imgElement.innerHTML = message;
        messageContent.appendChild(imgElement);
    }
    // Check if the message contains a clickable link
    else if (message.includes('<a href=')) {
        const linkElement = document.createElement('div');
        linkElement.innerHTML = message;
        messageContent.appendChild(linkElement);
    }
    // Regular text message
    else {
        messageContent.textContent = message;
    }

    // Append the message content to the chat bubble
    chatBubble.appendChild(messageContent);

    // Check if the user is the sender
    if (isUser) {
        chatBubble.classList.add('user-bubble');

        // Append the edit icon if the user is the sender
        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-edit'); // Add Font Awesome icon classes
        editIcon.onclick = function() {
            editUserMessage(chatBubble);
        };
        chatBubble.appendChild(editIcon);
    }

    // Append the chat bubble to the chat box
    chatBox.appendChild(chatBubble);
}



// Function to handle user input
function handleInput() {
    const message = userInput.value.trim();
    if (message !== '') {
        printResponse(message, true);
        sendUserMessage(message);
        userInput.value = '';

        // Scroll to the latest response
        scrollToLatestResponse();
    }
}

function scrollToLatestResponse() {
    // Scroll chat box to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}


// Function to send user message to server
function sendUserMessage(message) {
    // Send the message to the server using an API call
    // Replace this with your actual API call to send the message and retrieve the response
    const response = getBotResponse(message); // Assuming synchronous call for simplicity
    printResponse(response, false); // Print the bot's response

    scrollToLatestResponse();
}

function editUserMessage(chatBubble) {
    const message = chatBubble.textContent.trim();
    const originalMessage = message; // Store the original message

    // Check if the edit container already exists
    const editContainer = chatBubble.querySelector('.edit-container');
    if (editContainer) {
        // If edit container exists, remove it
        chatBubble.removeChild(editContainer);
    } else {
        // If edit container doesn't exist, create and append it
        const editIcon = chatBubble.querySelector('.fa-edit');
        if (editIcon) {
            // Remove the edit icon
            chatBubble.removeChild(editIcon);
        }
        
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = message;
        editInput.style.borderRadius= "10px"
        editInput.style.border= "1px solid #ccc"
        editInput.style.padding="5px"


        const submitBtn = document.createElement('button');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>'; // Set submit button icon
        submitBtn.style.marginLeft = '10px'; // Add left margin
submitBtn.style.marginRight = '10px'; // Add right margin
submitBtn.style.backgroundColor = '#007bff'; // Set background color
submitBtn.style.color = 'white'; // Set icon color
submitBtn.style.border = 'none';
        submitBtn.onclick = function() {
            let editedMessage = editInput.value.trim();
            chatBubble.textContent = editedMessage;
            if (originalMessage !== editedMessage) {
                sendUserMessage(editedMessage);
            }
            // Append the edit icon back to the chat bubble
            chatBubble.appendChild(editIcon);
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.border = 'none';
        cancelBtn.style.backgroundColor = 'red'
        cancelBtn.style.color = 'white'
        cancelBtn.style.borderRadius = '20px';
        cancelBtn.style.cursor='pointer';
        cancelBtn.style.paddingLeft= '10px';
        cancelBtn.style.paddingRight= '10px'
        cancelBtn.onclick = function() {
            chatBubble.textContent = originalMessage; // Restore the original message
            // Append the edit icon back to the chat bubble
            chatBubble.appendChild(editIcon);
        };

        // Create the edit container and append input, submit button, and cancel button
        const newEditContainer = document.createElement('div');
        newEditContainer.classList.add('edit-container');
        newEditContainer.appendChild(editInput);
        newEditContainer.appendChild(submitBtn);
        newEditContainer.appendChild(cancelBtn);

        // Append the edit container to the chat bubble
        chatBubble.appendChild(newEditContainer);
    }
}





// Event listener for send button click
sendBtn.addEventListener('click', handleInput);

// Event listener for pressing Enter key
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleInput();
    }
});

// Function to get bot response
function getBotResponse(message) {
    const response = responses[message.toLowerCase()] || 'Sorry, I didn\'t understand that.';
    return response;
}

// Function to display carousel
function displayCarousel(content) {
    carouselContainer.innerHTML = content;
    $('.carousel-container').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        prevArrow: '<button type="button" class="slick-prev">&#8592;</button>',
        nextArrow: '<button type="button" class="slick-next">&#8594;</button>'
    });
}

// Function to create option buttons
function createOptionButtons() {
    options.forEach(option => {
        const optionBtn = document.createElement('button');
        optionBtn.textContent = option;
        optionBtn.classList.add('option-btn');
        optionBtn.addEventListener('click', () => {
            printResponse(`You selected: ${option}`);
        });
        optionsContainer.appendChild(optionBtn);
    });
}




// Initialize chatbot widget
createOptionButtons();
printResponse("Welcome to the chatbot! How can I assist you?");
displayCarousel(carouselContent);
