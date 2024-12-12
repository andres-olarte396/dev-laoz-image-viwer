document.addEventListener("DOMContentLoaded", () => {
    let images = [];
    let currentSlide = 0;
    const sliderContainer = document.getElementById("slider");
    const detailsContainer = document.getElementById("details");
    const imageTitle = document.getElementById("image-title");
    const imageDescription = document.getElementById("image-description");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    // Función para cargar las imágenes desde el servidor
    async function loadImages() {
        try {
            const response = await fetch("/images"); // Asumimos que el servidor devuelve un JSON con las imágenes
            images = await response.json();
            showSlide(currentSlide);
        } catch (error) {
            console.error("Error al cargar las imágenes:", error);
        }
    }

    // Función para mostrar la imagen actual
    async function showSlide(index) {
        sliderContainer.innerHTML = '';
        const img = document.createElement("img");
        img.src = `/images/${images[index].filename}`;
        img.alt = images[index].alt || `Imagen ${images[index].id}`;
        sliderContainer.appendChild(img);

        // Verificar si existe un archivo JSON asociado a la imagen
        const jsonFilename = `/images/${images[index].filename?.split('.')[0]}.json`;

        try {
            const response = await fetch(jsonFilename);
            const metadata = await response.json();

            // Mostrar el título y la descripción si existe el JSON
            imageTitle.textContent = metadata.title || '';
            imageDescription.innerHTML = metadata.description || '';
            detailsContainer.classList.remove("hidden");
        } catch (error) {
            // Si no hay JSON, ocultar la sección de detalles
            detailsContainer.classList.add("hidden");
        }
    }

    // Función para mostrar la imagen anterior
    function showPrevSlide() {
        currentSlide = (currentSlide === 0) ? images.length - 1 : currentSlide - 1;
        showSlide(currentSlide);
    }

    // Función para mostrar la imagen siguiente
    function showNextSlide() {
        currentSlide = (currentSlide === images.length - 1) ? 0 : currentSlide + 1;
        showSlide(currentSlide);
    }

    // Asignar las funciones a los botones de anterior y siguiente
    prevButton.addEventListener("click", showPrevSlide);
    nextButton.addEventListener("click", showNextSlide);

    // Asignar las funciones a las teclas del teclado
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            showPrevSlide(); // Flecha izquierda muestra la imagen anterior
        } else if (event.key === "ArrowRight") {
            showNextSlide(); // Flecha derecha muestra la imagen siguiente
        }
    });

    // Cargar imágenes al iniciar
    loadImages();

    let acc = document.getElementsByClassName("accordion");
    for (const element of acc) {
        element.addEventListener("click", function () {
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
});
