# Universo Dragon Ball

Hola, soy **Juan Manuel** y esta es la historia de cómo armé mi proyecto web.

Quería algo más que una página con mi nombre y una foto. Quería que tuviera vida: un juego, un medidor de poder como el de Dragon Ball, un buscador de personajes que hable con internet en tiempo real y hasta un modo oscuro y uno claro. Todo hecho con **HTML, CSS (con Tailwind) y JavaScript**.

---

## Paginas HTML

### Inicio (`index.html`)
Es la portada. Lo primero que ves es una frase que se **escribe sola**, como si alguien la estuviera tecleando. Al lado hay un **monitor** que le pregunta a la API de Dragon Ball: "¿estás despierta?", y te muestra si respondió, cuánto tardó y cuántos personajes tiene. También hay una tarjeta pequeña conmigo y lo que estoy haciendo ahora.

### Sobre Mí (`sobre-mi.html`)
Aquí me presento: lo que me gusta (el gimnasio, el fútbol, programar, la música), mi emprendimiento **Opulus Vibe**, mis metas y unas **barras** que muestran qué tanto domino cada lenguaje. Los números suben y las barras se llenan solas cuando llegas a esa parte de la página.

### Reto de Clicks (`juego.html`)
Un juego sencillo con una idea: dar **50 clicks**. Mientras avanzas, Goku se va transformando hasta llegar a Ultra Instinto. Al final aparece una pregunta que me gusta mucho: *"¿Usted sí valora su tiempo?"* y cada respuesta tiene su propio mensaje.

### Medidor de KI (`innovacion.html`)
Mi parte favorita: un **Scouter** como el de la serie. Te hace tres pruebas (reflejos, energía y cálculo mental) y al final te dice cuánto Ki tienes y qué rango de guerrero eres.

### Dragon Ball API (`dragon-ball.html`)
Un buscador de personajes. Escribes un nombre, aparecen las tarjetas y, si le das click a una, se abre una ventana con su Ki, su historia, sus transformaciones y su planeta.

---

## Módulos de JavaScript

Todo el código está dividido en archivos pequeños dentro de `js/modules/`. Cada uno hace una sola cosa, y `js/main.js` los enciende todos al cargar cada página.

| Módulo | Qué hace |
|---|---|
| `navigation.js` | Dibuja el menú y el pie de página en todas las páginas. Se escribe una vez y se ve en las cinco. |
| `theme.js` | Cambia entre modo oscuro y claro y recuerda tu elección. |
| `effects.js` | Hace la frase que se escribe sola, los números que suben y las barras que se llenan. |
| `api-monitor.js` | Le pregunta a la API si está funcionando y muestra cuánto tardó y cuántos personajes tiene. |
| `click-counter.js` | Cuenta los clicks del juego y bloquea las trampas (clicks falsos y autoclickers). |
| `game.js` | Maneja el juego: actualiza el contador y la barra, y hace que Goku reaccione y se transforme. |
| `goku-forms.js` | Guarda las formas de Goku (Base hasta Ultra Instinto) y busca sus imágenes en la API. |
| `dragonball.js` | Es el buscador de personajes: muestra las tarjetas y la ventana con el detalle de cada uno. |
| `extra.js` | Es el Scouter: hace las tres pruebas y calcula tu Ki y tu rango. |

Cada módulo revisa primero si su parte existe en la página. Si no existe, no hace nada. Por eso un solo `main.js` funciona en las cinco páginas.

---

**Juan Manuel**
