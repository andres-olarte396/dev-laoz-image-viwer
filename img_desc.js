const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
const sharp = require('sharp');

// Configura tu clave API de OpenAI
const configuration = new Configuration({
    apiKey: 'TU_CLAVE_API'
});
const openai = new OpenAIApi(configuration);


// Configura el directorio de imágenes
const imageDirectory = './public/images';

// Función para generar una descripción con IA de una imagen
async function describeImage(imagePath) {
    try {
        // Obtén detalles de la imagen
        const image = await sharp(imagePath);
        const metadata = await image.metadata();
        const imgDetails = `La imagen tiene un tamaño de ${metadata.width}x${metadata.height} píxeles.`;
        
        // Describe la imagen usando el modelo de IA de OpenAI
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Describe detalladamente el contenido de esta imagen y proporciona enlaces informativos sobre el tema: ${imgDetails} y genera una descripción con vínculos de referencia.`,
            max_tokens: 100
        });
        
        const description = response.data.choices[0].text.trim();
        
        return {
            ruta: imagePath,
            descripcion: description
        };
        
    } catch (error) {
        console.error(`Error al procesar ${imagePath}: ${error.message}`);
        return null;
    }}

// Procesa cada imagen en el directorio
async function generateJsonForImages(directory) {
    const imageDescriptions = [];
    
    const files = fs.readdirSync(directory);
    for (const filename of files) {
        const ext = path.extname(filename).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.bmp', '.gif'].includes(ext)) {
            const imagePath = path.join(directory, filename);
            const description = await describeImage(imagePath);
            if (description) {
                imageDescriptions.push(description);
            }
        }
    }
    
    // Guarda los resultados en un archivo JSON
    fs.writeFileSync('descripciones_imagenes.json', JSON.stringify(imageDescriptions, null, 4), 'utf8');
    console.log('Archivo JSON generado exitosamente.');
}

// Ejecuta la función para generar el JSON
generateJsonForImages(imageDirectory);
