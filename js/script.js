
/* =========================================
   AURORA - MAIN JAVASCRIPT
   این فایل قابلیت‌های تعاملی سایت را فعال می‌کند.
========================================= */

// عناصر منوی موبایل
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// بخش گالری و دکمه‌های فیلتر
const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-btn");

// فرم تماس
const contactForm = document.getElementById("contactForm");


/* =========================================
   02. MOBILE MENU
   باز و بسته کردن منوی موبایل
========================================= */

if (menuToggle && navLinks) {

    // با کلیک روی دکمه، کلاس active اضافه یا حذف می‌شود
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        // وضعیت باز یا بسته بودن منو
        const isOpen = navLinks.classList.contains("active");

        // اعلام وضعیت منو برای دسترسی بهتر
        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // با کلیک روی یکی از لینک‌ها، منو بسته می‌شود
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// dark mode 

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    const isLight = document.body.classList.contains("light-theme");

    themeIcon.textContent = isLight ? "☾" : "☀";
});


/* =========================================
   04. GALLERY FILTER
   فیلتر تصاویر گالری
========================================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // دسته‌بندی انتخاب‌شده را می‌گیریم
        const selectedFilter = button.dataset.filter;

        // فعال‌کردن دکمه انتخاب‌شده
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // بررسی دسته‌بندی هر تصویر
        galleryItems.forEach(item => {

            const category = item.dataset.category;

            // اگر All انتخاب شود، تمام تصاویر نمایش داده می‌شوند
            // در غیر آن فقط تصاویر همان دسته نمایش داده می‌شوند
            if (selectedFilter === "all" || category === selectedFilter) {
                item.classList.remove("hide");
            } else {
                item.classList.add("hide");
            }
        });

    });

});


/* =========================================
   05. GALLERY LIGHTBOX
   بازکردن تصویر در اندازه بزرگ
========================================= */

// ساخت پنجره نمایش تصویر
const lightbox = document.createElement("div");
lightbox.className = "aurora-lightbox";

lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
    <img src="" alt="Aurora gallery image">
    <button class="lightbox-next" aria-label="Next image">&#10095;</button>
`;

document.body.appendChild(lightbox);

// گرفتن عناصر داخل پنجره
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = lightbox.querySelector(".lightbox-close");
const lightboxPrev = lightbox.querySelector(".lightbox-prev");
const lightboxNext = lightbox.querySelector(".lightbox-next");

let currentImageIndex = 0;
let visibleGalleryItems = [];

// دریافت تصاویر قابل نمایش
function updateVisibleImages() {
    visibleGalleryItems = [...galleryItems].filter(item => !item.classList.contains("hide"));
}

// نمایش تصویر انتخاب‌شده
function showLightboxImage(index) {

    updateVisibleImages();

    // اگر تصویر دیگری وجود نداشته باشد، کاری انجام نمی‌شود
    if (visibleGalleryItems.length === 0) return;

    // برای جلوگیری از خارج‌شدن شماره از محدوده تصاویر
    currentImageIndex =
        (index + visibleGalleryItems.length) % visibleGalleryItems.length;

    const image = visibleGalleryItems[currentImageIndex].querySelector("img");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

// با کلیک روی هر تصویر، پنجره باز می‌شود
galleryItems.forEach(item => {

    item.addEventListener("click", () => {

        updateVisibleImages();

        const index = visibleGalleryItems.indexOf(item);

        showLightboxImage(index);
    });

});

// تصویر قبلی
lightboxPrev.addEventListener("click", () => {
    showLightboxImage(currentImageIndex - 1);
});

// تصویر بعدی
lightboxNext.addEventListener("click", () => {
    showLightboxImage(currentImageIndex + 1);
});

// بستن پنجره
function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);

// با کلیک روی فضای تاریک بیرون تصویر نیز بسته می‌شود
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});


/* =========================================
   06. LIGHTBOX KEYBOARD CONTROLS
   کنترل تصویر با صفحه‌کلید
========================================= */

document.addEventListener("keydown", event => {

    // اگر پنجره تصویر باز نباشد، کاری انجام نمی‌شود
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        showLightboxImage(currentImageIndex + 1);
    }

    if (event.key === "ArrowLeft") {
        showLightboxImage(currentImageIndex - 1);
    }
});


/* =========================================
   07. CONTACT FORM VALIDATION
   بررسی اطلاعات فرم تماس
========================================= */

// گرفتن فیلدهای فرم
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");

// گرفتن محل نمایش خطاها
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const subjectError = document.getElementById("subjectError");
const messageError = document.getElementById("messageError");
const formStatus = document.getElementById("formStatus");

if (contactForm && fullName && email && subject && message) {

    contactForm.addEventListener("submit", event => {

        // جلوگیری از ارسال معمولی فرم و تازه‌شدن صفحه
        event.preventDefault();

        let isValid = true;

        // پاک‌کردن خطاهای قبلی
        nameError.textContent = "";
        emailError.textContent = "";
        subjectError.textContent = "";
        messageError.textContent = "";
        formStatus.textContent = "";

        // بررسی نام
        if (fullName.value.trim().length < 2) {
            nameError.textContent = "Please enter your name.";
            isValid = false;
        }

        // بررسی ساختار ایمیل
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.value.trim())) {
            emailError.textContent = "Please enter a valid email.";
            isValid = false;
        }

        // بررسی موضوع پیام
        if (subject.value.trim().length < 3) {
            subjectError.textContent = "Please enter a subject.";
            isValid = false;
        }

        // بررسی متن پیام
        if (message.value.trim().length < 10) {
            messageError.textContent = "Message must be at least 10 characters.";
            isValid = false;
        }

        // اگر همه اطلاعات درست باشند
        if (isValid) {

            formStatus.textContent = "Thank you! Your message is ready.";

            // پاک‌کردن اطلاعات فرم
            contactForm.reset();
        }

    });

}


/* =========================================
   08. BACK TO TOP
   بازگشت به بالای صفحه
========================================= */

const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
    backToTop.addEventListener("click", event => {

        // جلوگیری از رفتار پیش‌فرض لینک
        event.preventDefault();

        // حرکت نرم به بالای صفحه
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });
}


/* =========================================
   09. SMOOTH SCROLL
   حرکت نرم بین بخش‌های سایت
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId = link.getAttribute("href");

        // لینک خالی را نادیده می‌گیریم
        if (targetId === "#") return;

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

});


/* =========================================
   10. ACTIVE NAVIGATION
   مشخص‌کردن بخش فعال در منو
========================================= */

const pageSections = document.querySelectorAll(
    "#hero, #philosophy, #innovation, #gallery, #specifications, #contact"
);

const navigationLinks = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const activeId = entry.target.id;

                // حذف حالت فعال از تمام لینک‌ها
                navigationLinks.forEach(link => {
                    link.classList.remove("active");

                    // فعال‌کردن لینک مربوط به بخش فعلی
                    if (link.getAttribute("href") === `#${activeId}`) {
                        link.classList.add("active");
                    }
                });

            }

        });

    }, {
        threshold: 0.4
    });

    pageSections.forEach(section => {
        sectionObserver.observe(section);
    });

}


