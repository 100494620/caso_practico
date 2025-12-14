// script/versionB.js
$(function () {
    const ADVICES_LS_KEY = "advices"; // lista común para todos los usuarios

    const escapeHtml = (s = "") =>
        s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

    // Genera un id simple (suficiente para esta práctica)
    const newId = () => "adv_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);

    // Carga/guarda en localStorage
    function loadAdvices() {
        try {
            const raw = localStorage.getItem(ADVICES_LS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }
    function saveAdvices(list) {
        localStorage.setItem(ADVICES_LS_KEY, JSON.stringify(list));
    }

    // Renderiza los 3 últimos en #adviceList
    function renderLastThree() {
        const $list = $("#adviceList");
        const all = loadAdvices();

        // Orden por fecha desc (más recientes primero)
        all.sort((a, b) => b.createdAt - a.createdAt);

        const last3 = all.slice(0, 3);

        $list.empty();
        last3.forEach(item => {
            const href = `ultimos_consejos.html#${encodeURIComponent(item.id)}`;
            const $a = $("<a>").attr("href", href).text(item.title);
            $list.append($a).append("<br>");
        });
    }

    // Valida y añade un consejo
    function onSendAdvice() {
        const title = $("#adviceTitle").val().trim();
        const desc  = $("#adviceDesc").val().trim();

        if (title.length < 15) {
            alert("El título debe tener al menos 15 caracteres.");
            return;
        }
        if (desc.length < 30) {
            alert("La descripción debe tener al menos 30 caracteres.");
            return;
        }

        const advices = loadAdvices();
        const me = (typeof getMyInfo === "function") ? getMyInfo() : null;
        const authorName = me?.login_name ? me.login_name : "Anónimo";

        // Añadir al comienzo (más reciente primero)
        const advice = {
            id: newId(),
            title: escapeHtml(title),
            desc: desc,
            createdAt: Date.now(),
            authorName: authorName
        };
        advices.unshift(advice);

        saveAdvices(advices);
        renderLastThree();

        // Reset de campos
        $("#adviceTitle").val("");
        $("#adviceDesc").val("");
    }

    // Eventos
    $("#adviceSend").on("click", onSendAdvice);

    // Pintado inicial al cargar la página
    renderLastThree();
});

// getting pic from the local storage and setting it as an icon
$(function () {
    const username = localStorage.getItem(EMAIL_LS_DATA);

    if (!username) return;

    const registeredUsers = getRegisteredUsers();
    const user = registeredUsers.get(username);
    // change login name from Usuario to actual one
    $("#perfil-usuario").text(user.login_name || "Usuario")
    // set profile pic
    if (user && user.image) {
        $("#profileAvatar").attr("src", user.image);
    } else {
        console.log("No image found for user:", username);
    }
});

$(function () {
    const CONFIG = {
        tipo: 'PACK',       
        duracion: 15,       
        diaSalida: 5        
    };

    let currentDate = new Date();
    let selectedDate = null;

    renderCalendar(currentDate);

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        const monthNames = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
        $('#currentMonthLabel').text(`${monthNames[month]} ${year}`);

        const $grid = $('#dynamic-calendar');
        $grid.empty(); 

        const dows = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
        dows.forEach(d => $grid.append(`<div class="dow">${d}</div>`));

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            $grid.append('<div class="day muted"></div>');
        }

        const today = new Date();
        today.setHours(0,0,0,0);

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const thisDate = new Date(year, month, i);
            const dayOfWeek = thisDate.getDay();
            let $dayEl = $(`<div class="day">${i}</div>`);

            let esDiaValido = false;

            if (thisDate >= today) {
                if (CONFIG.tipo === 'PACK') {
                    esDiaValido = (dayOfWeek === CONFIG.diaSalida);
                } else {
                    esDiaValido = true;
                }
            }

            if (esDiaValido) {
                $dayEl.addClass('clickable');
                $dayEl.data('fullDate', thisDate);
                $dayEl.hover(onHoverEnter, onHoverLeave);
                $dayEl.click(onDayClick);
                
                if (selectedDate && thisDate.getTime() === selectedDate.getTime()) {
                    $dayEl.addClass('selected-start');
                }
            } else {
                if (thisDate >= today && CONFIG.tipo === 'PACK') {
                    $dayEl.addClass('restricted-day'); 
                    $dayEl.click(function() {
                        const $msg = $('#feedback-message');
                        $msg.css('color', '#d32f2f').text('⚠️ Salidas programadas solo los VIERNES.');
                        $msg.fadeOut(100).fadeIn(100);
                    });
                } else {
                    $dayEl.addClass('muted disabled');
                }
            }
            $grid.append($dayEl);
        }
    }

    function onHoverEnter() {
        const $this = $(this);
        const index = $this.index();
        const $allCells = $('#dynamic-calendar > div');

        for (let i = 0; i < CONFIG.duracion; i++) {
            let $target = $allCells.eq(index + i);
            if ($target.hasClass('day') && !$target.hasClass('muted')) {
                $target.addClass('range-preview');
            }
        }
        $('#feedback-message').css('color', '#555').text(`Salida: ${$this.text()} - Duración: ${CONFIG.duracion} días`);
    }

    function onHoverLeave() {
        $('.day').removeClass('range-preview');
        if (!selectedDate) {
            $('#feedback-message').text('Selecciona un viernes de salida');
        } else {
             $('#feedback-message').css('color', 'green').text(`Seleccionado: ${selectedDate.toLocaleDateString()}`);
        }
    }

    function onDayClick() {
        $('.day').removeClass('selected-start selected-range');
        const $this = $(this);
        const index = $this.index();
        const $allCells = $('#dynamic-calendar > div');

        $this.addClass('selected-start');
        for (let i = 1; i < CONFIG.duracion; i++) {
            let $target = $allCells.eq(index + i);
            if ($target.hasClass('day')) $target.addClass('selected-range');
        }

        selectedDate = $this.data('fullDate');
        $('#feedback-message').css('color', 'green').text(`¡Reserva confirmada para el ${selectedDate.toLocaleDateString()}!`);
        $('#buyBtn').text('Finalizar Compra (' + selectedDate.toLocaleDateString() + ')');
    }

    $('#prevMonth').click(() => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(currentDate); });
    $('#nextMonth').click(() => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(currentDate); });
    
    $('#buyBtn').on('click', function(e) {
        if (!selectedDate) {
            e.preventDefault();
            alert("⚠️ Por favor, selecciona una fecha de salida en el calendario.");
            $('html, body').animate({
                scrollTop: $(".cal").offset().top - 150
            }, 500);
        } else {
            alert("Redirigiendo a pasarela de pago para el: " + selectedDate.toLocaleDateString());
        }
    });
});
