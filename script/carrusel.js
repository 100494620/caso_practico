// script/carousel.js
(function () {
    // Evita doble inicialización si el script se carga dos veces
    if (window.__ksfCarouselInit) return;
    window.__ksfCarouselInit = true;

    $(function () {
        const $container = $(".second_container").first();
        if (!$container.length) return;

        // --- Datos de packs (usa imágenes reales de /images) ---
        const packs = [
            {
                id: "sea-01",
                title: "Pack Sudeste Asiático",
                price: 600,
                desc:  "Vietnam y Camboya: buses, hostales y guía de visados",
                img:   "images/pack.jpg"
            },
            {
                id: "jpn-02",
                title: "Japón Express 10 días",
                price: 980,
                desc:  "Tokio, Kioto y Osaka: JR Pass, templos y ramen tour",
                img:   "images/japan.jpg"
            },
            {
                id: "vnm-03",
                title: "Vietnam Norte-Sur",
                price: 740,
                desc:  "Ha Noi, Ha Long y Saigón: buses nocturnos y hostales",
                img:   "images/japan_carta.jpg"
            },
            {
                id: "de-04",
                title: "Alemania: castillos históricos",
                price: 520,
                desc:  "Descubre los castillos de Wierchem, Bamberg y Núremberg",
                img:   "images/germany.jpg"
            }
        ];

        // --- Selectores (la imagen se pone como background del card) ---
        const $card  = $container.find(".venta-container");
        const $title = $container.find('[data-pack="title"], #packTitle');
        const $price = $container.find('[data-pack="price"], #packPrice');
        const $desc  = $container.find('[data-pack="desc"],  #packDesc');
        const $buy   = $container.find('[data-pack="buy"],   #buyBtn');

        const $btnNext = $container.find(".next-button");
        const $btnPrev = $container.find(".back-button");

        let idx = 0;
        let animating = false;

        // por si quedó algún <img> dentro del card, que no “empuje” el layout
        $card.find("img").css("display", "none");

        function setBackground(url) {
            $card.css("background-image", `url("${url}")`);
        }

        function render() {
            const p = packs[idx];
            setBackground(p.img);
            $title.text(p.title);
            $price.text(`€${p.price}`);
            $desc.text(p.desc);
            $buy.off("click").on("click", () => {
                window.location.href = `versionC.html?pack=${encodeURIComponent(p.id)}`;
            });
        }

        function animateRender() {
            if (animating) return;
            animating = true;
            $card.stop(true, true).fadeTo(140, 0, function () {
                render();
                $(this).fadeTo(140, 1, () => { animating = false; });
            });
        }

        function next() {
            idx = (idx + 1) % packs.length;
            animateRender();
        }

        function prev() {
            idx = (idx - 1 + packs.length) % packs.length;
            animateRender();
        }

        // ---------- Auto-play controlado ----------
        let autoplayTimer = null;

        // Programa el siguiente avance después de 'delayMs'
        function scheduleNext(delayMs) {
            clearTimeout(autoplayTimer);
            autoplayTimer = setTimeout(function tick() {
                next();
                // después del avance automático, seguimos al ritmo de 2 s
                autoplayTimer = setTimeout(tick, 2000);
            }, delayMs);
        }

        // Al iniciar: primer render y auto-play cada 2 s
        render();
        scheduleNext(2000);

        // Si el usuario pulsa una flecha: avanzar/retroceder una vez
        // y pausar el auto-play 5 s; luego volver al ritmo de 2 s
        $btnNext.off("click").on("click", (e) => {
            e.preventDefault();
            next();
            scheduleNext(5000); // pausa 5s y reanuda auto a 2s
        });

        $btnPrev.off("click").on("click", (e) => {
            e.preventDefault();
            prev();
            scheduleNext(5000); // pausa 5s y reanuda auto a 2s
        });
    });
})();
