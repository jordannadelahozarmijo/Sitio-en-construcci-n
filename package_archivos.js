const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path'); // Módulo de Node para manejar rutas de archivos

const app = express();
const PORT = 3000;

// --- Configuración de Middleware ---

// Necesario para que Express pueda servir archivos estáticos (como tu formulario HTML)
// Asume que tu archivo HTML se llama index.html y está en la misma carpeta
app.use(express.static(path.join(__dirname, ''))); 

// Configuración de multer: usa 'memoryStorage' para guardar el archivo en la RAM
// Esto es ideal para pasarlo directamente a nodemailer sin tocar el disco.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Ruta Principal: Manejo del Formulario ---

// RUTA POST: Maneja el envío del formulario. 
// upload.single('archivoAdjunto') espera un campo de tipo file con el nombre 'archivoAdjunto'
app.post('/enviar-formulario', upload.single('archivoAdjunto'), async (req, res) => {
    
    // 1. Obtener datos del formulario y el archivo
    const archivo = req.file; // Contiene el archivo subido (buffer)
    const nombre = req.body.nombre || 'Sin Nombre';
    const emailUsuario = req.body.email || 'sin_email@ejemplo.com';
    
    if (!archivo) {
        return res.status(400).send('Error: No se adjuntó ningún archivo. Por favor, intente de nuevo.');
    }

    try {
        // 2. Configurar el Transporter de nodemailer (Usando tu Gmail)
        let transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: 'appsirvetodo@gmail.com', // ✅ Tu cuenta de envío de Gmail
                pass: '@SitioWeb25@' // ⚠️ CRÍTICO: Usa la Contraseña de Aplicación de 16 caracteres de Google
            }
        });

        // 3. Definir los detalles del correo (Mail Options)
        let mailOptions = {
            from: `"Formulario SirveTodo" <appsirvetodo@gmail.com>`, // De quién se envía
            to: '⚠️ CÁMBIALO: contacto@sirvetodo.com', // A dónde quieres que llegue el correo
            subject: `📧 Nuevo Archivo Adjunto de: ${nombre}`,
            html: `
                <h2>Detalles del Envío:</h2>
                <p><b>Remitente:</b> ${nombre}</p>
                <p><b>Email de Contacto:</b> ${emailUsuario}</p>
                <p>Se adjunta el archivo subido por el usuario.</p>
                <p>Nombre del archivo: <b>${archivo.originalname}</b></p>
            `,
            
            // 4. ADJUNTAR el archivo desde el buffer de multer
            attachments: [
                {
                    filename: archivo.originalname, // Nombre original
                    content: archivo.buffer,       // Contenido del archivo en memoria
                    contentType: archivo.mimetype   // Tipo de archivo
                }
            ]
        };

        // 5. Enviar el correo
        let info = await transporter.sendMail(mailOptions);
        console.log('Mensaje enviado: %s', info.messageId);

        // Envía una respuesta al cliente
        res.status(200).send(`
            <h1>✅ ¡Éxito!</h1>
            <p>Archivo recibido y correo enviado con éxito a ${mailOptions.to}.</p>
            <p><a href="/">Volver al formulario</a></p>
        `);
        
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send(`
            <h1>❌ Error</h1>
            <p>Hubo un error interno al procesar el formulario o enviar el correo.</p>
            <p>Asegúrese de haber configurado correctamente la Contraseña de Aplicación en Google.</p>
            <p><a href="/">Volver al formulario</a></p>
        `);
    }
});

// --- Inicio del Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
    console.log(`Para probar, abre tu navegador y ve a http://localhost:${PORT}/index.html`);
});