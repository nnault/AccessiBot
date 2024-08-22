import { sendQuestion } from "@/actions/question";

const AskQuestion = () => {
  return (
    <div>
      <h1>Ask a question</h1>
      <form action={sendQuestion}>
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" name="displayName" />
        <label htmlFor="question">Question</label>
        <input type="text" id="question" name="questionText" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
export default AskQuestion;
