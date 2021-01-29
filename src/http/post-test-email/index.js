const mailgun = require('mailgun-js');

const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey, domain });
const generateResponse = (body, statusCode) => ({
  headers: {
    'content-type': 'application/json',
  },
  statusCode,
  body: `{"result": ${JSON.stringify(body)}}`,
});
const sendEmail = async data => {
  const { from, to, subject, text } = data;
  const email = { from, to, subject, text };
  return mg.messages().send(email);
};
exports.handler = async function http(req) {
  try {
    const data = JSON.parse(req.body);
    console.log(data);
    const result = await sendEmail(data);
    console.log('result', result);
    const response = generateResponse(result, 200);
    return response;
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};
