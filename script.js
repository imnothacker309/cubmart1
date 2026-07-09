const catalog = [
  { id: 1, name: "PlayStation 5 Slim Disc Edition", category: "Consoles", price: 24950, stock: 6 },
  { id: 2, name: "Xbox Series X 1TB", category: "Consoles", price: 23950, stock: 5 },
  { id: 3, name: "Nintendo Switch OLED Model", category: "Consoles", price: 17450, stock: 9 },
  { id: 4, name: "Gran Turismo 7", category: "Games", price: 2950, stock: 20 },
  { id: 5, name: "It Takes Two", category: "Games", price: 2200, stock: 18 },
  { id: 6, name: "PlayStation Store Gift Card", category: "Games", price: 1250, stock: 30 },
  { id: 7, name: "HyperX Cloud III Headset", category: "Accessories", price: 4450, stock: 14 },
  { id: 8, name: "Redragon K552 Kumara", category: "Accessories", price: 3700, stock: 11 },
  { id: 9, name: "Logitech G502 HERO Mouse", category: "Accessories", price: 1950, stock: 17 }
];

function calculateSubtotal(cart) {
  let subtotal = 0;
  for (const item of cart) {
    subtotal += item.price * item.quantity;
  }
  return subtotal;
}

function getDiscountRate(subtotal) {
  if (subtotal >= 100) return 0.15;
  if (subtotal >= 50) return 0.1;
  if (subtotal >= 25) return 0.05;
  return 0;
}

function applyPromoCode(subtotal, promoCode) {
  const code = promoCode.trim().toUpperCase();
  if (code === "LEVEL10") return subtotal * 0.1;
  if (code === "GEAR15") return 15;
  return 0;
}

function calculateTax(amount) {
  return amount * 0.14;
}

function generateReceipt(cart, promoCode) {
  const subtotal = calculateSubtotal(cart);
  const discountRate = getDiscountRate(subtotal);
  const automaticDiscount = subtotal * discountRate;
  const promoDiscount = applyPromoCode(subtotal, promoCode);
  const totalDiscount = Math.min(subtotal, automaticDiscount + promoDiscount);
  const taxableAmount = subtotal - totalDiscount;
  const tax = calculateTax(taxableAmount);
  const total = taxableAmount + tax;

  let receipt = "LevelUp Receipt\n===============\n";
  for (const item of cart) {
    const lineTotal = item.price * item.quantity;
    receipt += `${item.name} x ${item.quantity} = EGP ${lineTotal.toFixed(0)}\n`;
  }
  receipt += "----------------\n";
  receipt += `Subtotal: EGP ${subtotal.toFixed(0)}\n`;
  receipt += `Discount: -EGP ${totalDiscount.toFixed(0)}\n`;
  receipt += `Tax: EGP ${tax.toFixed(0)}\n`;
  receipt += `Total: EGP ${total.toFixed(0)}\n`;

  return receipt;
}

function buildCatalogMessage(products) {
  let message = "LevelUp Catalog\n\n";
  for (const product of products) {
    message += `${product.id}. ${product.name} | ${product.category} | EGP ${product.price.toFixed(0)} | Stock: ${product.stock}\n`;
  }
  return message;
}

function browseProducts() {
  const filter = prompt("Type a category to filter: Consoles, Games, Accessories. Leave blank to see all products.");
  if (!filter) return catalog;

  const filteredProducts = catalog.filter(function (product) {
    return product.category.toLowerCase().includes(filter.toLowerCase());
  });

  if (filteredProducts.length === 0) {
    alert("No products matched that category. Showing all products instead.");
    return catalog;
  }
  return filteredProducts;
}

function addProductsToCart() {
  const cart = [];
  let keepAdding = true;

  while (keepAdding) {
    const productsToShow = browseProducts();
    const productId = Number(prompt(buildCatalogMessage(productsToShow) + "\nEnter the product number you want to add:"));
    const selectedProduct = catalog.find(function (product) {
      return product.id === productId;
    });

    if (!selectedProduct) {
      alert("That product number is not available.");
    } else {
      const quantity = Number(prompt(`How many ${selectedProduct.name} items do you want?`));
      if (!Number.isInteger(quantity) || quantity <= 0) {
        alert("Please enter a whole number above zero.");
      } else if (quantity > selectedProduct.stock) {
        alert(`Only ${selectedProduct.stock} items are in stock.`);
      } else {
        cart.push({
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: quantity
        });
        alert(`${quantity} ${selectedProduct.name} added to your cart.`);
      }
    }
    keepAdding = confirm("Do you want to add another product?");
  }
  return cart;
}

