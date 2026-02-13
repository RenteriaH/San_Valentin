const COLORS = ["#ff1744","#e91e63","#c2185b","#ff4081","#f06292","#ff6b9d","#ec407a","#ff80ab"];
let fallingHeartsActive = false;
let fallingHeartsTimeoutId = null;

// Mostrar contenido (se usa desde el botón de la landing o directamente en la página del árbol)
function showContent() {
    document.getElementById('background-audio').play();
    const intro = document.getElementById("intro");
    const content = document.getElementById("content");

    // animar salida del intro
    intro.classList.add('fade-out');

    setTimeout(() => {
        intro.style.display = "none";

        // Mostrar contenido (usar clase que define display:flex)
        content.classList.remove("hidden");
        content.classList.add("content-visible");

        // Mostrar árbol
        const tree = document.getElementById("treeContainer");
        if (tree) tree.style.opacity = "1";

        // Ejecutar animaciones y preparar toggle de hojas
        initializeTree();
        if (tree) tree.addEventListener('click', toggleLeaves);
        // Revelar hojas automáticamente después de que el árbol se dibuje
        setTimeout(revealLeaves, 2500); // Llamamos a la función solo una vez

        // Iniciar corazones que caen cuando las hojas terminan de aparecer
        fallingHeartsTimeoutId = setTimeout(startFallingHearts, 12600);

        // Corregido: Iniciar la escritura solo una vez con un retraso
        // para que coincida con las animaciones del árbol.
        setTimeout(typeText, 1000); // Espera 3 segundos antes de empezar a escribir
    }, 600);
}

// Si existe el botón (landing), convertirlo en trigger; si no, iniciar directamente (página del árbol)
const heartBtn = document.getElementById("heartButton");
if (heartBtn) {
    heartBtn.addEventListener('click', showContent);
} else {
    // script included at end of body on the tree page — start immediately if content exists
    if (document.getElementById('content')) {
        // give a tiny delay so layout/CSS settle
        setTimeout(showContent, 100);
    }
}

// TEXTO QUE SE ESCRIBE
const text = `Para el amor de mi vida:
Si pudiera elegir un lugar seguro, sería a tu lado.
Cuanto más tiempo estoy contigo más te amo.

- love you -
`;

let i = 0;
function typeText() {
    const loveTextEl = document.getElementById("loveText");
    const cursorEl = loveTextEl.querySelector('.cursor');

    if (i < text.length) {
        // Insertar el carácter antes del cursor
        cursorEl.insertAdjacentText('beforebegin', text.charAt(i));
        i++;
        setTimeout(typeText, 170); // Aumentamos el tiempo para que la escritura sea aún más lenta
    } else {
        // Ocultar el cursor, mostrar el timer y luego la firma
        cursorEl.style.display = 'none';
        startTimer();
        setTimeout(showSignature, 1000); // Muestra la firma 1s después del timer
    }
}

// TIMER DESDE 18 OCTUBRE
function startTimer() {
    const startDate = new Date("2025-10-18");

    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.classList.add('visible');

    setInterval(() => {
        let now = new Date();
        let diff = now - startDate;

        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor(diff / (1000 * 60 * 60) % 24);
        let minutes = Math.floor(diff / (1000 * 60) % 60);
        let seconds = Math.floor(diff / 1000 % 60);

        document.getElementById("timer").innerHTML =
            `<span>${days}</span> días <span>${hours}</span> horas <span>${minutes}</span> minutos <span>${seconds}</span> segundos`;
    }, 1000);
}

