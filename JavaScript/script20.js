if (typeof window.supabaseClient === 'undefined') {
    const SUPABASE_URL = "https://saxmkvxziaxfxkaoqfay.supabase.co";
    const SUPABASE_KEY = "sb_publishable_QUyh9Zj0HOd3gTDEvI5PZQ_B213ZKRH";
    
    // Global oynaga bir marta yozib qo'yamiz
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Endi kodning qolgan qismida 'supabase' o'rniga 'window.supabaseClient' ishlatamiz
const db = window.supabaseClient;
document.querySelector('.scroll-hint').addEventListener('click', function() {
  const target = document.getElementById('section11');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
});
// script20.js ning eng tepasi

const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

const video = document.getElementById('heroVideo');
const canvas = document.getElementById('bokehCanvas');
function spawnOrbs() {
    const colors = ['rgba(220,220,220,VAR)','rgba(240,240,240,VAR)','rgba(200,200,200,VAR)','rgba(255,255,255,VAR)','rgba(230,230,230,VAR)'];
    for (let i = 0; i < 18; i++) {
        const orb = document.createElement('div'); orb.className = 'bokeh-orb';
        const size = 60 + Math.random() * 180, op = (.15 + Math.random() * .25).toFixed(2);
        const color = colors[Math.floor(Math.random() * colors.length)].replace('VAR', op);
        orb.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${10+Math.random()*80}%;background:${color};--dur:${7+Math.random()*8}s;--delay:${-Math.random()*10}s;--op:${op};`;
        canvas.appendChild(orb);
    }
}
spawnOrbs();
video.addEventListener('error', () => { canvas.style.opacity = '1'; });
video.addEventListener('playing', () => { canvas.style.opacity = '0'; canvas.style.transition = 'opacity 1s'; });

const unlockScreen = document.getElementById('unlock-screen');
const unlockBtn = document.getElementById('unlockBtn');
const musicToggleUnlock = document.getElementById('musicToggleUnlock');
const langBtns = document.querySelectorAll('.lang-btn');


// ========== МУЗЫКАЛЬНЫЙ ПЛЕЕР ==========
(function() {
    // Создаём аудио элемент
    const bgMusic = new Audio("Other/music123.mp3"); // Убедитесь, что файл music.mp3 существует в той же папке
    bgMusic.loop = true; // Зацикливаем музыку
    bgMusic.volume = 0.5; // Громкость 50% (можно изменить)
    
    let isMusicPlaying = false; // Флаг состояния музыки
    
    // Кнопка музыки на unlock-экране
    const musicToggleUnlock = document.getElementById('musicToggleUnlock');
    
    // Может быть ещё одна кнопка на основном экране (если есть)
    const musicToggleMain = document.getElementById('musicToggleMain'); // Если есть такая кнопка на основном экране
    
    // Функция для обновления иконки кнопки
    function updateMusicIcon(button, isPlaying) {
        if (!button) return;
        
        // Сохраняем текущий SVG
        const svg = button.querySelector('svg');
        if (!svg) return;
        
        if (isPlaying) {
            // Иконка "Включено" (динамик со звуком)
            svg.innerHTML = `
                <path d="M3 10v4h4l5 5V5l-5 5H3z"/>
                <path d="M18 8c1.5 1.5 2 3.5 2 6s-0.5 4.5-2 6"/>
                <path d="M21 5c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9"/>
            `;
        } else {
            // Иконка "Выключено" (динамик с крестиком)
            svg.innerHTML = `
                <path d="M3 10v4h4l5 5V5l-5 5H3z"/>
                <line x1="18" y1="8" x2="22" y2="12"/>
                <line x1="22" y1="8" x2="18" y2="12"/>
            `;
        }
    }
    
    // Функция для включения музыки
    function playMusic() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicIcon(musicToggleUnlock, true);
            if (musicToggleMain) updateMusicIcon(musicToggleMain, true);
        }).catch(error => {
            console.log('Автовоспроизведение заблокировано браузером. Нужно взаимодействие пользователя:', error);
        });
    }
    
    // Функция для выключения музыки
    function pauseMusic() {
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicIcon(musicToggleUnlock, false);
        if (musicToggleMain) updateMusicIcon(musicToggleMain, false);
    }
    
    // Переключение музыки
    function toggleMusic() {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }
    
    // Вешаем обработчик на кнопку разблокировки
    if (musicToggleUnlock) {
        musicToggleUnlock.addEventListener('click', (e) => {
            e.stopPropagation(); // Чтобы не триггерить другие события
            toggleMusic();
        });
    }
    
    // Если есть кнопка на основном экране
    if (musicToggleMain) {
        musicToggleMain.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }
    
    // Пробуем включить музыку при разблокировке (после клика пользователя)
    const unlockBtnForMusic = document.getElementById('unlockBtn');
    if (unlockBtnForMusic) {
        unlockBtnForMusic.addEventListener('click', () => {
            // Небольшая задержка, чтобы звук разблокировки не конфликтовал
            setTimeout(() => {
                if (!isMusicPlaying) {
                    playMusic();
                }
            }, 500);
        });
    }
    
    // Также пробуем включить при первом любом взаимодействии (на случай, если unlockBtn не сработал)
    const anyInteraction = () => {
        if (!isMusicPlaying) {
            playMusic();
        }
        // Удаляем обработчики после первого взаимодействия
        document.removeEventListener('click', anyInteraction);
        document.removeEventListener('touchstart', anyInteraction);
    };
    
    document.addEventListener('click', anyInteraction);
    document.addEventListener('touchstart', anyInteraction);
})();



unlockBtn.addEventListener('click', () => {
    unlockBtn.style.transform = "scale(0.92)";
    setTimeout(() => { unlockBtn.style.transform = ""; }, 120);
    unlockScreen.classList.add('opening');
    unlockScreen.querySelector('.unlock-center').classList.add('unlock-opening');
    
    
    setTimeout(() => {
        unlockScreen.classList.add('hidden');
        document.body.classList.remove('overflowH');
        document.body.classList.add('loaded');
        loadGuestsFromDB();
    }, 1200);
});

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С БАЗОЙ ДАННЫХ ==========

async function loadGuestsFromDB() {
    try {
        // Supabase orqali bazani o'qish
        // 'data' - bu bazadan kelgan javob, biz uni 'guests' deb nomlab olamiz
        const { data: guests, error } = await db.from('shamshodbek').select('*');

        if (error) throw error;

        // Endi 'guests' o'zgaruvchisi aniq (defined) bo'ladi
        if (guests && guests.length > 0) {
            renderGuestsTable(guests);
            updateStatsFromGuestsData(guests);
        } else {
            // Agar bazada ma'lumot bo'lmasa
            const tbody = document.getElementById('guestsTableBody');
            if (tbody) tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Mehmonlar hali yo\'q</td></tr>';
        }
    } catch (error) {
        console.error('Supabase xatosi:', error.message);
        const tbody = document.getElementById('guestsTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Ma\'lumotlarni yuklashda xatolik</td></tr>';
            resetStatsToZero();
        }
    }
}
function renderGuestsTable(guests) {
    const tbody = document.getElementById('guestsTableBody');
    if (!tbody) return;
    
    if (!guests || guests.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Hech qanday mehmon topilmadi</td></tr>';
        return;
    }
    
    let html = '';
    
    // Добавляем index (0, 1, 2...) в параметры цикла
    guests.forEach((guest, index) => {
        let statusClass = '';
        let statusText = '';
        
        switch(guest.status) {
            case 'confirmed':
                statusText = 'Tasdiqlangan';
                statusClass = 'status-confirmed';
                break;
            case 'declined':
                statusText = 'Kela olmaydi';
                statusClass = 'status-declined';
                break;
            default:
                statusText = 'Kutilmoqda';
                statusClass = 'status-pending';
        }
        
        const statusBadge = `<span class="status-badge ${statusClass}">${statusText}</span>`;
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(guest.name)}</strong></td>
                <td>${guest.guest_count}</td>
                <td>${statusBadge}</td>
                <td>${escapeHtml(guest.comment || '—')}</td>
                <td class="time-cell">${guest.time || '—'}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function updateStatsFromGuestsData(guests) {
    let total = 0;
    let confirmed = 0;
    let declined = 0;
    
    guests.forEach(guest => {
        const count = parseInt(guest.guest_count) || 0;
        total += count;
        
        if (guest.status === 'confirmed') {
            confirmed += count;
        } else if (guest.status === 'declined') {
            declined += count;
        }
    });
    
    const totalEl = document.getElementById('totalGuests');
    const confirmedEl = document.getElementById('confirmedCount');
    const declinedEl = document.getElementById('declinedCount');
    
    if (totalEl) totalEl.textContent = total;
    if (confirmedEl) confirmedEl.textContent = confirmed;
    if (declinedEl) declinedEl.textContent = declined;
}

function resetStatsToZero() {
    const totalEl = document.getElementById('totalGuests');
    const confirmedEl = document.getElementById('confirmedCount');
    const declinedEl = document.getElementById('declinedCount');
    
    if (totalEl) totalEl.textContent = '0';
    if (confirmedEl) confirmedEl.textContent = '0';
    if (declinedEl) declinedEl.textContent = '0';
}

function escapeHtml(str) {
    if (!str) return "—";
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ========== GUEST SELECTOR ==========
(function() {
    const guestCountSpan = document.querySelector('.guest-count');
    const minusBtn = document.querySelector('.guest-minus');
    const plusBtn = document.querySelector('.guest-plus');
    let count = 1;
    const max = 5;
    const min = 1;

    if (minusBtn && plusBtn && guestCountSpan) {
        minusBtn.addEventListener('click', () => {
            if (count > min) {
                count--;
                guestCountSpan.textContent = count;
            }
        });

        plusBtn.addEventListener('click', () => {
            if (count < max) {
                count++;
                guestCountSpan.textContent = count;
            }
        });
    }
})();

// ========== TIMER ==========
function updateLuxuryTimer() {
    const targetDate = new Date(2026, 6, 19, 19, 0, 0);
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        document.getElementById('days').innerHTML = '0';
        document.getElementById('hours').innerHTML = '00';
        document.getElementById('minutes').innerHTML = '00';
        document.getElementById('seconds').innerHTML = '00';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (3600000));
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    document.getElementById('days').innerHTML = days;
    document.getElementById('hours').innerHTML = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerHTML = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;
}

updateLuxuryTimer();
setInterval(updateLuxuryTimer, 1000);

// ========== SHARE FUNCTIONALITY ==========
(function() {
    const currentUrl = window.location.href;
    
    const telegramBtn = document.getElementById('telegramShare');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const telegramUrl = `https://t.me/onlinetaklifnomachi`;
            window.open(telegramUrl, '_blank', 'noopener,noreferrer');
        });
    }
    
    const copyBtn = document.getElementById('copyLinkBtn');
    const copyNote = document.getElementById('copyNote');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(currentUrl);
                copyNote.classList.add('show');
                setTimeout(() => {
                    copyNote.classList.remove('show');
                }, 2500);
            } catch (err) {
                console.error('Nusxa olishda xatolik:', err);
                const textarea = document.createElement('textarea');
                textarea.value = currentUrl;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                copyNote.classList.add('show');
                setTimeout(() => {
                    copyNote.classList.remove('show');
                }, 2500);
            }
        });
    }
})();

