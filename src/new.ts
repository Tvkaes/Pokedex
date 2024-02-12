import './index.scss'



document.addEventListener('DOMContentLoaded', () => {
    const interBubble = document.querySelector<HTMLDivElement>('.interactive')!;
    const textContainer = document.querySelector<HTMLDivElement>('.front')!;

    function getNegativeColor(color: string): string {
        // Convertir el color RGB a negativo
        const rgb = color.match(/\d+/g)!.map(Number);
        const negativeRgb = rgb.map((value) => 255 - value);
        return `rgb(${negativeRgb[0]}, ${negativeRgb[1]}, ${negativeRgb[2]})`;
    }

    function getColorUnderText() {
        // Obtener el color de fondo en la posición del texto
        const computedStyle = window.getComputedStyle(textContainer);
        const backgroundColor = computedStyle.backgroundColor;
        
        // Obtener el color negativo
        const negativeColor = getNegativeColor(backgroundColor);

        return negativeColor;
    }
  
    function updateTextColor() {
        const colorUnderText = getColorUnderText();
        // Aplicar el color negativo al texto
        textContainer.style.color = colorUnderText;
    }
  

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
  
    function move() {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;

          // Añadir parallax al texto
        //  textContainer.style.transform = `translate(${Math.round(curX / 2)}px, ${Math.round(curY / 2)}px)`;

           // Actualizar el color del texto
        updateTextColor();
        
        requestAnimationFrame(() => {
            move();
        });
    }
  
    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });
  
    move();
  });


  