// Función para crear un corazón SVG
function createHeartSVG(x, y, size, color, delay) {
    const heart = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const scale = size / 15;
    heart.setAttribute("d", `M ${x} ${y} l ${8*scale} ${-8*scale} c ${2*scale} ${-2*scale} ${5*scale} ${-2*scale} ${7*scale} 0 c ${2*scale} ${2*scale} ${2*scale} ${5*scale} 0 ${7*scale} l ${-7*scale} ${7*scale} l ${-7*scale} ${-7*scale} c ${-2*scale} ${-2*scale} ${-2*scale} ${-5*scale} 0 ${-7*scale} c ${2*scale} ${-2*scale} ${5*scale} ${-2*scale} ${7*scale} 0 z`);
    heart.setAttribute("fill", color);
    heart.setAttribute("class", "heart-svg");
    // store delay for later (we won't start animation until user triggers it)
    heart.dataset.delay = delay;
    heart.dataset.x = x; // Usamos la 'x' que recibe la función
    heart.dataset.y = y;
    // start hidden (no animation yet)
    heart.style.opacity = '0';
    heart.style.transform = 'scale(0)';
    return heart;
}

// Inicializador del árbol
function initializeTree() {
    const colors = ["#ff1744", "#e91e63", "#c2185b", "#ff4081", "#f06292", "#ff6b9d", "#ec407a", "#ff80ab"];
    const heartsContainer = document.getElementById("hearts");
    if (!heartsContainer) return;
    // limpiar si ya hay corazones
    heartsContainer.innerHTML = '';
    
    let heartCount = 0;
    const centerX = 295;
    const centerY = 305;
    const heartScale = 10.5;
    // ajustar retraso de aparición de hojas
    const baseDelay = 0.8; // segundos
    // aumentar stagger para evitar que muchas hojas animen exactamente al mismo tiempo
    const delayStep = 0.01; // stagger entre corazones
    
    // Contorno del corazón
    for (let t = 0; t < Math.PI * 2; t += 0.04) {
        const isLeftSide = (t > Math.PI * 0.3 && t < Math.PI * 1.7);
        const isRightSide = (t < Math.PI * 0.3 || t > Math.PI * 1.7);
        
        let keepProbability = 0.6;
        if (isLeftSide) keepProbability = 0.75;
        if (isRightSide) keepProbability = 0.75;
        
        if (Math.random() > keepProbability) {
            const x = centerX + heartScale * 16 * Math.pow(Math.sin(t), 3);
            const y = centerY - heartScale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            const randomX = x + (Math.random() - 0.5) * 15;
            const randomY = y + (Math.random() - 0.5) * 15;
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 9 + Math.random() * 7;
            const delay = baseDelay + heartCount * delayStep;
            
            const heart = createHeartSVG(randomX, randomY, size, color, delay);
            heartsContainer.appendChild(heart);
            heartCount++;
        }
    }
    
    // Rellenar el interior
    for (let i = 0; i < 800; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random();
        
        const t = angle;
        const baseX = centerX + heartScale * 16 * Math.pow(Math.sin(t), 3);
        const baseY = centerY - heartScale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        const x = centerX + (baseX - centerX) * radius;
        let y = centerY + (baseY - centerY) * radius;
        
        const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        
        // Área del tronco - reducir significativamente corazones en el centro
        if (Math.abs(x - centerX) < 60 && y > centerY - 70) {
            if (Math.random() > 0.98) continue;
        }

        // Evitar generar corazones muy cerca del centro (quita el núcleo)
        if (distanceFromCenter < 80) {
            // Saltar la mayoría cerca del centro, pero dejar más corazones (~35%)
            if (Math.random() > 0.35) continue;
        } else if (distanceFromCenter < 140) {
            if (Math.random() > 0.6) continue;
        }

        // Si el corazón está en la zona central y está por debajo del centro, subirlo un 25%
        if (distanceFromCenter < 80 && y > centerY) {
            y = y - (y - centerY) * 0.25;
        }
        
            if (y > centerY + 80) {
                if (Math.random() > 0.75) continue;
            }

            const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 8 + Math.random() * 7;
        const delay = baseDelay + heartCount * delayStep;

        const heart = createHeartSVG(x, y, size, color, delay);
        heartsContainer.appendChild(heart);
        heartCount++;
    }
    
    // Lados del corazón
    for (let i = 0; i < 400; i++) {
        const sideAngle = Math.random() < 0.5 
            ? Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.8
            : Math.PI * 1.5 + (Math.random() - 0.5) * Math.PI * 0.8;
        
        const radius = 0.4 + Math.random() * 0.6;
        
        const baseX = centerX + heartScale * 16 * Math.pow(Math.sin(sideAngle), 3);
        const baseY = centerY - heartScale * (13 * Math.cos(sideAngle) - 5 * Math.cos(2*sideAngle) - 2 * Math.cos(3*sideAngle) - Math.cos(4*sideAngle));
        
        const x = centerX + (baseX - centerX) * radius;
        const y = centerY + (baseY - centerY) * radius;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 8 + Math.random() * 6;
        const delay = baseDelay + heartCount * delayStep;
        
        const heart = createHeartSVG(x, y, size, color, delay);
        heartsContainer.appendChild(heart);
        heartCount++;
    }
    
    // Parte inferior
    for (let i = 0; i < 72; i++) {
        const bottomAngle = Math.PI + (Math.random() - 0.5) * Math.PI * 0.4;
        const radius = 0.5 + Math.random() * 0.5;
        
        const baseX = centerX + heartScale * 16 * Math.pow(Math.sin(bottomAngle), 3);
        const baseY = centerY - heartScale * (13 * Math.cos(bottomAngle) - 5 * Math.cos(2*bottomAngle) - 2 * Math.cos(3*bottomAngle) - Math.cos(4*bottomAngle));
        
        const x = centerX + (baseX - centerX) * radius;
        const y = centerY + (baseY - centerY) * radius;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 8 + Math.random() * 6;
        const delay = baseDelay + heartCount * delayStep;
        
        const heart = createHeartSVG(x, y, size, color, delay);
        heartsContainer.appendChild(heart);
        heartCount++;
    }
}


