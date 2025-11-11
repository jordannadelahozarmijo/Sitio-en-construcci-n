// 🧮 Contador global de archivos
let contadorArchivos = 1;

function addFileInput(input) {
  if (input.files.length > 0) {
    const file = input.files[0];
    const fileName = file.name;

    // Crear contenedor visual para el archivo
    const fileItem = document.createElement("div");
    fileItem.classList.add("file-item");
    fileItem.innerHTML = `
      <span class="file-name">📎 ${fileName}</span>
      <button type="button" class="remove-file">✕</button>
    `;

    // Insertar después del input actual
    input.closest(".file-label").after(fileItem);

    // Ocultar el input original (ya tiene archivo)
    input.closest(".file-label").style.display = "none";

    // Agregar nuevo input para subir otro archivo
    contadorArchivos++;
    const newLabel = document.createElement("label");
    newLabel.classList.add("file-label");
    newLabel.innerHTML = `
      + Agrega un archivo (JPG, PNG, MP4 o MP3 de hasta 5 MB)
      <input type="file" name="archivo${contadorArchivos}" accept=".jpg,.jpeg,.png,.mp4,.mp3" onchange="addFileInput(this)">
    `;

    document.getElementById("file-container").appendChild(newLabel);

    // Agregar funcionalidad al botón ❌
    fileItem.querySelector(".remove-file").addEventListener("click", () => {
      fileItem.remove();
      input.closest(".file-label").remove(); // elimina el input viejo
    });
  }
}



// 🚀 Envío del formulario al Apps Script
document.getElementById("serviceForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);
  const spinner = document.getElementById("spinner"); // 🌀 referencia al spinner

  console.log("🧾 Enviando formulario con los siguientes datos:");
  for (let [key, value] of data.entries()) {
    if (value instanceof File) {
      console.log(`📄 Archivo -> ${key}: ${value.name} (${(value.size / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`✏️ Campo -> ${key}: ${value}`);
    }
  }

  console.log("🚀 Enviando datos a Google Apps Script...");

  // 👉 Mostrar spinner
  spinner.style.display = "flex";

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxWRiKVqowzuY1s8jFzXVwxgtOAWIs1aXm15Ye7IbUNRvvFSuz-hZpoWQIUPRlgoXAj/exec", {
      method: "POST",
      body: data,
    });

    const text = await response.text();
    console.log("✅ Respuesta del servidor:", text);
    alert("Recibimos tu mensaje, te contactaremos por correo o Whatsapp a la brevedad. ✅");

    // Reiniciar el formulario
    form.reset();
    contadorArchivos = 1;
    document.getElementById("file-container").innerHTML = `
      <label class="file-label">
        + Agrega un archivo (JPG, PNG, MP4 o MP3 de hasta 5 MB)
        <input type="file" name="archivo1"
               accept=".jpg,.jpeg,.png,.mp4,.mp3"
               onchange="addFileInput(this)">
      </label>
    `;
    console.log("🧹 Formulario reiniciado y listo para nuevo envío.");
  } catch (err) {
    console.error("❌ Error al enviar formulario:", err);
    alert("Error al enviar: " + err.message);
  } finally {
    // 👉 Ocultar spinner siempre (éxito o error)
    spinner.style.display = "none";
  }
});