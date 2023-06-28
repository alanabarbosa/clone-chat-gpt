const question = document.querySelector('#question');
const result = document.querySelector('#result');
const home = document.querySelector('.home');
const resultsChat = document.querySelector('.results');
const sendQuestion = document.querySelector('#SendQuestion');
const loadingBox = document.querySelector('.loading-chat');
const loading = document.querySelector('.loading-chat p');
const examples = document.querySelectorAll('.box-home p');

const OPENAI_API_KEY = '';
const API_URL = 'https://api.openai.com/v1/chat/completions';

question.focus();

const headers =  {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPENAI_API_KEY}`,
}

question.addEventListener('keypress', (event) => {
  if (question.value && event.key === 'Enter') {
    SendQuestion();
  }
});

examples.forEach(item => { 
  item.addEventListener('click', (event) => {
    question.value = event.target.innerText.replace(/^"|"$/g, ''); 
  });
});


sendQuestion.addEventListener('click', () => {
  if (question.value) SendQuestion();
})

const SendQuestion = async () => {  
  home.style.display = 'none';
  const valueQuestion = question.value;

  fetchCHAT(valueQuestion);

  resultsChat.innerHTML += `<div class="question-chat">
                              <img src="images/user.png" alt="" width="30">
                              <p>${valueQuestion}</p>
                            </div>`;

  loadingBox.style.display = 'block';

  if (loadingBox) loading.innerHTML += '...';

  question.value = '';
  question.disabled = true;

  window.scrollTo(0, document.body.scrollHeight);
}

const fetchCHAT = async (valueQuestion) => {
  let response = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: valueQuestion,
        },
      ],
    }),
  })
  .catch((error) => {
    loadingBox.style.display = 'none';
    resultsChat.innerHTML += `<div class="error-chat">
                                <img src="images/chatgpt.png" alt="" width="30">
                                <p>${error}</p>
                              </div>`;
  })
  .finally(() => {
    question.value = "";
    question.disabled = false;
    question.focus();
  });

  const data = await response.json();

  getContent(data);
}

const getContent = (data) => {
  if (data.error?.message) {
    loadingBox.style.display = 'none'
      resultsChat.innerHTML += `<div class="error-chat">
                                <img src="images/chatgpt.png" alt="" width="30">
                                <p>${data.error.message}</p>
                              </div>`;
    } 
    else if (data.choices?.[0].message.content) {
      const text = data.choices[0].message.content;

    if (loadingBox) loadingBox.style.display = 'none';

    resultsChat.innerHTML += `<div class="result-chat">
                                <img src="images/chatgpt.png" alt="" width="30">
                                <p>${text}</p>
                              </div>`;
  }

    window.scrollTo(0, document.body.scrollHeight);
}