function startOrder() {
  let repeatOrder;
  do {
    const cart = addProductsToCart();
    if (cart.length === 0) {
      alert("No products were added to the cart.");
    } else {
      const promoCode = prompt("Enter promo code LEVEL10 or GEAR15, or leave blank:") || "";
      const receipt = generateReceipt(cart, promoCode);
      const receiptOutput = document.getElementById("receiptOutput");
      if (receiptOutput) receiptOutput.textContent = receipt;
      alert(receipt);
    }
    repeatOrder = confirm("Do you want to create another order?");
  } while (repeatOrder);
}

const cart = [];
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const shippingCost = document.getElementById("shippingCost");
const cartTotal = document.getElementById("cartTotal");
const governorate = document.getElementById("governorate");
const deliveryTime = document.getElementById("deliveryTime");

function formatEgp(amount) {
  return `EGP ${Math.round(amount).toLocaleString()}`;
}

function readProduct(button) {
  const card = button.closest(".product-card");
  const name = card.querySelector("h4").textContent.trim();
  const priceText = card.querySelector("strong").textContent.replace("EGP", "").replace(/,/g, "").trim();
  const price = Number(priceText);
  return { name, price };
}

function addToCart(product) {
  const existingItem = cart.find(function (item) {
    return item.name === product.name;
  });
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: product.name, price: product.price, quantity: 1 });
  }
  updateCart();
}

function getShipping() {
  return Number(governorate.value);
}

function updateCart() {
  const itemCount = cart.reduce(function (total, item) { return total + item.quantity; }, 0);
  const subtotal = cart.reduce(function (total, item) { return total + item.price * item.quantity; }, 0);
  const shipping = itemCount > 0 ? getShipping() : 0;

  if (cartCount) {
    cartCount.textContent = itemCount;
    cartCount.classList.toggle("has-items", itemCount > 0);
  }
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = "<li>Your cart is empty right now.</li>";
    } else {
      cartItems.innerHTML = cart.map(function (item) {
        return `<li><span>${item.name} x ${item.quantity}</span><strong>${formatEgp(item.price * item.quantity)}</strong></li>`;
      }).join("");
    }
  }
  if (cartSubtotal) cartSubtotal.textContent = formatEgp(subtotal);
  if (shippingCost) shippingCost.textContent = formatEgp(shipping);
  if (cartTotal) cartTotal.textContent = formatEgp(subtotal + shipping);
}


document.querySelectorAll('.product-card .btn-outline-shop[href="#cart"]').forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    const product = readProduct(button); 
    addToCart(product); 
    showNotification(`${product.name} has been added to your cart!`);
  });
});

document.querySelectorAll('.product-card .btn-shop[href="#contact"]').forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    const product = readProduct(button);
    addToCart(product);
    showNotification(`${product.name} has been added to your cart!`);
    const checkoutSec = document.getElementById("checkout");
    if (checkoutSec) checkoutSec.scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll(".details-link").forEach(function (button) {
  button.addEventListener("click", function () {
    const card = button.closest(".product-card");
    card.classList.toggle("details-open");
    button.textContent = card.classList.contains("details-open") ? "Hide Details" : "View Details";
  });
});

if (governorate) {
  governorate.addEventListener("change", function () {
    const selectedOption = governorate.options[governorate.selectedIndex];
    if (deliveryTime) deliveryTime.textContent = selectedOption.dataset.days;
    updateCart();
  });
}

const checkoutForm = document.querySelector(".checkout-grid form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (cart.length === 0) {
      alert("Please add at least one product to your cart first.");
      return;
    }
    if (governorate.value === "0") {
      alert("Please choose your governorate so shipping can be calculated.");
      return;
    }
    alert("Order request received. We will contact you to confirm payment and delivery details.");
  });
}

updateCart();


function showNotification(message) {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    
    container.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999999 !important; display: flex; flex-direction: column; gap: 10px; pointer-events: none; font-family: sans-serif; align-items: center;";
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.textContent = message;

  toast.style.cssText = "background-color: #198754 !important; color: #ffffff !important; padding: 14px 24px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-weight: 600; font-size: 0.95rem; opacity: 0; transform: translateY(-20px); transition: all 0.4s ease-out; pointer-events: auto; display: block !important; white-space: nowrap;";

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 50);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => { toast.remove(); }, 400);
  }, 3000);
}
