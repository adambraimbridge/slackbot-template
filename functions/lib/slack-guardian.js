const querystring = require('querystring')

const slackGuardian = (request) => {
	// console.log({ ...request })
	const { httpMethod, body } = request

	// Guardian: Only allow POST requests
	if (httpMethod !== 'POST') {
		return {
			isValid: false,
			statusCode: 405,
			body: 'Method Not Allowed',
			headers: {
				'X-Slack-No-Retry': 1,
			},
		}
	}

	// Payload is different depending on what Slack sends
	const data = querystring.parse(body)
	const payload = data.payload ? JSON.parse(data.payload) : data

	console.debug({ ...payload })

	// Guardian: Slack verification token
	const { token } = payload
	const { SLACK_VERIFICATION_TOKEN } = process.env
	if (!token || token !== SLACK_VERIFICATION_TOKEN) {
		return {
			isValid: false,
			statusCode: 401,
			body: 'Unauthorized',
			headers: {
				'X-Slack-No-Retry': 1,
			},
		}
	}

	// Handle Slack challenges. See: https://api.slack.com/events/url_verification
	if (type === 'url_verification' && !!challenge) {
		return {
			isValid: true,
			statusCode: 200,
			body: challenge,
			headers: {},
		}
	}

	return {
		isValid: true,
		...payload,
	}
}

module.exports = { slackGuardian }
