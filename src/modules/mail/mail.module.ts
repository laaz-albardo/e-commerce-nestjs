import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { ActivateAccountListener } from './listeners';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import HandlebarsHelper from 'handlebars-helpers';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): MailerOptions => {
        return {
          transport: {
            host: config.getOrThrow('SMTP_HOST'),
            port: config.getOrThrow('SMTP_PORT'),
            secure: config.getOrThrow('SMTP_SECURE_SSL') === 'true',
            auth: {
              user: config.getOrThrow('SMTP_USERNAME'),
              pass: config.getOrThrow('SMTP_PASSWORD'),
            },
          },
          defaults: {
            from: `"No Reply" <${config.getOrThrow('SMTP_SENDER_EMAIL_DEFAULT')}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
              helpers: HandlebarsHelper(),
            },
          },
        };
      },
    }),
  ],
  providers: [ActivateAccountListener],
})
export class MailModule {}
