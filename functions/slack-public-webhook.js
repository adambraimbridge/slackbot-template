const { slackGuardian } = require('./lib/slack-guardian')
const { appController } = require('./lib/app-controller')

exports.handler = (request) => {
	const checkedByGuardian = slackGuardian(request)
	if (!checkedByGuardian.isValid || !!checkedByGuardian.body) {
		const { statusCode, body, headers } = checkedByGuardian
		return {
			statusCode,
			body,
			headers,
		}
	}

	/**
	 * Hand over to the app controller
	 *
	 * Do not await a response, because otherwise it will time out,
	 * and Slack would keep resending the event.
	 */
	appController({ payload: checkedByGuardian })

	// Always respond with OK
	return {
		statusCode: 200,
		body: 'ok',
	}
}
