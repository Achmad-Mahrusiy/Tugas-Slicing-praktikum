document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    function setTheme(theme) {
        root.setAttribute("data-theme", theme);
        themeIcon.textContent = theme === "dark" ? "☀" : "☾";
        themeToggle.setAttribute("aria-label", theme === "dark" ? "Gunakan tema terang" : "Gunakan tema gelap");
        try { localStorage.setItem("tema", theme); } catch (error) { /* Penyimpanan bisa dinonaktifkan browser. */ }
    }

    let initialTheme = "light";
    try {
        initialTheme = localStorage.getItem("tema") ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch (error) { dark }
    setTheme(initialTheme);

    themeToggle.addEventListener("click", function () {
        setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");
    menuToggle.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
            nav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });

    const contactRoot = document.getElementById("kontak");
    const heading = document.createElement("h2");
    heading.id = "contact-title";
    heading.textContent = "Kontak";

    const form = document.createElement("form");
    form.id = "contactForm";
    form.noValidate = true;

    function createField(id, labelText, type, multiline) {
        const group = document.createElement("div");
        group.className = "form-field";
        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = labelText;
        const input = document.createElement(multiline ? "textarea" : "input");
        input.id = id;
        input.name = id;
        input.required = true;
        if (multiline) input.rows = 4;
        else input.type = type;
        const error = document.createElement("span");
        error.id = id + "Error";
        error.className = "field-error";
        error.setAttribute("aria-live", "polite");
        input.setAttribute("aria-describedby", error.id);
        group.append(label, input, error);
        return group;
    }

    form.append(
        createField("nama", "Nama", "text", false),
        createField("email", "Email", "email", false),
        createField("pesan", "Pesan", "text", true)
    );
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "contact-submit";
    submit.textContent = "Kirim pesan";
    const formStatus = document.createElement("p");
    formStatus.id = "formStatus";
    formStatus.className = "form-status";
    formStatus.setAttribute("role", "status");
    formStatus.setAttribute("aria-live", "polite");
    form.append(submit, formStatus);
    contactRoot.append(heading, form);

    function showError(id, message) {
        document.getElementById(id + "Error").textContent = message;
        document.getElementById(id).classList.toggle("invalid", message !== "");
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = form.elements.nama.value.trim();
        const email = form.elements.email.value.trim();
        const message = form.elements.pesan.value.trim();
        let valid = true;

        if (name.length < 2) { showError("nama", "Nama tidak boleh kosong!"); valid = false; }
        else showError("nama", "");
        if (!/^\S+@\S+\.\S+$/.test(email)) { showError("email", "Masukkan alamat email yang valid."); valid = false; }
        else showError("email", "");
        if (message.length < 10) { showError("pesan", "Pesan minimal 10 karakter!"); valid = false; }
        else showError("pesan", "");

        if (valid) {
            formStatus.textContent = "Terima kasih, " + name + ". Pesan berhasil dicatat.";
            form.reset();
        } else formStatus.textContent = "Mohon periksa kembali isian form.";
    });

    document.getElementById("year").textContent = new Date().getFullYear();

    const sections = document.querySelectorAll("main article[id]");
    const navLinks = document.querySelectorAll(".nav a[href^='#']");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (link) {
                    link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
                });
            });
        }, { rootMargin: "-40% 0px -55% 0px" });
        sections.forEach(function (section) { observer.observe(section); });
    }
});
