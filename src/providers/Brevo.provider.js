import { env } from '~/config/environment'
const brevo = require('@getbrevo/brevo')

let apiInstance = new brevo.TransactionalEmailsApi()
const apiKey = apiInstance.authentications['apiKey']

if (!apiKey) {
  throw new Error('API Key not found in the authentication object.')
}
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  try {
    let sendSmtpEmail = new brevo.SendSmtpEmail()
    sendSmtpEmail.sender = { name: env.ADMIN_EMAIL_NAME, email: env.ADMIN_EMAIL_ADDRESS }
    sendSmtpEmail.to = [{ email: recipientEmail }]
    sendSmtpEmail.subject = customSubject
    sendSmtpEmail.htmlContent = customHtmlContent

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    return response
  } catch (error) {
    throw error
  }
}

export const BrevoProvider = { sendEmail }
