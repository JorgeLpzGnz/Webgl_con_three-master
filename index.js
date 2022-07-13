const texto = document.querySelectorAll('.texto')

function showText(entradas) {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.style.opacity = 1
      } else {
      }
    });
  }
  
const observer = new IntersectionObserver(showText, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
});

texto.forEach( element => observer.observe(element) )
  