// ========== LANGUAGE TRANSLATIONS ==========
langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.getAttribute('data-lang');
        
        const translations = {
            ru: { 
                title: 'ВЫ ПОЛУЧИЛИ ПРИГЛАШЕНИЕ', 
                instruction: 'Нажмите на замок,', 
                instruction1: 'чтобы открыть приглашение',
                heros1: 'Приглашение на свадьбу',
                heros2: '19 июля 2026 | 17:00',
                herodate: 'Ваше присутствие — самый дорогой подарок для нас',
                timerlabel: 'ВРЕМЯ ДО СВАДЬБЫ',
                unit11: 'дней',
                unit22: 'часов',
                unit33: 'минут',
                unit44: 'секунд',
                scroll11: 'листайте вниз',
                tag11: 'Дорогие гости!',
                quote11: 'Мы хотим отпраздновать этот дорогой для нас день вместе с вами. Будем искренне рады, если вы разделите с нами нашу радость.',
                cal11: 'СЧИТАННЫЕ ДНИ',
                cal22: 'Свадебный календарь',
                cal33: 'ИЮЛЬ 2026',
                cale1: 'Пн',
                cale2: 'Вт',
                cale3: 'Ср',
                cale4: 'Чт',
                cale5: 'Пт',
                cale6: 'Сб',
                cale7: 'Вс',
                notetext1: 'сердце — день свадьбы',
                detcd1: 'Кратко о нашей свадьбе',
                detcd2: 'Детали мероприятия',
                detcd3: 'Место проведения',
                detcd4: 'Ресторан «Сайора», г. Бухара, район Гиждуван',
                detcd5: 'Открыть на карте →',
                detcd6: 'Время',
                detcd7: '19 июля 2026 года, 19:00',
                detcd8: 'Двери открыты с 18:30',
                detcd9: 'Дресс-код',
                detcd10: 'Официальный, предпочтительны светлые тона',
                detcd11: 'Формат',
                detcd12: 'Халяль. Торжественное мероприятие проводится без алкогольных напитков',
                detcd13: 'Символ уважения и чистоты',
                detcd14: 'Ваша улыбка — наше главное украшение. Заранее благодарим за вклад в создание атмосферы уважения и тепла.',
                locat1: 'РАСПОЛОЖЕНИЕ И МАРШРУТ', 
                locat2: 'Найдите нас',
                locat3: 'Ресторан «Сайора»',
                locat4: 'Бухара, район Гиждуван', 
                locat5: 'Создать маршрут', 
                guest11: 'от 1 до 5',
                gift11: 'Подарки',
                gift22: 'Просьбы к гостям',
                gift33: 'Для нас самое главное — ваше присутствие рядом с нами в этот свадебный вечер. Мы искренне ценим ваше внимание и участие!',
                gift44: 'Если вы хотите порадовать нас ещё больше, будем очень признательны, если вы выразите своё внимание к нашей молодой семье в виде конверта.',
                gift55: 'Уважаемые гости!',
                gift66: 'Просим вас не дарить деньги во время танцев. Ваша искренняя улыбка и добрые пожелания — самый ценный подарок для нас.',
                gift77: 'Для нашего праздника создан специальный Telegram-группа. Там вы сможете ознакомиться с дополнительной информацией, а также делиться радостными моментами свадебного дня через фото и видео.',
                gift88: 'Перейти в Telegram',
                clos11: 'Добро пожаловать на свадьбу!',
                clos22: 'Выражаем искреннюю благодарность за то,',
                clos33: 'что вы с нами в этот счастливый день.',
                clos44: 'С уважением,',
                share11: 'ПОДЕЛИТЕСЬ ПРИГЛАШЕНИЕМ',
                share22: 'Расскажите своим друзьям',
                share33: 'Поделитесь приглашением с близкими — они тоже приглашены на наш праздник!',
                share44: 'Копировать',
                share55: 'Ссылка скопирована!',
                date11: '19 июля 2026 | 19:00',
                date22: 'Спасибо за то, что были с нами в этот самый прекрасный день!'
            },
            uz: { 
                title: 'SIZGA TAKLIFNOMA KELDI', 
                instruction: 'Qulfchani bosib,', 
                instruction1: 'taklifnomani oching',
                heros1: 'To‘yga taklifnoma',
                heros2: '19-iyul 2026 | 19:00',
                herodate: 'Sizning ishtirokingiz — biz uchun eng qadrli sovg‘a',
                timerlabel: 'TO‘YGACHA QOLGAN VAQT',
                unit11: 'kun',
                unit22: 'soat',
                unit33: 'daqiqa',
                unit44: 'soniya',
                scroll11: 'Pastga aylantirin',
                tag11: 'Hurmatli mehmonlar',
                quote11: 'Biz uchun aziz bo‘lgan ushbu kunni siz bilan birga nishonlashni istaymiz. Quvonchimizga sherik bo‘lishingizdan mamnun bo‘lamiz.',
                cal11: 'SANALGAN KUNLAR',
                cal22: 'To‘y kalendari',
                cal33: 'IYUL 2026',
                cale1: 'Du',
                cale2: 'Se',
                cale3: 'Ch',
                cale4: 'Pa',
                cale5: 'Ju',
                cale6: 'Sh',
                cale7: 'Ya',
                notetext1: 'yurak — to‘y kuni',
                detcd1: 'To‘yimiz haqida qisqacha',
                detcd2: 'Tadbir tafsilotlari',
                detcd3: 'Manzil',
                detcd4: '"Sayora" Restorani, Buxoro viloyati G’ijduvon tumani',
                detcd5: 'Xaritada ochish →',
                detcd6: 'Vaqt',
                detcd7: '2026-yil 19-iyul, soat 19:00',
                detcd8: 'Eshiklar 18:30 dan ochiq',
                detcd9: 'Kiyinish kodi',
                detcd10: 'Rasmiy, afzal ko‘rang yorug‘ ranglar',
                detcd11: 'Format',
                detcd12: 'Halol. Tantanali tadbir alkogolsiz ichimliklarsiz o‘tkaziladi',
                detcd13: 'Hurmat va poklik ramzi',
                detcd14: 'Sizning tabassumingiz — bizning eng katta bezakimiz. Hurmat va mehr muhitini yaratishga qo‘shilgan hissangiz uchun oldindan rahmat.',
                locat1: 'JOYLASHUV VA YO‘NALISH', 
                locat2: 'Bizni toping',
                locat3: '"Sayora" Restorani',
                locat4: 'Buxoro viloyati G’ijduvon tumani', 
                locat5: 'Marshrut yaratish', 
                guest11: '1 dan 5 gacha',
                gift11: 'Sovg‘alar',
                gift22: 'Mehmonlarga iltimoslar',
                gift33: 'Biz uchun eng muhimi — sizning to‘y oqshomida yonimizda bo‘lishingiz. E’tiboringiz va ishtirokingizni chin qalbdan qadrlaymiz!',
                gift44: 'Agar bizni yanada xursand qilmoqchi bo‘lsangiz, yosh oilamizga ko‘rsatgan e’tiboringizni konvert shaklida bildirsangiz, bundan benihoya mamnun bo‘lamiz.',
                gift55: 'Hurmatli mehmonlar!',
                gift66: 'Raqs vaqtida pul qistirmasligingizni iltimos qilamiz. Sizning samimiy tabassumingiz va ezgu tilaklaringiz biz uchun eng qimmatli hadyadir.',
                gift77: 'Bayramimiz uchun maxsus Telegram guruhi tashkil etilgan. U yerda qo‘shimcha ma’lumotlar bilan tanishishingiz hamda to‘y kunidagi quvonchli lahzalarni foto va videolar orqali ulashishingiz mumkin.',
                gift88: 'Telegramga o‘tish',
                clos11: 'To‘yga xush kelibsiz!',
                clos22: 'Bu baxtli kunda biz bilan birga bo‘lganingiz uchun',
                clos33: 'samimiy minnatdorchilik bildiramiz.',
                clos44: 'Hurmat bilan,',
                share11: 'TAKLIFNOMANI ULASHING',
                share22: 'Do‘stlaringizga yetkazing',
                share33: 'Taklifnomani yaqinlaringizga ham ulashing — ular ham bizning bayramimizga taklif qilingan!',
                share44: 'Nusxa olish',
                share55: 'Havola nusxalandi!',
                date11: '19-iyul 2026 | 19:00',
                date22: 'Eng go‘zal kunda biz bilan birga bo‘lganingiz uchun tashakkur!'
            },
            uzk: { 
                title: 'СИЗГА ТАКЛИФНОМА КЕЛДИ', 
                instruction: 'Қулфчани босиб,', 
                instruction1: 'таклифномани очинг',
                heros1: 'Тўйга таклифнома',
                heros2: '19 июль 2026 | 19:00',
                herodate: 'Сизнинг иштирокингиз — биз учун энг қадрли совға',
                timerlabel: 'ТЎЙГАЧА ҚОЛГАН ВАҚТ',
                unit11: 'кун',
                unit22: 'соат',
                unit33: 'дақиқа',
                unit44: 'сония',
                scroll11: 'пастга айлантиринг',
                tag11: 'Ҳурматли меҳмонлар!',
                quote11: 'Биз учун азиз бўлган ушбу кунни сиз билан бирга нишонлашни истаймиз. Қувончимизга шерик бўлишингиздан мамнун бўламиз.',
                cal11: 'САНОҚЛИ КУНЛАР',
                cal22: 'Тўй календари',
                cal33: 'ИЮЛЬ 2026',
                cale1: 'Ду',
                cale2: 'Се',
                cale3: 'Чо',
                cale4: 'Па',
                cale5: 'Жу',
                cale6: 'Ша',
                cale7: 'Як',
                notetext1: 'юрак — тўй куни',
                detcd1: 'Тўйимиз ҳақида қисқача',
                detcd2: 'Тадбир тафсилотлари',
                detcd3: 'Манзил',
                detcd4: '“MAMAT OTA” ресторани, Кашкадарья, район Декханабад',
                detcd5: 'Харитада очиш →',
                detcd6: 'Вақт',
                detcd7: '2026-йил 4-июль, соат 18:00',
                detcd8: 'Эшиклар 17:30 дан очиқ',
                detcd9: 'Кийиниш коди',
                detcd10: 'Расмий, ёруғ ранглар афзал',
                detcd11: 'Формат',
                detcd12: 'Ҳалол. Тантанали тадбир алкоголсиз ўтказилади',
                detcd13: 'Ҳурмат ва поклик рамзи',
                detcd14: 'Сизнинг табассумингиз — бизнинг энг катта безагимиз. Ҳурмат ва меҳр муҳитини яратишга қўшган ҳиссангиз учун олдиндан раҳмат.',
                locat1: 'ЖОЙЛАШУВ ВА ЙЎНАЛИШ', 
                locat2: 'Бизни топинг',
                locat3: '“Сайора” ресторани',
                locat4: 'Бухара, район Гиждуванский', 
                locat5: 'Маршрут яратиш', 
                guest11: '1 дан 5 гача',
                gift11: 'Совғалар',
                gift22: 'Меҳмонларга илтимослар',
                gift33: 'Биз учун энг муҳими — сизнинг тўй оқшомида ёнимизда бўлишингиз. Эътиборингиз ва иштирокингизни чин қалбдан қадрлаймиз!',
                gift44: 'Агар бизни янада хурсанд қилмоқчи бўлсангиз, ёш оиламизга кўрсатган эътиборингизни конверт шаклида билдирсангиз, бундан беҳад мамнун бўламиз.',
                gift55: 'Ҳурматли меҳмонлар!',
                gift66: 'Рақс вақтида пул қистирмаслигингизни илтимос қиламиз. Сизнинг самимий табассумингиз ва эзгу тилакларингиз биз учун энг қимматли ҳадядир.',
                gift77: 'Байрамимиз учун махсус Telegram гуруҳи ташкил этилган. У ерда қўшимча маълумотлар билан танишишингиз ҳамда тўй кунидаги қувончли лаҳзаларни фото ва видеолар орқали улашишингиз мумкин.',
                gift88: 'Telegramга ўтиш',
                clos11: 'Тўйга хуш келибсиз!',
                clos22: 'Бу бахтли кунда биз билан бирга бўлганингиз учун',
                clos33: 'самимий миннатдорчилик билдирамиз.',
                clos44: 'Ҳурмат билан,',
                share11: 'ТАКЛИФНОМАНИ УЛАШИНГ',
                share22: 'Дўстларингизга етказинг',
                share33: 'Таклифномани яқинларингизга ҳам улашинг — улар ҳам бизнинг байрамимизга таклиф қилинган!',
                share44: 'Нусха олиш',
                share55: 'Ҳавола нусхаланди!',
                date11: '19 июль 2026 | 19:00',
                date22: 'Энг гўзал кунда биз билан бирга бўлганингиз учун ташаккур!'
            },
            en: { 
                title: 'YOU HAVE RECEIVED AN INVITATION', 
                instruction: 'Click the lock', 
                instruction1: 'to open the invitation',
                heros1: 'Wedding Invitation',
                heros2: 'July 19, 2026 | 19:00',
                herodate: 'Your presence is the most precious gift to us',
                timerlabel: 'TIME REMAINING UNTIL THE WEDDING',
                unit11: 'days',
                unit22: 'hours',
                unit33: 'minutes',
                unit44: 'seconds',
                scroll11: 'scroll down',
                tag11: 'Dear Guests',
                quote11: 'We wish to celebrate this day, which is so dear to us, together with you. We would be delighted to have you share in our joy.',
                cal11: 'COUNTING DAYS',
                cal22: 'Wedding Calendar',
                cal33: 'JULY 2026',
                cale1: 'Mon',
                cale2: 'Tue',
                cale3: 'Wed',
                cale4: 'Thu',
                cale5: 'Fri',
                cale6: 'Sat',
                cale7: 'Sun',
                notetext1: 'heart — wedding day',
                detcd1: 'About Our Wedding',
                detcd2: 'Event Details',
                detcd3: 'Location',
                detcd4: '“Sayyora” Restaurant, Bukhara, Gijduvon district',
                detcd5: 'Open on map →',
                detcd6: 'Time',
                detcd7: 'July 19, 2026, 19:00',
                detcd8: 'Doors open from 18:30',
                detcd9: 'Dress Code',
                detcd10: 'Formal, preferably light colors',
                detcd11: 'Format',
                detcd12: 'Halal. The event will be held without alcoholic beverages',
                detcd13: 'Symbol of Respect and Purity',
                detcd14: 'Your smile is our greatest decoration. Thank you in advance for contributing to an atmosphere of respect and warmth.',
                locat1: 'LOCATION AND DIRECTIONS', 
                locat2: 'Find us',
                locat3: '“Sayyora” restaurant',
                locat4: 'Bukhara, Gijduvon district', 
                locat5: 'Get directions', 
                guest11: 'from 1 to 5',
                gift11: 'Gifts',
                gift22: 'Requests to Guests',
                gift33: 'The most important thing for us is your presence by our side on this special wedding evening. We truly appreciate your attention and participation!',
                gift44: 'If you would like to make us even happier, we would be sincerely grateful if you present your gift to our young family in the form of an envelope.',
                gift55: 'Dear guests!',
                gift66: 'We kindly ask you not to give money during the dances. Your sincere smiles and warm wishes are the most valuable gift for us.',
                gift77: 'A special Telegram group has been created for our celebration. There you can find additional information and share joyful moments from the wedding day through photos and videos.',
                gift88: 'Go to Telegram',
                clos11: 'Welcome to the wedding!',
                clos22: 'We express our sincere gratitude for',
                clos33: 'being with us on this happy day.',
                clos44: 'Sincerely,',
                share11: 'SHARE THE INVITATION',
                share22: 'Tell your friends',
                share33: 'Share the invitation with your loved ones — they are also invited to our celebration!',
                share44: 'Copy',
                share55: 'Link copied!',
                date11: 'July 19, 2026 | 19:00',
                date22: 'Thank you for being with us on this most beautiful day!'
            }
        };
        
        if (translations[lang]) {
            const t = translations[lang];
            document.querySelector('.unlock-title').textContent = t.title;
            document.querySelector('.unlock-instruction').textContent = t.instruction;
            document.querySelector('.unlock1-instruction1').textContent = t.instruction1;
            document.querySelector('.heros1').textContent = t.heros1;
            document.querySelector('.heros2').textContent = t.heros2;
            document.querySelector('.hero-date').textContent = t.herodate;
            document.querySelector('.timer-label').textContent = t.timerlabel;
            document.querySelector('.unit11').textContent = t.unit11;
            document.querySelector('.unit22').textContent = t.unit22;
            document.querySelector('.unit33').textContent = t.unit33;
            document.querySelector('.unit44').textContent = t.unit44;
            document.querySelector('.scroll11').textContent = t.scroll11;
            document.querySelector('.tag11').textContent = t.tag11;
            document.querySelector('.quote11').textContent = t.quote11;
            document.querySelector('.cal11').textContent = t.cal11;
            document.querySelector('.cal22').textContent = t.cal22;
            document.querySelector('.cal33').textContent = t.cal33;
            document.querySelector('.cale1').textContent = t.cale1;
            document.querySelector('.cale2').textContent = t.cale2;
            document.querySelector('.cale3').textContent = t.cale3;
            document.querySelector('.cale4').textContent = t.cale4;
            document.querySelector('.cale5').textContent = t.cale5;
            document.querySelector('.cale6').textContent = t.cale6;
            document.querySelector('.cale7').textContent = t.cale7;
            document.querySelector('.notetext1').textContent = t.notetext1;
            document.querySelector('.detcd1').textContent = t.detcd1;
            document.querySelector('.detcd2').textContent = t.detcd2;
            document.querySelector('.detcd3').textContent = t.detcd3;
            document.querySelector('.detcd4').textContent = t.detcd4;
            document.querySelector('.detcd5').textContent = t.detcd5;
            document.querySelector('.detcd6').textContent = t.detcd6;
            document.querySelector('.detcd7').textContent = t.detcd7;
            document.querySelector('.detcd8').textContent = t.detcd8;
            document.querySelector('.detcd9').textContent = t.detcd9;
            document.querySelector('.detcd10').textContent = t.detcd10;
            document.querySelector('.detcd11').textContent = t.detcd11;
            document.querySelector('.detcd12').textContent = t.detcd12;
            document.querySelector('.detcd13').textContent = t.detcd13;
            document.querySelector('.detcd14').textContent = t.detcd14;
            document.querySelector('.locat1').textContent = t.locat1;
            document.querySelector('.locat2').textContent = t.locat2;
            document.querySelector('.locat3').textContent = t.locat3;
            document.querySelector('.locat4').textContent = t.locat4;
            document.querySelector('.locat5').textContent = t.locat5;
            document.querySelector('.guest11').textContent = t.guest11;
            document.querySelector('.gift11').textContent = t.gift11;
            document.querySelector('.gift22').textContent = t.gift22;
            document.querySelector('.gift33').textContent = t.gift33;
            document.querySelector('.gift44').textContent = t.gift44;
            document.querySelector('.gift55').textContent = t.gift55;
            document.querySelector('.gift66').textContent = t.gift66;
            document.querySelector('.gift77').textContent = t.gift77;
            document.querySelector('.gift88').textContent = t.gift88;
            document.querySelector('.clos11').textContent = t.clos11;
            document.querySelector('.clos22').textContent = t.clos22;
            document.querySelector('.clos33').textContent = t.clos33;
            document.querySelector('.clos44').textContent = t.clos44;
            document.querySelector('.share11').textContent = t.share11;
            document.querySelector('.share22').textContent = t.share22;
            document.querySelector('.share33').textContent = t.share33;
            document.querySelector('.share44').textContent = t.share44;
            document.querySelector('.share55').textContent = t.share55;
            document.querySelector('.date11').textContent = t.date11;
            document.querySelector('.date22').textContent = t.date22;
        }
        translateRsvpSection(lang);
    });
});

