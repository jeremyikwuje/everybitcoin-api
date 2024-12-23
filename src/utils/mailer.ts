import MailgunIntegration from '../integrations/mailing/mailgun.integration';

export const send_email_without_template = async (
  to: string,
  subject: string,
  body: string,
) => {
  await MailgunIntegration.sendWithoutTemplate(to, subject, body);
};
