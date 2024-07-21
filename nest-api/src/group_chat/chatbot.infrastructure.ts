import * as STOP_WORDS from './stop_words.json';
import * as CHATBOT_RESPONSE from './chatbot_response.json';

const exceptionWords = [
  'hello',
  'hi',
  'thank',
  'thanks',
  'my',
  'about',
  'name',
];

export function splitTokens(input) {
  // Text to lowercase
  let result = input.toLowerCase()
  // Removing punctuations
  result = result.replace(/[\.,?!]/g, "")
  // Splitting
  result = result.split(" ")
  // Removing Stop Words
  result = result.filter(value=>{
    return !STOP_WORDS.includes(value) || exceptionWords.includes(value);
  })
  return result
}

export function predict(node_array, token_array) {
  if (token_array.length) {
    for (let i = 0; i < node_array.length; i++) {
      for (let j = 0; j < token_array.length; j++) {
        if (node_array[i].compare(token_array[j])) {
          if (node_array[i].children) {
            const temp = predict(
              node_array[i].children,
              token_array.filter((tok) => tok !== token_array[j]),
            );
            return temp ? temp : node_array[i].label
          }
          return node_array[i].label
        }
      }
    }
  }
  return null
}

export function chatbotResponse(label: string | null): string {
  let arr;
  if (label) arr = CHATBOT_RESPONSE[label];
  else arr = CHATBOT_RESPONSE['404'];
  return arr[Math.floor(Math.random() * arr.length)]
}