// Revela las hojas (corazones) animándolas con los delays guardados
function revealLeaves() {
    const heartsContainer = document.getElementById("hearts");
    if (!heartsContainer) return;
    const hearts = Array.from(heartsContainer.querySelectorAll('.heart-svg'));
    
    // Encontrar las coordenadas X mínimas y máximas para normalizar el retraso
    const xCoords = hearts.map(h => parseFloat(h.dataset.x || 0));
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const totalAnimationTime = 9.5; // Duración total del barrido de derecha a izquierda

    hearts.forEach(heart => {
        const x = parseFloat(heart.dataset.x || 0);
        // Normalizar la posición X (0 para la izquierda, 1 para la derecha)
        const normalizedX = (x - minX) / (maxX - minX);
        // El retraso es inverso a la posición X (más a la derecha, menos retraso)
        const delay = (1 - normalizedX) * totalAnimationTime;
        heart.style.animation = `popHeart 0.6s ease-out ${delay.toFixed(2)}s forwards`;
    });
    heartsContainer.dataset.leavesVisible = 'true';
}

function hideLeaves() {
    const heartsContainer = document.getElementById("hearts");
    if (!heartsContainer) return;
    const hearts = Array.from(heartsContainer.querySelectorAll('.heart-svg'));
    
    hearts.forEach((heart) => {
        // Limpiamos la animación para que la transición de opacidad y escala funcione
        heart.style.animation = 'none';
        heart.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        heart.style.opacity = '0';
        heart.style.transform = 'scale(0)';
    });
    heartsContainer.dataset.leavesVisible = 'false';
}

function toggleLeaves() {
    const heartsContainer = document.getElementById("hearts");
    if (!heartsContainer) return;

    // Clear any pending start, to avoid multiple overlapping starts
    if (fallingHeartsTimeoutId) {
        clearTimeout(fallingHeartsTimeoutId);
        fallingHeartsTimeoutId = null;
    }

    const visible = heartsContainer.dataset.leavesVisible === 'true';
    if (visible) {
        hideLeaves();
        stopFallingHearts();
    } else {
        revealLeaves();
        // Schedule restart of falling hearts after leaves are revealed
        fallingHeartsTimeoutId = setTimeout(startFallingHearts, 10100);

        // Replay audio if it has ended
        const audio = document.getElementById('background-audio');
        if (audio && audio.ended) {
            audio.currentTime = 0; // Rewind to the beginning
            audio.play();
        }
    }
}


