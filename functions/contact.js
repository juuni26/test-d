require('dotenv').config()


exports.handler = async (event, context) => {
  const formData = require('form-data');
  const Mailgun = require('mailgun.js');
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

  var data = JSON.parse(event.body)

  const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: "Jun Dara <bakamono2606@gmail.com>",
    to: `${data.email}`,
    subject: data.subject,
    text: data.body
    // html: "<h1>Testing some Mailgun awesomeness!</h1>"
  })

  if (response.status != 200) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ boop: false, body: response })
    }
  }

  return {
    statusCode: response.status,
    body: JSON.stringify({ boop: true, body: response })
  }


}
