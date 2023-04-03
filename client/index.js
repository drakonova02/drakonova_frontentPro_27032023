let nameCustomer;

document.querySelector('[value="connect"]').onclick = (e) => {
    const buttonConnect    = e.target;
    const buttonSend       = document.querySelector('[value="send"]');
    const inputText        = document.querySelector('#text');

    nameCustomer    = inputText.value.trim();
    inputText.value = '';

    if(nameCustomer) {
        document.querySelector('.info-connect').remove();

        document.querySelector('label').innerText = `Message from ${nameCustomer}`;
        buttonConnect.style.display               = 'none';
        buttonSend.style.display                  = 'inline';

        const ws = new WebSocket('ws://localhost:5556');

        ws.onmessage = message => {
            const messageItem = document.createElement('li');
            const time = new Date().toLocaleTimeString();
            messageItem.innerText = `[${time}] ${message.data}`;
            document.querySelector('.message-list').append(messageItem);
        }
        
        ws.onopen = () => {
            console.log('Connected to ws');
            buttonSend.onclick = (e) => {
                const message = inputText.value.trim();
    
                if(message) {
                    ws.send(nameCustomer + ': ' + message);
                    inputText.value = '';
                }
            }
        }
    }
}
