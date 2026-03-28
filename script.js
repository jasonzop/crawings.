const buttons = document.querySelectorAll(".add-to-cart");
const cartContainer = document.getElementById("cart-items");
const totalDisplay = document.getElementById("cart-total");
const clearBtn = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ADD TO CART
buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const item = btn.parentElement;
        const name = item.dataset.name;
        const price = parseFloat(item.dataset.price);

        const existing = cart.find((i) => i.name === name);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCart();
    });
});

// INCREASE
function increaseQty(name) {
    const item = cart.find(i => i.name === name);
    if (item) item.quantity++;
    updateCart();
}

// DECREASE
function decreaseQty(name) {
    const item = cart.find(i => i.name === name);

    if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }

    updateCart();
}

// CLEAR CART
clearBtn.addEventListener("click", () => {
    cart = [];
    updateCart();
});

// UPDATE UI
function updateCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        totalDisplay.textContent = "0.00";
        localStorage.setItem("cart", JSON.stringify(cart));
        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <h4>${item.name}</h4>
            <p>$${item.price} x ${item.quantity}</p>
            <div class="qty-controls">
                <button class="qty-btn minus">-</button>
                <button class="qty-btn plus">+</button>
            </div>
        `;

        div.querySelector(".plus").onclick = () => increaseQty(item.name);
        div.querySelector(".minus").onclick = () => decreaseQty(item.name);

        cartContainer.appendChild(div);
    });

    totalDisplay.textContent = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cart));
}

updateCart();