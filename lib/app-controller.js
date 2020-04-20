const axios = require('axios')

/**
 * Because this is a template, this controller actually just parrots back
 * whatever text was submitted. Replace this with your controller code.
 *
 * @param { payload } — A payload of Slack event data
 */
const appController = async ({ payload }) => {
	// Ignore empty messages
	const { text } = payload
	if (!text || !text.trim().length > 0) {
		return { statusCode: 204, body: 'No Content' }
	}

	try {
		await axios.post(
			response_url,
			{
				response_type: 'in_channel',
				text,
			},
			{
				headers: { 'content-type': 'application/json' },
			}
		)
		return {
			statusCode: 200,
		}
	} catch (error) {
		console.error(error)
		return {
			statusCode: 422, // Unprocessable Entity
			body: error.message,
		}
	}
}

module.exports = { appController }
