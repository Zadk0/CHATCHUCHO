/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const mailClient = $app.newMailClient();
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress || "noreply@wzchat.local",
      name: $app.settings().meta.senderName || "WZChat"
    },
    to: [{address: e.record.get('email')}],
    subject: 'Bienvenido a WZChat',
    html: `
      <div style="background-color: #0a0a0a; color: #ffffff; padding: 40px 20px; font-family: sans-serif; text-align: center; border: 1px solid #00d4ff; border-radius: 8px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00d4ff; text-shadow: 0 0 15px rgba(0, 212, 255, 0.8); margin-bottom: 20px;">WZ<span style="font-weight: 700;">CHAT</span></h1>
          <p style="font-size: 16px; color: #a0a0a0; margin-bottom: 30px;">
              Tu cuenta ha sido creada y verificada exitosamente. Ya puedes iniciar sesión.
          </p>
      </div>
    `
  });
  mailClient.send(message);
  e.next();
}, "users");