// Helper: read URL query param
function getUrlParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Firma manuscrita animada — versión corregida
function showSignature() {
    const dedication = document.getElementById('dedication-text');
    const signature = document.getElementById('signature');
    if (!dedication || !signature) return;

    const firma = getUrlParam('firma');
    signature.textContent = firma ? firma : 'Con amor para mi amor 🌹';
    signature.classList.add('visible');
}

// --- FALLING HEARTS ---

function stopFallingHearts() {
    fallingHeartsActive = false;
    // Remove all currently falling hearts from the DOM
    const fallingHearts = document.querySelectorAll('.falling-heart');
    fallingHearts.forEach(heart => heart.remove());
}

function getSpawnPointsPx() {
    const cx = 295, cy = 305, hs = 10.5;
    // 12 puntos repartidos a lo ancho del arco inferior completo (0.55π → 1.45π)
    const tStart = Math.PI * 0.55;
    const tEnd   = Math.PI * 1.45;
    const tValues = Array.from({ length: 12 }, (_, i) =>
        tStart + (tEnd - tStart) * (i / 11)
    );

    const svg    = document.getElementById('treeContainer');
    const wrapper = document.getElementById('content'); // Changed from tree-and-timer
    const svgR   = svg.getBoundingClientRect();
    const wrapR  = wrapper.getBoundingClientRect();
    const scaleX = svgR.width  / 600;
    const scaleY = svgR.height / 600;
    const offsetX = svgR.left - wrapR.left;
    const offsetY = svgR.top  - wrapR.top;

    return tValues.map(t => {
        const vx = cx + hs * 16 * Math.pow(Math.sin(t), 3);
        const vy = cy - hs * (13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t));
        return { left: offsetX + vx * scaleX, top: offsetY + vy * scaleY };
    });
}

function startFallingHearts() {
    fallingHeartsActive = true;
    const wrapper = document.getElementById('content'); // Changed from tree-and-timer
    if (!wrapper) return;
    const points  = getSpawnPointsPx();

    // Lanzar cada corazón de forma continua e independiente:
    // cuando uno termina, inmediatamente lanza el siguiente desde ese mismo punto.
    points.forEach((pt, i) => {
        // Stagger inicial para que no arranquen todos a la vez
        setTimeout(() => launchLoop(wrapper, pt), i * 300);
    });
}

function launchLoop(wrapper, pt) {
    if (!fallingHeartsActive) return; // Check the flag

    // Lanza un corazón y cuando termina lanza el siguiente
    const dur = 2.2 + Math.random() * 1.6; // segundos
    spawnHeart(wrapper, pt.left, pt.top, dur);
    // Repite cuando este corazón llega al final
    setTimeout(() => launchLoop(wrapper, pt), dur * 1000 + Math.random() * 400);
}

function spawnHeart(wrapper, leftPx, topPx, durSec) {
    const el = document.createElement('span');
    el.className   = 'falling-heart';
    el.textContent = '♥';
    el.style.color    = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.fontSize = (16 + Math.floor(Math.random() * 8)) + 'px';
    el.style.left = leftPx + 'px';
    el.style.top  = topPx  + 'px';

    // Calculamos cuánto tiene que caer para llegar justo al top del timer
    const timerEl  = document.getElementById('timer');
    if (!timerEl) { // Failsafe if timer is not there
        el.remove();
        return;
    }
    const timerTop = timerEl.getBoundingClientRect().top;
    const wrapTop  = wrapper.getBoundingClientRect().top;
    // Distancia desde el punto de spawn hasta el top del timer (en px del wrapper)
    const fallDist = (timerTop - wrapTop) - topPx;

    el.style.setProperty('--fall', fallDist + 'px');
    el.style.setProperty('--dur',  durSec + 's');

    const sw = () => ((Math.random() * 18 - 9).toFixed(1)) + 'px';
    el.style.setProperty('--sw1', sw());
    el.style.setProperty('--sw2', sw());
    el.style.setProperty('--sw3', sw());
    el.style.setProperty('--sw4', sw());
    el.style.setProperty('--sw5', sw());

    wrapper.appendChild(el);
    setTimeout(() => el.remove(), durSec * 1000 + 200);
}