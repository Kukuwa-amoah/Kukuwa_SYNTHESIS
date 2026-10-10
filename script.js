/*
Name: Kukuwa Amoah
Project: Student Food Hub
*/

// MENU ARRAYS AND DISH OBJECTS

function Dish(name, price, stock, icon) {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.icon = icon;
}

// Prototype method shared by all Dish objects
Dish.prototype.describe = function () {
    return this.name + " - GHS " + this.price.toFixed(2);
};

// Food and drink arrays
const foods = [
    new Dish("Jollof Rice", 35, 10, "🍚"),
    new Dish("Waakye", 30, 8, "🍛"),
    new Dish("Fried Rice", 40, 6, "🍱"),
    new Dish("Kelewele", 15, 12, "🍌"),
    new Dish("Noodles", 20, 10, "🍜")
];

const drinks = [
    new Dish("Sobolo", 10, 15, "🥤"),
    new Dish("Asaana", 12, 10, "🧃")
];

// Demonstrate push and pop
foods.push(new Dish("Red Red", 25, 5, "🫘"));
foods.pop();

// Combine, sort and reverse the menu
const menu = foods.concat(drinks);

menu.sort(function (a, b) {
    return a.name.localeCompare(b.name);
});

menu.reverse();

console.log(
    "Menu item names:",
    menu.map(function (dish) {
        return dish.name;
    }).join(", ")
);

console.log(
    "Index of Sobolo:",
    menu.findIndex(function (dish) {
        return dish.name === "Sobolo";
    })
);

menu.forEach(function (dish) {
    console.log(dish.describe());
});

// STOCK OBJECT
const stock = {};

menu.forEach(function (dish) {
    stock[dish.name] = dish.stock;
});

// HTML ELEMENTS
const menuCards = document.getElementById("menuCards");
const mealSelect = document.getElementById("meal");
const menuMessage = document.getElementById("menuMessage");
const orderForm = document.getElementById("orderForm");
const receipt = document.getElementById("receipt");
const formError = document.getElementById("formError");

// DISPLAY THE MENU
function displayMenu() {
    menuCards.textContent = "";
    mealSelect.innerHTML = '<option value="">Select a meal</option>';

    menu.forEach(function (dish) {
        const card = document.createElement("article");
        card.className = "menu-card";

        const icon = document.createElement("div");
        icon.className = "menu-icon";
        icon.textContent = dish.icon;

        const heading = document.createElement("h3");
        heading.textContent = dish.name;

        const description = document.createElement("p");
        description.textContent = dish.describe();
        description.className = "price";

        const stockText = document.createElement("p");
        stockText.className = "stock";
        stockText.textContent =
            stock[dish.name] + " portions available";

        card.appendChild(icon);
        card.appendChild(heading);
        card.appendChild(description);
        card.appendChild(stockText);

        menuCards.appendChild(card);

        const option = document.createElement("option");
        option.value = dish.name;
        option.textContent =
            dish.name + " — GHS " + dish.price.toFixed(2);

        if (stock[dish.name] === 0) {
            option.disabled = true;
            option.textContent += " (Sold out)";
        }

        mealSelect.appendChild(option);
    });

    if (menu.every(function (dish) {
        return stock[dish.name] === 0;
    })) {
        menuMessage.textContent = "Sorry, all meals are sold out.";
    } else {
        menuMessage.textContent = "Choose from our available meals.";
    }
}

displayMenu();

// RANDOM STUDENT SURVIVAL TIPS
const tips = [
    "Create a study timetable instead of cramming everything.",
    "Track your spending to make your money last longer.",
    "Keep a quick and affordable meal available.",
    "Take short breaks during long study sessions.",
    "Get enough sleep instead of relying on all-nighters.",
    "Separate your needs from your wants when budgeting.",
    "Practise questions instead of only reading your notes."
];

document.getElementById("tipButton").addEventListener("click", function () {
    const randomIndex = Math.floor(Math.random() * tips.length);

    document.getElementById("tip").textContent = tips[randomIndex];
});

// ORDER CLASS
class Order {
    constructor() {
        this.lines = [];
    }

    add(dish, qty, extras, sizePrice) {
        this.lines.push([dish, qty, extras, sizePrice]);
        return this;
    }

    total() {
        let total = 0;

        this.lines.forEach(function (line) {
            const dish = line[0];
            const qty = line[1];
            const extras = line[2];
            const sizePrice = line[3];

            let extrasTotal = 0;

            extras.forEach(function (extra) {
                extrasTotal += extra.price;
            });

            total += (dish.price + sizePrice + extrasTotal) * qty;
        });

        return total;
    }
}

// CALCULATE ONE ORDER LINE
function lineCost(price, qty) {
    return price * qty;
}

