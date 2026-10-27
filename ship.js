// =========================
// TO SHIP PAGE SCRIPT
// =========================

// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    renderPaidOrders();
});

function renderPaidOrders() {
    const container = document.getElementById("ordersContainer");
    container.innerHTML = ""; // Clear previous content

    // Get paid orders from localStorage
    const paidOrders = JSON.parse(localStorage.getItem("paidOrders")) || [];

    if (paidOrders.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No orders to ship yet.</p>";
        return;
    }

    paidOrders.forEach((order, index) => {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order-card");
        orderDiv.style.border = "1px solid #ccc";
        orderDiv.style.borderRadius = "8px";
        orderDiv.style.padding = "15px";
        orderDiv.style.margin = "10px 0";
        orderDiv.style.background = "#fff";
        
        let itemsHTML = "";
        order.items.forEach(item => {
            itemsHTML += `
                <li style="margin-bottom:5px;">
                    <img src="${item.img}" style="width:50px; vertical-align:middle; margin-right:10px;">
                    ${item.name} x${item.qty} - ₱${item.price * item.qty}
                </li>
            `;
        });

        orderDiv.innerHTML = `
            <h3>Order #${index + 1}</h3>
            <p><strong>Customer:</strong> ${order.customer.name}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Address:</strong> ${order.customer.address}</p>
            <p><strong>Payment Method:</strong> ${order.payment}</p>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Total:</strong> ₱${order.total}</p>
            <p><strong>Items:</strong></p>
            <ul style="list-style:none; padding-left:0;">
                ${itemsHTML}
            </ul>
        `;

        container.appendChild(orderDiv);
    });
}