/* =========================================
   11. SCROLL REVEAL
   ظاهرشدن آرام بخش‌ها هنگام اسکرول
========================================= */

// بررسی تنظیمات حرکت در دستگاه کاربر
const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reduceMotion) {

    const revealElements = document.querySelectorAll(
        ".section-heading, .philosophy-content, .innovation-card, .gallery-item, .specification-item, .contact-content"
    );

    // آماده‌سازی حالت ابتدایی عناصر
    revealElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(25px)";
        element.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    });

    const revealObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                // عنصر به حالت عادی برمی‌گردد
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                // پس از نمایش، دیگر نیاز به بررسی آن نیست
                revealObserver.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

}


/* =========================================
   12. 3D TILT
   حرکت سه‌بعدی کارت‌های Innovation
========================================= */

const innovationCards = document.querySelectorAll(".innovation-card");

// این افکت فقط در دستگاه‌هایی که ماوس دارند فعال می‌شود
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {

    innovationCards.forEach(card => {

        card.addEventListener("mousemove", event => {

            const rect = card.getBoundingClientRect();

            // موقعیت ماوس نسبت به مرکز کارت
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            // تبدیل موقعیت ماوس به زاویه چرخش
            const rotateX = -(y / rect.height) * 5;
            const rotateY = (x / rect.width) * 5;

            card.style.transform =
                `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

        });

        // وقتی ماوس از کارت خارج شود، کارت به حالت اول برمی‌گردد
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
        });

    });

}


/* =========================================
   13. 3D GALLERY HOVER
   افکت ملایم حرکت تصاویر گالری
========================================= */

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {

    galleryItems.forEach(item => {

        item.addEventListener("mousemove", event => {

            const rect = item.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateY = ((x / rect.width) - 0.5) * 4;
            const rotateX = (0.5 - (y / rect.height)) * 4;

            const image = item.querySelector("img");

            image.style.transform =
                `scale(1.04) perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        });

        item.addEventListener("mouseleave", () => {

            const image = item.querySelector("img");

            image.style.transform = "";

        });

    });

}


/* =========================================
   14. HERO PARALLAX
   حرکت آرام تصویر پس‌زمینه Hero هنگام اسکرول
========================================= */

const hero = document.querySelector(".hero");

