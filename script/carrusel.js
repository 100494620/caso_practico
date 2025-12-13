// script/carousel.js
(function () {
    if (window.__ksfCarouselInit) return;
    window.__ksfCarouselInit = true;

    $(function () {
        const $container = $(".second_container").first();
        if (!$container.length) return;

        // En vez de meter texto literal, usamos SOLO claves i18n
        const packs = [
            {
                id: "sea-01",
                titleKey: "home.packSoutheastAsia",
                priceKey: "home.price",                // o uno distinto si cada pack tiene precio diferente en el json
                descKey:  "home.packDescription",      // idem
                img:      "images/pack.jpg"
            },
            {
                id: "jpn-02",
                titleKey: "home.japanPackTitle",
                priceKey: "home.japanPackPrice",
                descKey:  "home.japanPackDesc",
                img:      "images/japan.jpg"
            },
            {
                id: "vnm-03",
                titleKey: "home.vietnamPackTitle",
                priceKey: "home.vietnamPackPrice",
                descKey:  "home.vietnamPackDesc",
                img:      "images/japan_carta.jpg"
            },
            {
                id: "de-04",
                titleKey: "home.germanyPackTitle",
                priceKey: "home.germanyPackPrice",
                descKey:  "home.germanyPackDesc",
                img:      "images/germany.jpg"
            }
        ];

        const $card  = $container.find(".venta-container");
        const $title = $container.find('[data-pack="title"], #packTitle');
        const $price = $container.find('[data-pack="price"], #packPrice');
        const $desc  = $container.find('[data-pack="desc"],  #packDesc');
        const $buy   = $container.find('[data-pack="buy"],   .button-comprar');

        const $btnNext = $container.find(".next-button");
        const $btnPrev = $container.find(".back-button");

        let idx = 0;
        let animating = false;

        // Oculta posible <img> interna
        $card.find("img").css("display", "none");

        function setBackground(url) {
            $card.css("background-image", `url("${url}")`);
        }

        function render() {
            const p = packs[idx];
            setBackground(p.img);

            // aquí NO ponemos texto; solo cambiamos la clave data-i18n
            $title.attr("data-i18n", p.titleKey);
            $price.attr("data-i18n", p.priceKey);
            $desc.attr("data-i18n",  p.descKey);

            // vuelve a aplicar traducciones con el idioma actual
            applyTranslations();

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

        let autoplayTimer = null;

        function scheduleNext(delayMs) {
            clearTimeout(autoplayTimer);
            autoplayTimer = setTimeout(function tick() {
                next();
                autoplayTimer = setTimeout(tick, 2000);
            }, delayMs);
        }

        render();
        scheduleNext(2000);

        $btnNext.off("click").on("click", (e) => {
            e.preventDefault();
            next();
            scheduleNext(5000);
        });

        $btnPrev.off("click").on("click", (e) => {
            e.preventDefault();
            prev();
            scheduleNext(5000);
        });
    });
})();
