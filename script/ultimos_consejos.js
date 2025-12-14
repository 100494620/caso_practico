$(function () {
    const ADVICES_LS_KEY = "advices";

    function loadAdvices() {
        try {
            const raw = localStorage.getItem(ADVICES_LS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    function renderAll() {
        const $container = $("#allAdvices");
        const all = loadAdvices();

        // Más recientes primero
        all.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        $container.empty();

        if (all.length === 0) {
            $container.append($("<p>").text("Todavía no hay consejos publicados."));
            return;
        }

        all.forEach(item => {
            const authorName = item.authorName || "Anónimo";

            const $card = $("<div>")
                .addClass("text-block")
                .attr("id", item.id)
                .css({ marginBottom: "12px" });

            const $title = $("<h5>").text(item.title || "(Sin título)");

            const $meta = $("<div>")
                .css({ fontSize: "0.9rem", opacity: 0.85, margin: "0 4vw 1vw 4vw" })
                .text(`Por ${authorName}`);

            const $desc = $("<p>")
                .css({ margin: "0 4vw 3vw 4vw" })
                .text(item.desc || "(Sin descripción)");

            $card.append($title, $meta, $desc);
            $container.append($card);
        });
    }

    renderAll();

    // Si vienes desde versionB con #id, hacemos scroll al consejo seleccionado
    const hashId = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hashId) {
        setTimeout(() => {
            const el = document.getElementById(hashId);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    }
});
