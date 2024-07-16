import openai from "./config/open-ai.js";
import readlineSync from "readline-sync";
import colors from "colors";

async function main() {
  //testing the open ai gpt prompt request
  // const chatCompletion=await openai.chat.completions.create({
  //     model:'gpt-3.5-turbo',
  //     messages:[
  //         {role:'user',content:'What is the capital of India?'}
  //     ]
  // });
  //console.log(chatCompletion.choices[0].message.content);
  //testing the readline sync function
  //const userName=readlineSync.question('May I have your name?');
  //console.log(`Hello ${userName}`);
  console.log(colors.bold.magenta("Welcome to the chatbot program!"));
  console.log(colors.bold.magenta("You can start chatting with the bot!"));

  const chatHistory = []; //Store coversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow("You:"));

    try {
      // Construct messages by iterating over the history
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Add latest user input
      messages.push({ role: "user", content: userInput });
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
      //Get completion text
      const completionText = completion.data.choices[0].message.content;

      if (userInput.toLowerCase() === "exit") {
        console.log(colors.magenta("Bot:") + completionText);
        return;
      }
      console.log(colors.magenta("Bot:") + completionText);
      // Update history with user input and assistant response
      chatHistory.push(["user", userInput]);
      chatHistory.push(["assistant", completionText]);
    } catch (error) {
      if (error.response) {
        console.error(colors.red(error.response.data.error.code));
        console.error(colors.red(error.response.data.error.message));
        return;
      }
      console.error(colors.red(error));
      return;
    }
  }
}

main();
