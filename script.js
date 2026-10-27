// =========================
// GLOBAL STATE
// =========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let cartList, cartTotal, cartCount;
let popup, popupMessage;

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", init);

function init() {
    // Elements
    cartList = document.getElementById("cart-list");
    cartTotal = document.getElementById("cart-total");
    cartCount = document.getElementById("cartCount");
    popup = document.getElementById("popup");
    popupMessage = document.getElementById("popup-message");

    initProfileMenu();
    renderCart();
}

// =========================
// PROFILE MENU
// =========================
function initProfileMenu() {
    const wrapper = document.getElementById("profileWrapper");
    const button = document.getElementById("profileBtn");
    const menu = document.getElementById("profileMenu");

    if (!wrapper || !button || !menu) return;

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
            menu.classList.remove("show");
        }
    });

    document.querySelectorAll(".profile-item").forEach(item => {
        item.addEventListener("click", () => menu.classList.remove("show"));
    });
}

// =========================
// CART
// =========================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price, img) {
    const existing = cart.find(item => item.name === name);

    existing ? existing.qty++ : cart.push({ name, price, img, qty: 1 });

    saveCart();
    renderCart();
    showPopup(`${name} added to cart!`);
}

function removeItem(el) {
    const index = el.dataset.index;
    cart.splice(index, 1);

    saveCart();
    renderCart();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = totalItems;
}

// =========================
// RENDER CART
// =========================
function renderCart() {
    if (!cartList) return;

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${item.img}" class="cart-img">
            <div class="cart-info">
                <p class="cart-name">${item.name}</p>
                <p class="cart-qty">x${item.qty}</p>
                <p class="cart-price">₱${item.price * item.qty}</p>
            </div>
            <span class="remove-btn" data-index="${index}" onclick="removeItem(this)">❌</span>
        `;
        cartList.appendChild(li);
    });

    if (cartTotal) cartTotal.textContent = total;
    updateCartCount();
}

// =========================
// POPUP
// =========================
function showPopup(message) {
    if (!popup) return;

    popupMessage.textContent = message;
    popup.style.display = "flex";

    setTimeout(() => popup.style.display = "none", 1500);
}

// =========================
// CART TOGGLE
// =========================
function toggleCart() {
    const cartEl = document.getElementById("cart");
    if (!cartEl) return;

    cartEl.style.display =
        cartEl.style.display === "block" ? "none" : "block";
}

// =========================
// PRODUCT MODAL
// =========================
function openProduct(name, price, images, desc) {
    const modal = document.getElementById("productModal");
    if (!modal) return;

    modal.style.display = "flex";

    document.getElementById("productTitle").textContent = name;
    document.getElementById("productPrice").textContent = "₱" + price;
    document.getElementById("productDesc").textContent = desc;
    document.getElementById("mainImage").src = images[0];

    const thumbs = document.getElementById("thumbContainer");
    thumbs.innerHTML = "";

    images.forEach(img => {
        const t = document.createElement("img");
        t.src = img;
        t.onclick = () => document.getElementById("mainImage").src = img;
        thumbs.appendChild(t);
    });

    document.getElementById("addCartBtn").onclick = () => {
        addToCart(name, price, images[0]);
        closeProduct();
    };
}

function closeProduct() {
    document.getElementById("productModal").style.display = "none";
}

// =========================
// MENU TABS
// =========================
function openMenu(menuId, btn) {
    document.querySelectorAll(".menu").forEach(m => m.style.display = "none");
    document.getElementById(menuId).style.display = "block";

    document.querySelectorAll(".tablink").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
}

// =========================
// CHECKOUT
// =========================
function openCheckout() {
    function checkout() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
        // KUHA NG NAME NG CUSTOMER
        let customerName = document.getElementById("name").value;
    
        let order = {
            customer: {
                name: customerName
            },
            total: cart.reduce((sum, item) => sum + item.price, 0),
            payment: "GCash", // pwede mo palitan
            items: cart
        };
    
        // 👉 DITO NILA NILALAGAY SA paidOrders
        let orders = JSON.parse(localStorage.getItem("paidOrders")) || [];
        orders.push(order);
        localStorage.setItem("paidOrders", JSON.stringify(orders));
    
        // clear cart after checkout
        localStorage.removeItem("cart");
    
        alert("Order placed!");
    }
    if (cart.length === 0) return alert("Cart is empty!");
    document.getElementById("checkoutModal").style.display = "flex";
}

function closeCheckout() {
    document.getElementById("checkoutModal").style.display = "none";
}

// =========================
// ORDER
// =========================
function placeOrder() {
    const name = custName.value;
    const phone = custPhone.value;
    const address = custAddress.value;
    const payment = paymentMethod.value;

    if (!name || !phone || !address || !payment) {
        return alert("Please fill in all fields!");
    }

    if (payment === "GCash") return openGCash();

    alert(`Order Successful!
Name: ${name}
Payment: ${payment}
Total: ₱${cartTotal.textContent}`);

    clearCart();
}

// =========================
// GCASH
// =========================
function openGCash() {
    document.getElementById("gcashModal").style.display = "flex";
}

function closeGCash() {
    document.getElementById("gcashModal").style.display = "none";
}

function confirmGCash() {
    const order = {
        customer: {
            name: custName.value,
            phone: custPhone.value,
            address: custAddress.value
        },
        payment: "GCash",
        items: [...cart],
        total: cart.reduce((s, i) => s + i.price * i.qty, 0),
        date: new Date().toLocaleString()
    };

    const paidOrders = JSON.parse(localStorage.getItem("paidOrders")) || [];
    paidOrders.push(order);
    localStorage.setItem("paidOrders", JSON.stringify(paidOrders));

    alert("Payment received! Order added to To Ship.");

    clearCart();
    closeGCash();
    closeCheckout();
}

// =========================
// HELPERS
// =========================
function clearCart() {
    cart = [];
    saveCart();
    renderCart();
}
