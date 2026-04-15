const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function showCartNotification(message) {
    const oldNote = document.querySelector(".cart-notification");
    if (oldNote) {
        oldNote.remove();
    }

    const note = document.createElement("div");
    note.className = "cart-notification";
    note.textContent = message;
    document.body.appendChild(note);

    setTimeout(() => {
        note.classList.add("show");
    }, 10);

    setTimeout(() => {
        note.classList.remove("show");
        setTimeout(() => {
            note.remove();
        }, 300);
    }, 2000);
}

function renderCart() {
    if (!cartItemsContainer || !cartTotal) return;

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        cartTotal.textContent = "0.00";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>$${item.price} x ${item.quantity}</p>
        `;

        const qtyControls = document.createElement("div");
        qtyControls.className = "qty-controls";

        const minusBtn = document.createElement("button");
        minusBtn.textContent = "-";
        minusBtn.className = "qty-btn";

        minusBtn.onclick = () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            renderCart();
        };

        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        plusBtn.className = "qty-btn";

        plusBtn.onclick = () => {
            item.quantity++;
            saveCart();
            renderCart();
        };

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";

        removeBtn.onclick = () => {
            cart.splice(index, 1);
            saveCart();
            renderCart();
        };

        qtyControls.appendChild(minusBtn);
        qtyControls.appendChild(plusBtn);

        cartItem.appendChild(qtyControls);
        cartItem.appendChild(removeBtn);

        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
        const pizza = button.parentElement;
        const name = pizza.dataset.name;
        const price = parseFloat(pizza.dataset.price);

        const existingItem = cart.find((item) => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        saveCart();
        renderCart();
        showCartNotification(name + " added to cart!");
    });
});

if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        cart = [];
        saveCart();
        renderCart();
    });
}

renderCart();