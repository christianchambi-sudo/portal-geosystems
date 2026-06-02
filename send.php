<?php
// GeoSystems Consulting — send.php
// Recibe el formulario y envía el correo via Gmail SMTP

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Recoger y sanitizar datos del formulario
$nombre      = htmlspecialchars(strip_tags($_POST['nombre']      ?? ''));
$organizacion= htmlspecialchars(strip_tags($_POST['organizacion']?? ''));
$email       = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$servicio    = htmlspecialchars(strip_tags($_POST['servicio']    ?? ''));
$descripcion = htmlspecialchars(strip_tags($_POST['descripcion'] ?? ''));

// Validación básica
if (!$nombre || !$email || !$servicio || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos incompletos o inválidos']);
    exit;
}

// ── CONFIGURACIÓN GMAIL ──────────────────────────────────────────────────────
$gmailUser     = 'boliviageosystems@gmail.com'; // Tu correo Gmail
$gmailPassword = 'AQUI_TU_APP_PASSWORD_16_CHARS'; // Contraseña de aplicación Gmail
$destinatario  = 'boliviageosystems@gmail.com'; // Donde llega el correo
// ────────────────────────────────────────────────────────────────────────────

$mail = new PHPMailer(true);

try {
    // Servidor SMTP Gmail
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $gmailUser;
    $mail->Password   = $gmailPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // Remitente y destinatario
    $mail->setFrom($gmailUser, 'GeoSystems Web');
    $mail->addAddress($destinatario, 'GeoSystems Consulting');
    $mail->addReplyTo($email, $nombre); // Responder va directo al cliente

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = "Nueva Solicitud de Cotización — {$servicio}";
    $mail->Body    = "
    <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#021829;color:#F7F4EF;padding:32px;border-radius:12px;'>
      <div style='border-bottom:2px solid #1D9E75;padding-bottom:16px;margin-bottom:24px;'>
        <h2 style='color:#5DCAA5;margin:0;font-size:22px;'>GeoSystems Consulting</h2>
        <p style='color:#aaa;margin:4px 0 0;font-size:13px;'>Nueva solicitud de cotización recibida</p>
      </div>

      <table style='width:100%;border-collapse:collapse;'>
        <tr>
          <td style='padding:10px 0;color:#5DCAA5;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:140px;'>Nombre</td>
          <td style='padding:10px 0;color:#F7F4EF;font-size:15px;'>{$nombre}</td>
        </tr>
        <tr style='border-top:1px solid rgba(255,255,255,0.08)'>
          <td style='padding:10px 0;color:#5DCAA5;font-size:12px;text-transform:uppercase;letter-spacing:1px;'>Organización</td>
          <td style='padding:10px 0;color:#F7F4EF;font-size:15px;'>{$organizacion}</td>
        </tr>
        <tr style='border-top:1px solid rgba(255,255,255,0.08)'>
          <td style='padding:10px 0;color:#5DCAA5;font-size:12px;text-transform:uppercase;letter-spacing:1px;'>Email</td>
          <td style='padding:10px 0;'><a href='mailto:{$email}' style='color:#378ADD;'>{$email}</a></td>
        </tr>
        <tr style='border-top:1px solid rgba(255,255,255,0.08)'>
          <td style='padding:10px 0;color:#5DCAA5;font-size:12px;text-transform:uppercase;letter-spacing:1px;'>Servicio</td>
          <td style='padding:10px 0;color:#EF9F27;font-size:15px;font-weight:bold;'>{$servicio}</td>
        </tr>
        <tr style='border-top:1px solid rgba(255,255,255,0.08)'>
          <td style='padding:10px 0;color:#5DCAA5;font-size:12px;text-transform:uppercase;letter-spacing:1px;vertical-align:top;'>Descripción</td>
          <td style='padding:10px 0;color:#F7F4EF;font-size:14px;line-height:1.6;'>{$descripcion}</td>
        </tr>
      </table>

      <div style='margin-top:28px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);font-size:11px;color:#666;'>
        Enviado desde el formulario web de GeoSystems Consulting
      </div>
    </div>
    ";

    // Versión texto plano (para clientes que no soportan HTML)
    $mail->AltBody = "NUEVA SOLICITUD DE COTIZACIÓN\n\nNombre: {$nombre}\nOrganización: {$organizacion}\nEmail: {$email}\nServicio: {$servicio}\nDescripción: {$descripcion}";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Correo enviado correctamente']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al enviar: ' . $mail->ErrorInfo]);
}
