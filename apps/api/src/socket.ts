const VERSION = "10000001";

interface Message {
  method: number,
  options: string
}

function decodeData(data: Uint8Array): string {
  let message = "";

  const lead_message = data.slice(0, -2);

  for (const segment of lead_message) {
    message += segment.toString(2).padStart(8, "0");
  }

  const final_segment = data.at(-2)?.toString(2).padStart(8, "0");
  const fill = data.at(-1) ?? 0;

  const final_data = final_segment?.slice(0, 8 - fill);

  message += final_data;

  return message;
}

function decodeOptions(options: string): string {
  let decoded_options = "";

  let index = 0;

  while (index < options.length) {
    const length = parseInt(options.slice(index, index + 5), 2);

    const data = options.slice(index + 5, index + length + 5);
    const code = parseInt(data, 2);
    const character = String.fromCodePoint(code);

    decoded_options += character;

    index += 5 + length;
  }

  return decoded_options;
}

function parseMessage(message: Uint8Array): Message {
  const data = decodeData(message);

  const method = data.slice(0, 8);
  const options = data.slice(8);

  return {
    method: parseInt(method, 2),
    options: decodeOptions(options)
  };
}

export default parseMessage;
