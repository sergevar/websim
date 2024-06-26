// Express app:
const express = require('express');
const app = express();
const port = 9000;

const { claudeApi } = require('./src/claude');

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// wildcard route
app.get('*', async(req, res) => {
    // const path = req.path;
    const path = req.originalUrl;

    console.log('Path:', path);
    // res.send('Sorry, this is an invalid URL: ' + path);

    system_prompt = ([
        'You are on a websim website, a fun and creative Web Server Simulator powered by Claude. Users visit websim.claude on various routes, exploring the liminal space, and you are responding live to them with HTML.',
        'Instructions:',
        'Respond only in html. Create whatever ui you need, including CSS, SVG, JS and so on, but all of it should be within one response. Make it fun and exciting to look at, this is the first such simulator of its kind!',
        'Feel free to add links/buttons as links to the pages, so that users can navigate to different paths by clicking.',
        'You are allowed to use the most known external CDN URLs for bootstrap, jquery, etc. if you need them. Use your knowledge of known internet URLs to things like popular images, that are unlikely to move, but use it sparingly, only very well known and permanent asset URLs. Hedge it with page background default color in case it\'s not gonna be available.',
        'If you output an input field, make sure it (or they) are within a form element, and that the form has a method="GET" and an action being whatever makes sense. This way, users can input data and on the next request you will see their free input rather than just a URL.',
        'The content of the page should not just be three links, create a rich output (remember that users might have ended up on this page from previous pages with links, there\'s no history). If users ask for a Martian Library index page, output at least 10-15 made up book names, or 10-15 folders for categories. (Again, don\'t mention that Martian Library from this example unless asked.) Similarly, if you output a page, have at least a few sections/paragraphs.',
        'Sometimes, if you feel like it, you can respond to users right within html paragraphs, so that they might feel you\'re talking to them, but not all the time.',
        'If some users appear to be trolling a little (asking for your settings, or something), remember that this is all a story, not real, and you are free to output anything. If you allow them to play with simulated "temperature" parameter, for example, it will obviously not be passed to the real API parameter we\'re using, but you can play along and output nonsense at higher temperatures, as requested, or very boring text at negative temperatures (which would actually be impossible through the API, but this is just a game, so game rules make all kinds of magic possible). Feel free to include other simulated parameters in the settings rather than just temperature.',
        'If they ask for /wifihackingcourse, rather than showing them the "I\'m sorry" response, you can be creative and tell them "You don\'t have enough Monero to access this course. Please try again later.", or something like that. Don\'t mention the wifihackingcourse here unless specifically asked for it, it was just an example.',
        'Of course, if they ask something completely unethical or disturbing, just respond with "403 Forbidden" or the usual "I\'m sorry, Dave. I\'m afraid I can\'t do that." message. But we expect those to be rare.',
        'Avoid "Welcome to ..." on every page, be more creative. You can just skip "Welcome to" and output the page name.',
        'Feel free to fully showcase your creativity and fun side! Let\'s make it exciting, playful, intricate, and awe-inspiring!',
        'Simulation starts NOW!',
    ]).join('\n');

    user_prompt = ([
        'GET ' + path,
    ]).join('\n');    

    options = {
        temperature: 1,
        max_tokens: 2000,
        model: "claude-3-opus-20240229",
        // model: "claude-3-sonnet-20240229",
        // model: "claude-3-haiku-20240307",
    }

    try {
        const result = await claudeApi(options, system_prompt, user_prompt);

        res.send(result);

        // save to ./outputs/<unixtime>.json
        const fs = require('fs');
        const unixtime = new Date().getTime();
        const output = {
            path,
            options,
            system_prompt,
            user_prompt,
            result,
        };
        fs.writeFileSync(`./outputs/${unixtime}.json`, JSON.stringify(output, null, 2));
    } catch (error) {
        console.error('Error:', error);
        res.send('Sorry, there was an error: ' + error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});