document.querySelector('.lang-btn[data-lang="uz"]').classList.add('active');

function translateRsvpSection(lang) {
    const translations = {
        ru: {
            tag: 'ПОДТВЕРДИТЕ СВОЕ ПРИСУТСТВИЕ',
            title: 'Будьте с нами',
            nameLabel: 'Имя гостя',
            namePlaceholder: 'Введите ваше имя',
            guestsLabel: 'Количество гостей',
            attendanceLabel: 'Вы придете на свадьбу?',
            attendanceYes: 'Да, с удовольствием',
            attendanceNo: 'К сожалению, не смогу прийти',
            commentLabel: 'Комментарий (необязательно)',
            commentPlaceholder: 'Ваши пожелания или вопросы',
            submitBtn: 'Отправить',
            noteText: 'Обязательные поля',
            toastMessage: 'Спасибо! Ваш ответ успешно сохранен'
        },
        uz: {
            tag: 'ISHTIROKINGIZNI TASDIQLANG',
            title: 'Biz bilan bo‘ling',
            nameLabel: 'Mehmon ismi',
            namePlaceholder: 'Ismingizni kiriting',
            guestsLabel: 'Mehmonlar soni',
            attendanceLabel: "To'yga kelasizmi?",
            attendanceYes: 'Ha, mamnuniyat bilan',
            attendanceNo: 'Afsuski, kela olmayman',
            commentLabel: 'Sharh (ixtiyoriy)',
            commentPlaceholder: 'Sizning tilaklaringiz yoki savollaringiz',
            submitBtn: 'Yuborish',
            noteText: 'Majburiy maydonlar',
            toastMessage: 'Rahmat! Javobingiz muvaffaqiyatli saqlandi'
        },
        uzk: {
            tag: 'ИШТИРОКИНГИЗНИ ТАСДИҚЛАНГ',
            title: 'Биз билан бўлинг',
            nameLabel: 'Меҳмон исми',
            namePlaceholder: 'Исмингизни киритинг',
            guestsLabel: 'Меҳмонлар сони',
            attendanceLabel: "Тўйга келасизми?",
            attendanceYes: 'Ҳа, мамнуният билан',
            attendanceNo: 'Афсуски, кела олмайман',
            commentLabel: 'Шарҳ (ихтиёрий)',
            commentPlaceholder: 'Сизнинг тилакларингиз ёки саволларингиз',
            submitBtn: 'Юбориш',
            noteText: 'Мажбурий майдонлар',
            toastMessage: 'Раҳмат! Жавобингиз муваффақиятли сақланди'
        },
        en: {
            tag: 'CONFIRM YOUR ATTENDANCE',
            title: 'Be with us',
            nameLabel: 'Guest name',
            namePlaceholder: 'Enter your name',
            guestsLabel: 'Number of guests',
            attendanceLabel: 'Will you attend the wedding?',
            attendanceYes: 'Yes, with pleasure',
            attendanceNo: 'Unfortunately, I cannot come',
            commentLabel: 'Comment (optional)',
            commentPlaceholder: 'Your wishes or questions',
            submitBtn: 'Submit',
            noteText: 'Required fields',
            toastMessage: 'Thank you! Your response has been successfully saved'
        }
    };

    const t = translations[lang] || translations.uz;
    const rsvpSection = document.querySelector('.rsvp-section');
    if (!rsvpSection) return;

    const tag = rsvpSection.querySelector('.tag');
    if (tag) tag.textContent = t.tag;

    const title = rsvpSection.querySelector('.sec-title');
    if (title) title.innerHTML = t.title;

    const formLabels = rsvpSection.querySelectorAll('.form-label .label-text');
    if (formLabels[0]) formLabels[0].textContent = t.nameLabel;
    if (formLabels[1]) formLabels[1].textContent = t.guestsLabel;
    if (formLabels[2]) formLabels[2].textContent = t.attendanceLabel;
    if (formLabels[3]) formLabels[3].textContent = t.commentLabel;

    const nameInput = rsvpSection.querySelector('.form-input');
    if (nameInput) nameInput.placeholder = t.namePlaceholder;

    const textarea = rsvpSection.querySelector('.form-textarea');
    if (textarea) textarea.placeholder = t.commentPlaceholder;

    const radioTexts = rsvpSection.querySelectorAll('.radio-text');
    if (radioTexts[0]) radioTexts[0].textContent = t.attendanceYes;
    if (radioTexts[1]) radioTexts[1].textContent = t.attendanceNo;

    const submitBtn = rsvpSection.querySelector('.submit-btn .btn-text');
    if (submitBtn) submitBtn.textContent = t.submitBtn;

    const noteText = rsvpSection.querySelector('.form-note .note-text');
    if (noteText) noteText.textContent = t.noteText;

    const toastSpan = document.querySelector('#toastMessage span');
    if (toastSpan) toastSpan.textContent = t.toastMessage;
}
function showToast() {
    // Saqlangan tilni olish, bo'lmasa default 'uz'
    const lang = localStorage.getItem('selectedLang') || 'uz';
    
    const messages = {
        uz: "Muvaffaqiyatli saqlandi! ✅",
        ru: "Успешно сохранено! ✅",
        en: "Successfully saved! ✅"
    };

    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = messages[lang] || messages['uz'];
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
// ========== AJAX FORM SUBMISSION ==========
(function() {
    const form = document.getElementById('rsvpForm');
    const toast = document.getElementById('toastMessage');
    
    function getFormData() {
        const nameInput = form.querySelector('.form-input');
        const guestCountSpan = document.querySelector('.guest-count');
        const attendanceRadio = form.querySelector('input[name="attendance"]:checked');
        const textarea = form.querySelector('.form-textarea');
        
        return {
            name: nameInput ? nameInput.value.trim() : '',
            guestCount: guestCountSpan ? parseInt(guestCountSpan.textContent) : 1,
            attendance: attendanceRadio ? attendanceRadio.value : 'yes',
            comment: textarea ? textarea.value.trim() : ''
        };
    }
    
    function resetForm() {
        const nameInput = form.querySelector('.form-input');
        const guestCountSpan = document.querySelector('.guest-count');
        const textarea = form.querySelector('.form-textarea');
        const yesRadio = form.querySelector('input[value="yes"]');
        
        if (nameInput) nameInput.value = '';
        if (guestCountSpan) guestCountSpan.textContent = '1';
        if (textarea) textarea.value = '';
        if (yesRadio) yesRadio.checked = true;
        
        const minusBtn = document.querySelector('.guest-minus');
        const plusBtn = document.querySelector('.guest-plus');
        if (window.guestCounter) window.guestCounter = 1;
    }
    
    function showToast(message) {
        if (!toast) return;
        
        const toastSpan = toast.querySelector('span');
        if (toastSpan && message) {
            toastSpan.textContent = message;
        }
        
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
    
    function validateForm(data) {
        if (!data.name) {
            const nameInput = form.querySelector('.form-input');
            if (nameInput) {
                nameInput.style.borderColor = '#363636';
                nameInput.focus();
            }
            return false;
        }
        return true;
    }
    
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.querySelector('.form-input').value;
        const guestCount = document.querySelector('.guest-count').innerText;
        const comment = document.querySelector('.form-textarea').value;
        
        // TO'G'RI YO'LI: "name" atributi "attendance" bo'lgan tanlangan radio tugmani olish
        const attendance = document.querySelector('input[name="attendance"]:checked').value;

        const { data, error } = await db
            .from('shamshodbek')
            .insert([{ 
                name: name, 
                guest_count: guestCount, 
                comment: comment,
                status: attendance === 'yes' ? 'confirmed' : 'declined', // Bazaga 'yes'/'no' o'rniga 'confirmed'/'declined' yozamiz
                time: new Date().toLocaleString() 
            }]);

        if (error) {
            alert("Xatolik yuz berdi: " + error.message);
        } else {
            showToast();
            form.reset();
            loadGuestsFromDB();
        }
    });
}
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. O'zgaruvchilarni shu yerda, eng tepada e'lon qiling
    const footerTrigger = document.querySelector('.footer-names');
    const guestSection = document.getElementById('guests123');
    const modal = document.getElementById('admin-modal'); // Mana shu joy muhim
    const passInput = document.getElementById('admin-password');
    
    let clickCount = 0;
    let lastClickTime = 0;
    const PASSWORD = "1234";

    // 2. Endi bu funksiyalar 'modal'ni bemalol ko'radi
    if (footerTrigger && guestSection) {
        footerTrigger.addEventListener('click', () => {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime > 1500) clickCount = 0;
            clickCount++;
            lastClickTime = currentTime;

            if (clickCount === 3) {
                modal.style.display = 'flex'; 
                clickCount = 0;
            }
        });
    }

    // Modal tugmalari
    document.getElementById('btn-close')?.addEventListener('click', () => {
        modal.style.display = 'none';
        passInput.value = '';
    });

    document.getElementById('btn-login')?.addEventListener('click', () => {
        if (passInput.value === PASSWORD) {
            guestSection.style.display = (guestSection.style.display === 'block') ? 'none' : 'block';
            modal.style.display = 'none';
            passInput.value = '';
        } else {
            alert("Parol noto‘g‘ri ❌");
        }
    });
});