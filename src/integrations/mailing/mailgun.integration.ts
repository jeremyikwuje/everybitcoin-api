import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import logger from '../../logger/logger';
import Config from '../../config/config';
import { rate_header } from './templates/rate.header';
import { rate_footer } from './templates/rate.footer';

export default class MailgunIntegration {
  public to: string;

  public subject: string;

  public body: string;

  private from: string;

  private key: string;

  private domain: string;

  constructor(to: string = '', subject: string = '', body: string = '') {
    this.from = 'Monierate <alerts@mg.monierate.com>';
    this.to = to;
    this.subject = subject;
    this.body = body;

    this.key = Config.mailgun.api_key;
    this.domain = Config.mailgun.domain;

    logger.info(this.key);
  }

  setHeader = () => {
    try {
      const content = rate_header;
      this.body += content.toString();
    } catch (err) {
      logger.error(err);
    }
  };

  setFooter = () => {
    try {
      const content = rate_footer;
      this.body += content.toString();
    } catch (err) {
      logger.error(err);
    }
  };

  appendBody = (body: string) => {
    this.body += body;
  };

  send = () => {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({ username: 'api', key: this.key, url: 'https://api.eu.mailgun.net' });

    const data = {
      from: this.from,
      to: this.to,
      subject: this.subject,
      html: this.body,
    };

    mg.messages.create(this.domain, data)
      .then((msg: any) => logger.error(msg))
      .catch((err: any) => logger.error(err));
  };

  /** Send mail statically */
  static staticSend = (to: string, subject: string, body: string) => {
    const mail = new MailgunIntegration(to, subject);
    mail.setHeader();
    mail.appendBody(body);
    mail.setFooter();
    mail.send();
  };

  static sendWithoutTemplate = (to: string, subject: string, body: string) => {
    const mail = new MailgunIntegration(to, subject);
    mail.appendBody(body);
    mail.send();
  };

  static addMember = async (list: string, member: any): Promise<boolean> => {
    const mailgun = new Mailgun(FormData);
    const client = mailgun.client({
      username: 'api',
      key: Config.mailgun.api_key,
      url: 'https://api.eu.mailgun.net',
    });
    const domain = list;

    try {
      const newMember = await client.lists.members.createMember(domain, {
        address: member.email,
        name: member.firstname,
        vars: JSON.stringify({ id: member.id }),
        subscribed: 'yes',
        upsert: 'yes',
      });
      logger.info('New member added to mailing list', newMember);
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  };

  static deleteMember = async (
    list: string,
    email: string,
  ): Promise<boolean> => {
    const mailgun = new Mailgun(FormData);
    const client = mailgun.client({
      username: 'api',
      key: Config.mailgun.api_key,
      url: 'https://api.eu.mailgun.net',
    });
    const domain = list;

    try {
      const deletedMember = await client.lists.members.destroyMember(domain, email);
      logger.info('Member deleted from mailing list', deletedMember);
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  };

  static confirmEmailLink = (to: string, link: string) => {
    const mail = new MailgunIntegration(to);
    mail.subject = 'Confirm your email address';
    mail.body = `
          <p>Click the link below confirm your email address</p>
          <p></p>
          <p>
              <a href="${link}">${link}</a>
          </p>
          <p></p>
      `;
    mail.send();
  };
}
