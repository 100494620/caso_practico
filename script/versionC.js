// script/versionC.js
$(function () {
    // --- CONTROL DE ACCESO: solo usuarios logeados ---

    const user = getMyInfo();
    const isLoggedIn = user && user.loginStatus === true;
    if (!isLoggedIn) {
      alert("Debe iniciar sesión para acceder a la compra.");
      window.location.replace("home.html");
      return;
    }


    const PACKS = [
        {
            id: "sea-01",
            title: "Pack Sudeste Asiático",
            price: 600,
            desc: "Descubre lo mejor de Vietnam y Camboya en una ruta de 14 días. Recorre templos milenarios, crucéate por la bahía de Ha Long y explora los mercados flotantes del delta del Mekong. Incluye transporte entre ciudades, alojamiento en hostales seleccionados y asistencia local 24/7",
            img:  "images/pack.jpg"
        },
        {
            id: "jpn-02",
            title: "Japón Express 10 días",
            price: 980,
            desc: "Vive una experiencia inolvidable en Japón. Desde los rascacielos de Tokio hasta los templos de Kioto, pasando por el encanto tradicional de Osaka. JR Pass incluido, visitas guiadas, y degustaciones de ramen, sushi y matcha para conocer la auténtica cultura nipona.",
            img:  "images/japan.jpg"
        },
        {
            id: "vnm-03",
            title: "Vietnam Norte-Sur",
            price: 740,
            desc: "Un viaje de contrastes por Vietnam, desde el bullicio de Hanói hasta la energía moderna de Saigón. Navega por la bahía de Ha Long, disfruta de la gastronomía local en Hoi An y viaja en tren nocturno entre paisajes inolvidables. Incluye transporte, alojamiento y guía local",
            img:  "images/japan_carta.jpg"
        },
        {
            id: "de-04",
            title: "Alemania: castillos históricos",
            price: 520,
            desc: "DEmbárcate en un recorrido por los castillos más impresionantes de Alemania: Neuschwanstein, Hohenzollern y Wartburg. Un viaje por bosques, pueblos medievales y la Ruta Romántica bávara. Incluye transporte entre ciudades, entradas y alojamiento con encanto",
            img:  "images/germany.jpg"
        }
    ];

    // --- Util: leer ?pack=... ---
    function getSelectedPackId() {
        const params = new URLSearchParams(window.location.search);
        return params.get("pack");
    }

    (function paintSelectedPack() {
        const packId = getSelectedPackId();
        const pack = PACKS.find(p => p.id === packId);
        if (!pack) return;

        $(".venta-container-left .venta-container-text").text(pack.title);
        $(".venta-container-right .venta-container-text").text(`€${pack.price}`);
        $(".bottom-left .contenido-text").text(pack.desc);
    })();


    // --- SELECTORES ---
    const $form = $("#buy");
    const $fullName = $("#FullName");
    const $email = $("#emailLogin");
    const $cardType = $("#cardType");
    const $cardNumber = $("#card-number");
    const $ownerName = $("#owner-name");
    const $expiry = $("#fechaCaducidad");
    const $cvv = $("#codigoCVV");

    // --- REGEX / HELPERS ---
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const CARD_NUMBER_REGEX = /^(?:\d{13}|\d{15}|\d{16}|\d{19})$/;
    const CVV_REGEX = /^\d{3}$/;

    function endOfMonth(y, m /*1..12*/) {
        return new Date(y, m, 0, 23, 59, 59, 999);
    }

    function parseExpiry(raw) {
        if (!raw) return null;
        const s = String(raw).trim();

        // YYYY-MM (input type="month")
        const m1 = s.match(/^(\d{4})-(\d{2})$/);
        if (m1) {
            const y = +m1[1], m = +m1[2];
            if (m < 1 || m > 12) return null;
            return endOfMonth(y, m);
        }

        // MM / AA o MM/AA
        const m2 = s.match(/^(\d{2})\s*\/\s*(\d{2})$/);
        if (m2) {
            const m = +m2[1], yy = +m2[2];
            if (m < 1 || m > 12) return null;
            const y = 2000 + yy;
            return endOfMonth(y, m);
        }

        // YYYY-MM-DD (por si alguien lo manda así)
        const d = new Date(s);
        if (!Number.isNaN(d.getTime())) {
            const y = d.getFullYear(), m = d.getMonth() + 1;
            return endOfMonth(y, m);
        }

        return null;
    }

    function isFutureExpiry(raw) {
        const eom = parseExpiry(raw);
        return !!eom && eom.getTime() > Date.now();
    }

    if ($expiry.attr("type") === "text") {
        $expiry.on("input", function () {
            let v = this.value.replace(/[^\d]/g, "");
            if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2, 4);
            this.value = v.slice(0, 7); // "MM / AA"
        });
    }

    function cleanNumber(str) {
        return (str || "").replace(/\s+/g, "");
    }

    function validateForm() {
        const fullName = $fullName.val().trim();
        const email = $email.val().trim();
        const type = $cardType.val();
        const number = cleanNumber($cardNumber.val());
        const owner = $ownerName.val().trim();
        const expiry = $expiry.val().trim();
        const cvv = $cvv.val().trim();

        if (fullName.length < 3) { alert("Nombre completo: mínimo 3 caracteres."); return false; }
        if (!EMAIL_REGEX.test(email)) { alert("Correo electrónico no válido."); return false; }
        if (!type) { alert("Seleccione el tipo de tarjeta."); return false; }
        if (!CARD_NUMBER_REGEX.test(number)) { alert("Número de tarjeta no válido (13, 15, 16 o 19 dígitos)."); return false; }
        if (owner.length < 3) { alert("Nombre del titular: mínimo 3 caracteres."); return false; }
        if (!isFutureExpiry(expiry)) { alert("La fecha de caducidad debe ser futura."); return false; }
        if (!CVV_REGEX.test(cvv)) { alert("CVV debe contener exactamente 3 dígitos."); return false; }

        return { fullName, email, type, numberLast4: number.slice(-4), owner, expiry };
    }

    $form.on("submit", function (e) {
        e.preventDefault();
        const data = validateForm();
        if (!data) return;

        alert("Compra realizada");

        // Espera 1 segundo tras la alerta antes de redirigir
        setTimeout(() => {
            window.location.href = "versionB.html";
        }, 500);

        this.reset();
    });
    $(function() {

    // 1. ACOMPAÑANTES DINÁMICOS
    // Detectamos cambios en el número de entradas
    $('#numTickets').on('input change', function() {
        const totalPersonas = parseInt($(this).val()) || 1;
        const $container = $('#companionsContainer');
        
        // Limpiamos los campos anteriores para regenerarlos
        $container.empty();

        // Si hay más de 1 persona, creamos los campos extra
        // (Empezamos en 2 porque la persona 1 es el titular del formulario)
        if (totalPersonas > 1) {
            for (let i = 2; i <= totalPersonas; i++) {
                const html = `
                    <div class="companion-card">
                        <span class="companion-title">Viajero #${i}</span>
                        
                        <input type="text" name="name_companion_${i}" 
                               placeholder="Nombre completo" required 
                               style="margin-bottom: 0.5vw;">
                               
                        <input type="email" name="email_companion_${i}" 
                               placeholder="Email" required 
                               style="margin-bottom: 0;">
                    </div>
                `;
                $container.append(html);
            }
        }
    });

    // 2. MASCOTA (MOSTRAR / OCULTAR)
    $('#hasPet').on('change', function() {
        if ($(this).is(':checked')) {
            $('#petDetails').slideDown(); // Animación de despliegue
        } else {
            $('#petDetails').slideUp();   // Animación de ocultar
        }
    });

    // 3. ENVÍO DEL FORMULARIO
    $('#purchaseForm').on('submit', function(e) {
        e.preventDefault(); // Evita que se recargue la página

        // Recogida básica de datos para feedback
        const nombre = $('#FullName').val();
        const personas = $('#numTickets').val();
        const mascota = $('#hasPet').is(':checked') ? "con mascota" : "sin mascota";

        // Aquí iría la lógica real de pago o guardado en BD
        alert(`¡Reserva confirmada!\n\nTitular: ${nombre}\nPlazas: ${personas}\nDetalle: ${mascota}\n\nGracias por confiar en Kilómetros Sin Fin.`);
        
        // Redirección opcional
        // window.location.href = "index.html";
    });
});


});
