// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
// email.service.ts

import { Injectable } from '@nestjs/common';
import { SettingsService } from '@rumsan/extensions/settings';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() { }

    initialize() {
        if (!this.transporter) {
            console.log('Initializing email service');
            this.transporter = nodemailer.createTransport({
                pool: true,
                host: SettingsService.get('SMTP.HOST'),
                port: SettingsService.get('SMTP.PORT'),
                secure: SettingsService.get('SMTP.SECURE'),
                auth: {
                    user: SettingsService.get('SMTP.USERNAME'),
                    pass: SettingsService.get('SMTP.PASSWORD'),
                },
            });
        }
    }

    async sendEmail(
        to: string,
        subject: string,
        text: string,
        html?: string
    ): Promise<void> {
        this.initialize();
        const mailOptions = {
            from: SettingsService.get('SMTP.USERNAME'), // Replace with your email
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error; // Or handle it as per your application needs
        }
    }
}