if (hero && !reduceMotion) {

    window.addEventListener("scroll", () => {

        // میزان اسکرول صفحه
        const scrollPosition = window.scrollY;

        // حرکت بسیار آرام تصویر پس‌زمینه
        if (scrollPosition < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrollPosition * 0.25}px`;
        }

    }, {
        passive: true
    });

}


/* =========================================
   15. TEST DRIVE POPUP
   ساخت دکمه و پنجره درخواست تست موتر
========================================= */

const heroButtons = document.querySelector(".hero-buttons");

// اگر بخش دکمه‌های Hero موجود باشد، دکمه جدید اضافه می‌شود
if (heroButtons) {

    const testDriveButton = document.createElement("button");

    testDriveButton.className = "btn btn-secondary";
    testDriveButton.type = "button";
    testDriveButton.textContent = "Book a Test Drive";

    heroButtons.appendChild(testDriveButton);

    // ساخت پنجره تست درایو
    const testDriveModal = document.createElement("div");

    testDriveModal.className = "aurora-modal";

    testDriveModal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" type="button">&times;</button>

            <p class="eyebrow">EXPERIENCE AURORA</p>
            <h2>Book a Test Drive</h2>
            <p>Discover a new way to drive.</p>

            <form class="test-drive-form">
                <input type="text" placeholder="Your name" required minlength="2">
                <input type="email" placeholder="Your email" required>
                <input type="date" required>
                <button class="btn btn-primary" type="submit">
                    Submit Request
                </button>
                <p class="test-drive-status"></p>
            </form>
        </div>
    `;

    document.body.appendChild(testDriveModal);

    const modalClose = testDriveModal.querySelector(".modal-close");
    const testDriveForm = testDriveModal.querySelector(".test-drive-form");
    const testDriveStatus = testDriveModal.querySelector(".test-drive-status");

    // بازکردن پنجره
    testDriveButton.addEventListener("click", () => {
        testDriveModal.classList.add("active");
    });

    // بستن پنجره
    modalClose.addEventListener("click", () => {
        testDriveModal.classList.remove("active");
    });

    // بستن با کلیک روی فضای بیرون پنجره
    testDriveModal.addEventListener("click", event => {
        if (event.target === testDriveModal) {
            testDriveModal.classList.remove("active");
        }
    });

    // بررسی فرم تست درایو
    testDriveForm.addEventListener("submit", event => {

        event.preventDefault();

        testDriveStatus.textContent =
            "Thank you! Your demo request has been received.";

        testDriveForm.reset();

    });

}


/* =========================================
   16. POPUP STYLES
   استایل پنجره‌های بازشونده
========================================= */

const popupStyle = document.createElement("style");

popupStyle.textContent = `

    /* استایل عمومی پنجره‌های بازشونده */
    .aurora-lightbox,
    .aurora-modal {
        position: fixed;
        inset: 0;
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 25px;
        background: rgba(3, 7, 10, 0.94);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    /* نمایش پنجره */
    .aurora-lightbox.active,
    .aurora-modal.active {
        opacity: 1;
        visibility: visible;
    }

    /* تصویر بزرگ گالری */
    .aurora-lightbox img {
        max-width: 85%;
        max-height: 85vh;
        object-fit: contain;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    /* دکمه‌های پنجره تصویر */
    .lightbox-close,
    .lightbox-prev,
    .lightbox-next,
    .modal-close {
        position: absolute;
        border: none;
        background: transparent;
        color: white;
        font-size: 2rem;
        cursor: pointer;
    }

    .lightbox-close,
    .modal-close {
        top: 25px;
        right: 30px;
    }

    .lightbox-prev {
        left: 25px;
    }

    .lightbox-next {
        right: 25px;
    }

    /* محتوای پنجره تست درایو */
    .modal-content {
        position: relative;
        width: min(100%, 480px);
        padding: 45px 35px;
        background: #f0f2f3;
        color: #11151a;
    }

    .modal-content h2 {
        font-size: 2rem;
        margin-bottom: 12px;
    }

    .modal-content > p:not(.eyebrow) {
        color: #68737a;
        margin-bottom: 25px;
    }

    .modal-content .eyebrow {
        color: #66879a;
    }

    .test-drive-form {
        display: grid;
        gap: 15px;
    }

    .test-drive-form input {
        width: 100%;
        padding: 13px;
        border: 1px solid #cbd2d5;
        background: white;
        color: #11151a;
    }

    .test-drive-form .btn {
        background: #090b0e;
        color: white;
        border-color: #090b0e;
    }

    .test-drive-status {
        color: #477c62;
        font-size: 0.85rem;
    }

    @media (max-width: 500px) {
        .aurora-lightbox img {
            max-width: 100%;
            max-height: 75vh;
        }

        .lightbox-prev {
            left: 8px;
        }

        .lightbox-next {
            right: 8px;
        }

        .modal-content {
            padding: 40px 22px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .aurora-lightbox,
        .aurora-modal {
            transition: none;
        }
    }
`;

document.head.appendChild(popupStyle);


/* =========================================
   17. FINAL MESSAGE
========================================= */

// این پیام فقط برای بررسی اجرای درست JavaScript در Console است
console.log("AURORA website JavaScript is working!");
