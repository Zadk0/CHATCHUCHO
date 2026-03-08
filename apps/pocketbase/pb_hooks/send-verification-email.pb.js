/// <reference path="../pb_data/types.d.ts" />
onRecordCreate((e) => {
  const verificationToken = $security.generateToken(32);
  e.record.set('verification_token', verificationToken);
  e.next();
}, "users");

onRecordAfterCreateSuccess((e) => {
  const mailClient = $app.newMailClient();
  const verificationToken = e.record.get('verification_token');
  const verificationLink = 'http://localhost:3000/verify?token=' + verificationToken + '&userId=' + e.record.get('id');
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress || "noreply@wzchat.local",
      name: $app.settings().meta.senderName || "WZChat"
    },
    to: [{address: e.record.get('email')}],
    subject: 'Verifica tu cuenta de WZChat',
    html: `
      <div style="background-color: #0a0a0a; color: #ffffff; padding: 40px 20px; font-family: sans-serif; text-align: center; border: 1px solid #00d4ff; border-radius: 8px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00d4ff; text-shadow: 0 0 15px rgba(0, 212, 255, 0.8); margin-bottom: 20px;">WZ<span style="font-weight: 700;">CHAT</span></h1>
          <p style="font-size: 16px; color: #a0a0a0; margin-bottom: 30px;">
              Bienvenido a la red. Para activar tu canal de comunicación seguro, por favor verifica tu identidad.
          </p>
          <a href="${verificationLink}" style="display: inline-block; background-color: #00d4ff; color: #0a0a0a; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; text-transform: uppercase; box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);">
              Verificar Email
          </a>
      </div>
    `
  });
  mailClient.send(message);
  e.next();
}, "users");