// BUILD READABLE ORDER LINES
function orderLines(order) {
    return order.map(function (line) {
        const dish = line[0];
        const qty = line[1];
        const extras = line[2];
        const sizePrice = line[3];

        let extrasTotal = 0;

        extras.forEach(function (extra) {
            extrasTotal += extra.price;
        });

        const unitPrice = dish.price + sizePrice + extrasTotal;
        const cost = lineCost(unitPrice, qty);

        return {
            name: dish.name,
            qty: qty,
            cost: cost,
            extras: extras,
            sizePrice: sizePrice
        };
    });
}

// PROCESS THE FORM
orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    formError.textContent = "";

    const studentName =
        document.getElementById("studentName").value.trim();

    const selectedName = mealSelect.value;

    const quantity = Number(
        document.getElementById("quantity").value
    );

    const selectedDish = menu.find(function (dish) {
        return dish.name === selectedName;
    });

    if (!studentName || !selectedDish) {
        formError.textContent =
            "Please enter your name and select a meal.";
        return;
    }

    if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10
    ) {
        formError.textContent =
            "Quantity must be a whole number between 1 and 10.";
        return;
    }

    if (quantity > stock[selectedDish.name]) {
        formError.textContent =
            "Sorry, there are not enough portions available.";
        return;
    }

    const sizeOption = document.querySelector(
        'input[name="size"]:checked'
    );

    if (!sizeOption) {
        formError.textContent = "Please choose a meal size.";
        return;
    }

    const sizePrice = Number(sizeOption.dataset.price);

    const checkedExtras = document.querySelectorAll(
        'input[name="extras"]:checked'
    );

    const extras = [];

    checkedExtras.forEach(function (checkbox) {
        extras.push({
            name: checkbox.value,
            price: Number(checkbox.dataset.price)
        });
    });

    // Build the order using method chaining
    const customerOrder = new Order()
        .add(selectedDish, quantity, extras, sizePrice);

    const subtotal = customerOrder.total();
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    // Multidimensional array for order information
    const orderData = [
        [selectedDish.name, selectedDish.price, quantity]
    ];

    console.log("Order data:", orderData);
    console.log("Price of selected meal:", orderData[0][1]);

    console.log(
        "Any quantity greater than 2:",
        orderData.some(function (line) {
            return line[2] > 2;
        })
    );

    // DISPLAY THE RECEIPT
    receipt.textContent = "";

    const customerHeading = document.createElement("h3");
    customerHeading.textContent = "Order for " + studentName;
    receipt.appendChild(customerHeading);

    const itemLines = orderLines(customerOrder.lines);

    itemLines.forEach(function (line) {
        const row = document.createElement("div");
        row.className = "receipt-line";

        const description = document.createElement("span");
        description.textContent =
            line.qty + " × " + line.name;

        const cost = document.createElement("span");
        cost.textContent = "GHS " + line.cost.toFixed(2);

        row.appendChild(description);
        row.appendChild(cost);
        receipt.appendChild(row);

        if (line.sizePrice > 0) {
            const sizeText = document.createElement("p");
            sizeText.className = "receipt-note";
            sizeText.textContent =
                "Large size: +GHS " +
                (line.sizePrice * line.qty).toFixed(2);

            receipt.appendChild(sizeText);
        }

        if (line.extras.length > 0) {
            const extrasText = document.createElement("p");
            extrasText.className = "receipt-note";

            const extraNames = line.extras.map(function (extra) {
                return extra.name;
            });

            extrasText.textContent =
                "Extras: " + extraNames.join(", ");

            receipt.appendChild(extrasText);
        }
    });

    const subtotalRow = document.createElement("div");
    subtotalRow.className = "receipt-line";
    subtotalRow.textContent =
        "Subtotal: GHS " + subtotal.toFixed(2);
    receipt.appendChild(subtotalRow);

    const taxRow = document.createElement("div");
    taxRow.className = "receipt-line";
    taxRow.textContent =
        "Tax (15%): GHS " + tax.toFixed(2);
    receipt.appendChild(taxRow);

    const totalRow = document.createElement("div");
    totalRow.className = "receipt-total";
    totalRow.textContent =
        "Total: GHS " + total.toFixed(2);
    receipt.appendChild(totalRow);

    const instructions =
        document.getElementById("instructions").value.trim();

    if (instructions) {
        const instructionText = document.createElement("p");
        instructionText.className = "receipt-note";
        instructionText.textContent =
            "Instructions: " + instructions;
        receipt.appendChild(instructionText);
    }

    const confirmation = document.createElement("p");
    confirmation.className = "notice";
    confirmation.textContent =
        "Thank you, " + studentName + "! Your order has been prepared.";
    receipt.appendChild(confirmation);

    // Reduce stock after a successful order
    stock[selectedDish.name] -= quantity;
    selectedDish.stock = stock[selectedDish.name];

    displayMenu();

    console.log("Subtotal:", subtotal);
    console.log("Tax:", tax);
    console.log("Total:", total);
});

// CLEAR THE RECEIPT WHEN THE FORM IS RESET
orderForm.addEventListener("reset", function () {
    window.setTimeout(function () {
        receipt.textContent =
            "Your receipt will appear here after you place your order.";
        formError.textContent = "";
    }, 0);
});