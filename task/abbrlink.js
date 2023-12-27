import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdef", 7);
const id = nanoid();
console.log(id);