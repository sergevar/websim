const Anthropic = require("@anthropic-ai/sdk");

// load dotenv
require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const claudeApi = async (options, system_prompt, user_prompt) => {
    const msg = await anthropic.messages.create({
        model: options.model || "claude-3-opus-20240229",
        max_tokens: options.max_tokens || 2000,
        temperature: options.temperature || 0,
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