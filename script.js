document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // TOAST NOTIFICATION SYSTEM
    // =========================================
    function showToast(message, type = "success", duration = 3500) {
        const container = document.getElementById("toastContainer");
        if (!container) return;

        const iconMap = {
            success: "check_circle",
            info: "info",
            error: "error",
            cart: "shopping_bag"
        };

        const toast = document.createElement("div");
        toast.className = `toast-item toast-${type === "cart" ? "success" : type}`;
        toast.innerHTML = `
            <span class="material-symbols-outlined toast-icon">${iconMap[type] || "info"}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("toast-fade-out");
            toast.addEventListener("transitionend", () => toast.remove(), { once: true });
        }, duration);
    }
// Inside your updateCartUI function where items are generated:
function updateCartUI() {
    const cartItemsContainer = document.getElementById("cartDrawerItems");
    const emptyState = document.getElementById("cartEmptyState");
    
    // ... clear container logic ...

    cartData.forEach(item => {
        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">
                <span class="material-symbols-outlined">delete</span>
            </button>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    // ... update subtotal logic ...
}
    const navbar = document.querySelector(".navbar");

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleNavbarScroll, { passive: true });

    // Active nav link highlight on scroll
    const sections = document.querySelectorAll("section[id], .hero[id]");
    const navLinks = document.querySelectorAll(".nav-pill a, .mobile-nav-drawer a");

    function updateActiveNav() {
        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });


    const gadgethiveBtn = document.getElementById("gadgethiveBtn");
    const mobileNavDrawer = document.getElementById("mobileNavDrawer");

    if (gadgethiveBtn && mobileNavDrawer) {
        gadgethiveBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = mobileNavDrawer.classList.toggle("open");
            gadgethiveBtn.classList.toggle("open", isOpen);
        });

        // Close on link click
        mobileNavDrawer.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileNavDrawer.classList.remove("open");
                gadgethiveBtn.classList.remove("open");
            });
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (!gadgethiveBtn.contains(e.target) && !mobileNavDrawer.contains(e.target)) {
                mobileNavDrawer.classList.remove("open");
                gadgethiveBtn.classList.remove("open");
            }
        });
    }

    // =========================================
    // HERO CTA BUTTON
    // =========================================
    const heroCtaBtn = document.getElementById("heroCtaBtn");
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener("click", () => {
            document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
        });
    }

    // =========================================
    // SCROLL REVEAL ANIMATIONS
    // =========================================
    const revealEls = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(el => revealObserver.observe(el));

    // =========================================
    // PRODUCT FILTER + SEARCH
    // =========================================
    const shopCards = document.querySelectorAll(".shop-card");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const searchWrapper = document.getElementById("searchWrapper");
    const toggleSearchBtn = document.getElementById("toggleSearchBtn");
    const searchInput = document.getElementById("searchInput");

    let currentFilter = "all";

    if (filterButtons.length > 0 && shopCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.getAttribute("data-filter");
                if (searchInput) searchInput.value = "";
                applyFilter(currentFilter, "");
            });
        });
    }

    function applyFilter(category, query) {
        shopCards.forEach(card => {
            const matchCat = category === "all" || card.getAttribute("data-category") === category;
            const titleEl = card.querySelector("h3");
            const matchQuery = !query || (titleEl && titleEl.textContent.toLowerCase().includes(query));
            card.style.display = (matchCat && matchQuery) ? "flex" : "none";
        });
    }

    if (toggleSearchBtn && searchWrapper && searchInput) {
        toggleSearchBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            searchWrapper.classList.toggle("active");
            if (searchWrapper.classList.contains("active")) {
                searchInput.focus();
            } else {
                searchInput.value = "";
                applyFilter(currentFilter, "");
            }
        });

        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterButtons.forEach(b => b.classList.remove("active"));
            const allBtn = Array.from(filterButtons).find(btn => btn.getAttribute("data-filter") === "all");
            if (allBtn) allBtn.classList.add("active");
            currentFilter = "all";
            applyFilter("all", query);
        });

        window.addEventListener("click", (e) => {
            if (searchWrapper && !searchWrapper.contains(e.target) && searchInput.value === "") {
                searchWrapper.classList.remove("active");
            }
        });
    }

    // =========================================
    // AUTH SYSTEM (No alert() — uses toasts)
    // =========================================
    const openAuthBtn = document.getElementById("openAuthBtn");
    const authOverlay = document.getElementById("authOverlay");
    const closeAuth = document.getElementById("closeAuth");
    const closeSignup = document.getElementById("closeSignup");
    const switchSignup = document.getElementById("switchSignup");
    const switchLogin = document.getElementById("switchLogin");
    const loginCard = document.getElementById("loginCard");
    const signupCard = document.getElementById("signupCard");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const accountDropdown = document.getElementById("accountDropdown");
    const userDisplayName = document.getElementById("userDisplayName");
    const logoutBtn = document.getElementById("logoutBtn");

    let isLoggedIn = false;

    function openAuthModal() {
        if (authOverlay) authOverlay.classList.add("active");
        if (loginCard) loginCard.style.display = "block";
        if (signupCard) signupCard.style.display = "none";
    }

    const closeAuthModal = () => {
        if (authOverlay) authOverlay.classList.remove("active");
    };

    if (openAuthBtn) {
        openAuthBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!isLoggedIn) {
                openAuthModal();
            } else {
                accountDropdown?.classList.toggle("active");
            }
        });
    }

    function handleSuccessfulAuth(username) {
        isLoggedIn = true;
        if (userDisplayName) userDisplayName.textContent = username || "Member";
        closeAuthModal();
        showToast(`Welcome back, ${username || "Member"}! 👋`, "success");
    }

    if (closeAuth) closeAuth.addEventListener("click", closeAuthModal);
    if (closeSignup) closeSignup.addEventListener("click", closeAuthModal);

    if (switchSignup && loginCard && signupCard) {
        switchSignup.addEventListener("click", (e) => {
            e.preventDefault();
            loginCard.style.display = "none";
            signupCard.style.display = "block";
        });
    }

    if (switchLogin && loginCard && signupCard) {
        switchLogin.addEventListener("click", (e) => {
            e.preventDefault();
            signupCard.style.display = "none";
            loginCard.style.display = "block";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = loginForm.querySelector('input[type="email"]');
            const name = emailInput?.value ? emailInput.value.split("@")[0] : "User";
            handleSuccessfulAuth(name);
            loginForm.reset();
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("signupNameField");
            const name = nameInput?.value || "Member";
            handleSuccessfulAuth(name);
            signupForm.reset();
        });
    }

    // =========================================
    // LOGOUT
    // =========================================
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            isLoggedIn = false;
            if (userDisplayName) userDisplayName.textContent = "Guest";
            accountDropdown?.classList.remove("active");
            showToast("You've been signed out. See you soon!", "info");
        });
    }

    // =========================================
    // PRODUCT QUICK-VIEW LIGHTBOX
    // =========================================
    const productOverlay = document.getElementById("productOverlay");
    const closeProduct = document.getElementById("closeProduct");

    if (shopCards.length > 0 && productOverlay) {
        shopCards.forEach(card => {
            card.addEventListener("click", (e) => {
                if (e.target.closest(".add-cart-btn")) return;
                const title = card.querySelector("h3").textContent;
                const price = card.querySelector(".price").textContent;
                const imgUrl = card.querySelector(".shop-img img").src;
                document.getElementById("detailTitle").textContent = title;
                document.getElementById("detailPrice").textContent = price;
                document.getElementById("detailImg").src = imgUrl;
                productOverlay.classList.add("active");
            });
        });
    }

    if (closeProduct && productOverlay) {
        closeProduct.addEventListener("click", () => productOverlay.classList.remove("active"));
    }

    // =========================================
    // CART DRAWER
    // =========================================
    const openCartBtn = document.getElementById("openCartBtn");
    const closeCartBtn = document.getElementById("closeCartBtn");
    const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
    const cartDrawerItems = document.getElementById("cartDrawerItems");
    const cartEmptyState = document.getElementById("cartEmptyState");
    const cartBadge = document.getElementById("cartBadge");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const checkoutSubmitBtn = document.getElementById("checkoutSubmitBtn");
    const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
    const successOverlay = document.getElementById("successOverlay");
    const successAmount = document.getElementById("successAmount");
    const closeSuccessBtn = document.getElementById("closeSuccessBtn");

    let cartData = [];

    if (openCartBtn && cartDrawerOverlay) {
        openCartBtn.addEventListener("click", () => cartDrawerOverlay.classList.add("active"));
    }

    if (closeCartBtn && cartDrawerOverlay) {
        closeCartBtn.addEventListener("click", () => cartDrawerOverlay.classList.remove("active"));
    }

    function animateBadge() {
        if (!cartBadge) return;
        cartBadge.classList.remove("bounce");
        void cartBadge.offsetWidth; // reflow
        cartBadge.classList.add("bounce");
    }

    function addItemToCart(title, price, imgUrl) {
        const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
        const existingIndex = cartData.findIndex(item => item.title === title);
        if (existingIndex > -1) {
            cartData[existingIndex].quantity += 1;
        } else {
            cartData.push({ title, price: numericPrice, imgUrl, quantity: 1 });
        }
        renderCartView();
        animateBadge();
        showToast(`"${title}" added to cart`, "cart");
    }

    const inlineAddButtons = document.querySelectorAll(".add-cart-btn");
    inlineAddButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const card = btn.closest(".shop-card");
            const title = card.querySelector("h3").textContent;
            const price = card.querySelector(".price").textContent;
            const imgUrl = card.querySelector(".shop-img img").src;
            addItemToCart(title, price, imgUrl);
        });
    });

    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener("click", () => {
            const title = document.getElementById("detailTitle").textContent;
            const price = document.getElementById("detailPrice").textContent;
            const imgUrl = document.getElementById("detailImg").src;
            addItemToCart(title, price, imgUrl);
            productOverlay?.classList.remove("active");
        });
    }

    function updateQuantity(title, amount) {
        const targetIndex = cartData.findIndex(item => item.title === title);
        if (targetIndex > -1) {
            cartData[targetIndex].quantity += amount;
            if (cartData[targetIndex].quantity <= 0) {
                cartData.splice(targetIndex, 1);
            }
        }
        renderCartView();
    }

    function renderCartView() {
        cartDrawerItems.innerHTML = "";

        if (cartData.length === 0) {
            cartDrawerItems.appendChild(cartEmptyState);
            if (cartBadge) cartBadge.textContent = "0";
            if (cartSubtotal) cartSubtotal.textContent = "$0.00";
            return;
        }

        let totalCount = 0;
        let totalSum = 0;

        cartData.forEach(item => {
            totalCount += item.quantity;
            totalSum += item.price * item.quantity;

            const itemRow = document.createElement("div");
            itemRow.className = "cart-item";
            itemRow.innerHTML = `
                <img src="${item.imgUrl}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="cart-qty-control">
                        <button class="qty-btn qty-minus-btn" aria-label="Decrease quantity">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn qty-plus-btn" aria-label="Increase quantity">+</button>
                    </div>
                </div>
            `;

            itemRow.querySelector(".qty-minus-btn").addEventListener("click", () => updateQuantity(item.title, -1));
            itemRow.querySelector(".qty-plus-btn").addEventListener("click", () => updateQuantity(item.title, 1));
            cartDrawerItems.appendChild(itemRow);
        });

        if (cartBadge) cartBadge.textContent = totalCount;
        if (cartSubtotal) cartSubtotal.textContent = `$${totalSum.toFixed(2)}`;
    }

    if (checkoutSubmitBtn) {
        checkoutSubmitBtn.addEventListener("click", () => {
            if (cartData.length === 0) {
                showToast("Your cart is empty! Add some products first.", "error");
                return;
            }

            if (successAmount && cartSubtotal) {
                successAmount.textContent = cartSubtotal.textContent;
            }

            cartDrawerOverlay?.classList.remove("active");
            successOverlay?.classList.add("active");

            cartData = [];
            renderCartView();
        });
    }
    

    if (closeSuccessBtn && successOverlay) {
        closeSuccessBtn.addEventListener("click", () => {
            successOverlay.classList.remove("active");
        });
    }

    // =========================================
    // CONTACT FORM (with toast feedback)
    // =========================================
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector(".cta-button");
            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showToast("Message sent! We'll get back to you shortly.", "success");
            }, 1000);
        });
    }

    // =========================================
    // GLOBAL OVERLAY CLOSE (BACKDROP CLICK)
    // =========================================
    window.addEventListener("click", (e) => {
        if (authOverlay && e.target === authOverlay) closeAuthModal();
        if (productOverlay && e.target === productOverlay) productOverlay.classList.remove("active");
        if (cartDrawerOverlay && e.target === cartDrawerOverlay) cartDrawerOverlay.classList.remove("active");
        if (accountDropdown && !accountDropdown.contains(e.target) && e.target !== openAuthBtn) {
            accountDropdown?.classList.remove("active");
        }
    });

    // =========================================
    // BACK TO TOP BUTTON
    // =========================================
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }
        }, { passive: true });

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

});

