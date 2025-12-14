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

        all.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        $container.empty();

        if (all.length === 0) {
            $container.append($("<p>").text("Todavía no hay consejos publicados."));
            return;
        }

        all.forEach(item => {
            const author = item.authorName || "Anónimo";

            const $card = $("<div>")
                .addClass("advice-card")
                .attr("id", item.id);

            const $title = $("<h5>").text(item.title || "(Sin título)");
            const $author = $("<div>").addClass("advice-author").text(`Por ${author}`);
            const $desc = $("<p>").addClass("advice-desc").text(item.desc || "(Sin descripción)");

            $card.append($title, $author, $desc);
            $container.append($card);
        });
    }

    renderAll();

    const hashId = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hashId) {
        setTimeout(() => {
            const el = document.getElementById(hashId);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    }
});
