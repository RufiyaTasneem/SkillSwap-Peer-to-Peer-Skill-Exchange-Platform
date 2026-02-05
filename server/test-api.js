const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/skill-test?skill=Python%20Programming',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const questions = JSON.parse(data);
            console.log('SUCCESS: Received', questions.length, 'questions');
            console.log('First question:', questions[0].question);
            console.log('Correct answer:', questions[0].correctAnswer);
        } catch (e) {
            console.log('Response:', data);
        }
    });
});

req.on('error', (e) => {
    console.error('ERROR:', e.message);
});

req.end();