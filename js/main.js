const chatBot = document.querySelector("#chatBot");
document.querySelector(".chatbot-toggler").addEventListener('click', toggler)
function toggler() {
    chatBot.classList.toggle('hidden')
}