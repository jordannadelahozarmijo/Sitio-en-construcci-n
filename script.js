// Animación de entrada suave
window.addEventListener('load', () => {
  const fadeInElements = document.querySelectorAll('.fade-in');
  fadeInElements.forEach(el => {
    setTimeout(() => el.classList.add('visible'), 200);
  });
});