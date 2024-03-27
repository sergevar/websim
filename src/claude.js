const Anthropic = require("@anthropic-ai/sdk");

// load dotenv
require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const claudeApi = async (system_prompt, user_prompt) => {
    const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        // model: "claude-3-sonnet-20240229",
        // model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        temperature: 1,
        system: system_prompt,
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": user_prompt
              }
            ]
          }
        ]
    });

    return msg.content[0].text;
}

module.exports = {
    claudeApi
}