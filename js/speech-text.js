//speech to text command; 'stt' stands for speech to text

function speak(string) {
  const stt = new SpeechSynthesisUtterance();
  allVoices = speechSynthesis.getVoices();
  stt.voice = allVoices.filter(voice => voice.name === "Alex")[0];
  stt.text = string;
  stt.lang = "en-US";
  stt.volume = 1; //0-1 interval
  stt.rate = 1;
  stt.pitch = 1; //0-2 interval
  speechSynthesis.speak(stt);
}