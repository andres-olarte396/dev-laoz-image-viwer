// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware para servir archivos estáticos
app.use(express.static('public'));
const imagesDir = path.join(__dirname, 'public/images');

// Ruta para obtener las imágenes de la carpeta
app.get('/images', (req, res) => {
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer el directorio' });
        }

        // Filtra solo archivos de imagen (JPG, PNG, etc.)
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        let images = [];
        for (let i = 0; i < imageFiles.length; i++) {
            images.push({
                id: i + 1,
                filename: imageFiles[i],
                alt: `Imagen ${i + 1}`
            });
        }
        res.json(images);
    });
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
