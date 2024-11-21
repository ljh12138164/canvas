import { Hono } from 'hono';
import { EmailTemplate } from '../../emails/design';
import { resend } from '../../emails/send';

export const emails = new Hono().get('/abc', async (c) => {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: 'delivered@resend.dev',
    subject: '注册账户',
    react: <EmailTemplate firstName='John' url='https://www.baidu.com' />,
  });
  if (error) {
    return c.json(error, 400);
  }

  return c.json(data);
});
