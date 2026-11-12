# GeoSystems Consulting — send.py
# Backend Flask para el formulario "Solicitar Cotización"
# Envía correo a boliviageosystems@gmail.com via Gmail SMTP

import os
import smtplib
import html
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Flask, request, jsonify

app = Flask(__name__)

# ── CONFIGURACIÓN ────────────────────────────────────────────────────────────
# La contraseña NO va en el código (el repositorio es público).
# Se lee del archivo privado del servidor /etc/geosystems-mail.env:
#   GMAIL_PASSWORD=xxxx xxxx xxxx xxxx
GMAIL_USER     = os.environ.get('GMAIL_USER', 'boliviageosystems@gmail.com')
GMAIL_PASSWORD = os.environ.get('GMAIL_PASSWORD', '')
# ─────────────────────────────────────────────────────────────────────────────

DESTINATARIO = 'boliviageosystems@gmail.com'

@app.route('/send.py', methods=['POST', 'OPTIONS'])
def enviar_correo():
    if request.method == 'OPTIONS':
        r = jsonify({})
        r.headers['Access-Control-Allow-Origin'] = '*'
        r.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return r, 200

    nombre       = html.escape(request.form.get('nombre',       '').strip())
    organizacion = html.escape(request.form.get('organizacion', '').strip())
    email        = request.form.get('email', '').strip()
    servicio     = html.escape(request.form.get('servicio',     '').strip())
    descripcion  = html.escape(request.form.get('descripcion',  '').strip())

    if not nombre or not email or not servicio:
        return jsonify({'success': False, 'message': 'Datos incompletos'}), 400

    cuerpo_html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;
                background:#021829;color:#F7F4EF;padding:32px;border-radius:12px;">
      <div style="border-bottom:2px solid #1D9E75;padding-bottom:16px;margin-bottom:24px;">
        <h2 style="color:#5DCAA5;margin:0;font-size:22px;">GeoSystems Consulting</h2>
        <p style="color:#aaa;margin:4px 0 0;font-size:13px;">Nueva solicitud de cotización recibida</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;color:#5DCAA5;font-size:12px;text-transform:uppercase;
                     letter-spacing:1px;width:140px;">Nombre</td>
          <td style="padding:10px 0;color:#F7F4EF;font-size:15px;">{nombre}</td>
        </tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.08)">
          <td style="padding:10px 0;color:#5DCAA5;font-size:12px;text-transform:uppercase;
                     letter-spacing:1px;">Organización</td>
          <td style="padding:10px 0;color:#F7F4EF;font-size:15px;">{organizacion}</td>
        </tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.08)">
          <td style="padding:10px 0;color:#5DCAA5;font-size:12px;text-transform:uppercase;
                     letter-spacing:1px;">Email cliente</td>
          <td style="padding:10px 0;">
            <a href="mailto:{email}" style="color:#378ADD;">{email}</a>
          </td>
        </tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.08)">
          <td style="padding:10px 0;color:#5DCAA5;font-size:12px;text-transform:uppercase;
                     letter-spacing:1px;">Servicio</td>
          <td style="padding:10px 0;color:#EF9F27;font-size:15px;font-weight:bold;">{servicio}</td>
        </tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.08)">
          <td style="padding:10px 0;color:#5DCAA5;font-size:12px;text-transform:uppercase;
                     letter-spacing:1px;vertical-align:top;">Descripción</td>
          <td style="padding:10px 0;color:#F7F4EF;font-size:14px;line-height:1.6;">{descripcion}</td>
        </tr>
      </table>
      <div style="margin-top:28px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);
                  font-size:11px;color:#666;">
        Enviado desde el formulario web · GeoSystems Consulting
      </div>
    </div>
    """

    cuerpo_texto = (
        f"NUEVA SOLICITUD DE COTIZACIÓN — GeoSystems\n"
        f"{'='*45}\n"
        f"Nombre:        {nombre}\n"
        f"Organización:  {organizacion}\n"
        f"Email:         {email}\n"
        f"Servicio:      {servicio}\n"
        f"Descripción:\n{descripcion}\n"
    )

    msg = MIMEMultipart('alternative')
    msg['Subject']  = f"Cotización: {servicio} — {nombre}"
    msg['From']     = f"GeoSystems Web <{GMAIL_USER}>"
    msg['To']       = DESTINATARIO
    msg['Reply-To'] = f"{nombre} <{email}>"

    msg.attach(MIMEText(cuerpo_texto, 'plain', 'utf-8'))
    msg.attach(MIMEText(cuerpo_html,  'html',  'utf-8'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as srv:
            srv.ehlo()
            srv.starttls()
            srv.login(GMAIL_USER, GMAIL_PASSWORD)
            srv.sendmail(GMAIL_USER, DESTINATARIO, msg.as_string())

        r = jsonify({'success': True, 'message': 'Correo enviado correctamente'})
        r.headers['Access-Control-Allow-Origin'] = '*'
        return r, 200

    except smtplib.SMTPAuthenticationError:
        return jsonify({'success': False,
                        'message': 'Error de autenticación. Verifique el App Password de Gmail'}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
