import {
  injectable
} from "inversify";

import nodemailer, {
  Transporter
} from "nodemailer";

import config from "../config/config";

@injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter =
      nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        secure: config.mail.port === 465,

        auth: {
          user: config.mail.user,
          pass: config.mail.password
        }
      });
  }

  async sendPasswordResetOtp(
    email: string,
    otp: string
  ): Promise<void> {
    await this.transporter.sendMail({
      from: config.mail.from,
      to: email,
      subject: "Password Reset OTP",

      text: `
Your password reset OTP is: ${otp}

This OTP will expire in 5 minutes.

If you did not request a password reset,
please ignore this email.
      `.trim(),

      html: `
        <div>
          <h2>Password Reset</h2>

          <p>
            Your password reset OTP is:
          </p>

          <h1>${otp}</h1>

          <p>
            This OTP will expire in
            <strong>5 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset,
            please ignore this email.
          </p>
        </div>
      `
    });
  }
}