'use strict';
const https = require('https');

module.exports.hello = (event, context, callback) => {
    let request = {
        host: 'api.github.com',
        headers: {'user-agent': 'AlexaSkill/1.0'},
        path: '/search/repositories?sort=stars&order=desc&q=created:>2017-08-18'
    };

    https.get(request, res => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => {
            body += data;
        });
        res.on('end', () => {
            body = JSON.parse(body);

            let size = 3;
            let top = body.items.splice(0, size);

            callback(null, {
                version: '1.0',
                response: {
                    outputSpeech: {
                        type: 'PlainText',
                        text: `There are ${body.total_count} trending repositories. I have the top ${size}, they are: ${top.map((item) => {
                            let name = item.full_name.split('/');
                            return `${name[1]} by ${name[0]}. `
                        })}`,
                    },
                    shouldEndSession: true,
                },
            });
        });
    });
};
