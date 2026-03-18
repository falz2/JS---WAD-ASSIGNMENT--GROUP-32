// PRODUCT LIST
//USE OF OBJECTS WITH ARRAYS

const products = [
  {
    id: 1,
    name:     "SAMBA",
    price:    850,
    category: "SHOES",
    image:    "images/NIKE.jpg"       
  },
  {
    id: 2,
    name:     "CROSSBAGS",
    price:    1999,
    category: "BAGS",
    image:    "images/KANGAROO.jpg"      
  },
  {
    id: 3,
    name:     "WIGS",
    price:    349,
    category: "Facial",
    image:    "images/wig.jpg"   
  },
  {
    id: 4,
    name:     "Leather Sneakers",
    price:    120,
    category: "Fashion",
    image:    "images/N.jpg"     
  },
  {
    id: 5,
    name:     "GLASSES",
    price:    85,
    category: "Fashion",
    image:    "images/GLASSES.jpeg"       
  },
  {
    id: 6,
    name:     "HUBLOT",
    price:    40,
    category: "Niche",
    image:    "images/WATCHES.jpg"    
  },
  
];


// USING LOCAL STORAGE
// CART HELPERS  –  save and load cart using localStorage


// Load cart from localStorage
function getCart() {
  try {
    var data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}


// ================================================================
// CART BADGE  –  show number of items in the navbar
// ================================================================
function updateBadge() {
  var cart  = getCart();
  var total = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
  var badge = document.getElementById("cart-count");
  if (badge) badge.textContent = total;
}


// TOAST  –  small pop-up notification at the bottom

function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function() { toast.classList.remove("show"); }, 2500);
}


// ================================================================
// HOME PAGE  –  show products, search, filter by category
// ================================================================

// Draw product cards on screen
function renderProducts(list) {
  var grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = ""; // Clear old cards first

  if (list.length === 0) {
    grid.innerHTML = '<p class="empty-msg">No products found.</p>';
    return;
  }

  list.forEach(function(product) {

    // Create a new card div
    var card = document.createElement("div");
    card.className = "product-card";

    // Fill card with image, name, category, price and button
    card.innerHTML =
      '<img src="'  + product.image    + '" alt="' + product.name + '" class="product-img" />' +
      '<h3>'        + product.name     + '</h3>' +
      '<p class="category">' + product.category + '</p>' +
      '<p class="price">$'  + product.price     + '</p>' +
      '<button onclick="addToCart(' + product.id + ')">🛒 Add to Cart</button>';

    grid.appendChild(card); // Add card to the page
  });
}

// Add a product to the cart
function addToCart(productId) {
  var product = products.find(function(p) { return p.id === productId; });
  if (!product) return;

  var cart     = getCart();
  var existing = cart.find(function(i) { return i.id === productId; });

  if (existing) {
    existing.quantity += 1;       // Product already in cart — increase quantity
  } else {
    cart.push({                   // New product — add it to cart
      id:       product.id,
      name:     product.name,
      price:    product.price,
      image:    product.image,    // Save image path so it shows in cart
      quantity: 1
    });
  }

  saveCart(cart);
  updateBadge();
  showToast("✅ " + product.name + " added to cart!");
}

// Set up the search box and filter buttons
function initHomePage() {
  if (!document.getElementById("product-grid")) return;

  var currentCategory = "All";
  var searchText      = "";

  // Filter and redraw products
  function applyFilters() {
    var result = products;

    if (currentCategory !== "All") {
      result = result.filter(function(p) { return p.category === currentCategory; });
    }

    if (searchText !== "") {
      result = result.filter(function(p) {
        return p.name.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    renderProducts(result);
  }

  // Listen for typing in the search box
  var searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      searchText = searchInput.value;
      applyFilters();
    });
  }

  // Listen for category button clicks
  var filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      filterBtns.forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      applyFilters();
    });
  });

  applyFilters(); // Show all products when page first loads
}


// ================================================================
// CART PAGE  –  show cart items, change quantity, remove items
// ================================================================
function renderCartPage() {
  var container = document.getElementById("cart-items");
  var summary   = document.getElementById("cart-summary");
  if (!container) return;

  var cart = getCart();
  container.innerHTML = "";

  // Show message if cart is empty
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-msg">Your cart is empty. <a href="index.html">Shop now</a></p>';
    if (summary) summary.innerHTML = "";
    return;
  }

  // Draw each cart item
  cart.forEach(function(item) {
    var div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML =
      '<img src="' + item.image + '" alt="' + item.name + '" class="cart-img" />' +
      '<div class="item-info">' +
        '<div class="item-name">'  + item.name  + '</div>' +
        '<div class="item-price">$' + (item.price * item.quantity) + '</div>' +
      '</div>' +
      '<div class="qty-controls">' +
        '<button class="qty-btn" onclick="changeQty(' + item.id + ', -1)">−</button>' +
        '<span  class="qty-value">' + item.quantity + '</span>' +
        '<button class="qty-btn" onclick="changeQty(' + item.id + ',  1)">+</button>' +
      '</div>' +
      '<button class="remove-btn" onclick="removeItem(' + item.id + ')">🗑 Remove</button>';

    container.appendChild(div);
  });

  // Calculate and show the order total
  var subtotal = cart.reduce(function(sum, i) { return sum + i.price * i.quantity; }, 0);
  var shipping = subtotal > 500 ? 0 : 15;
  var total    = subtotal + shipping;

  summary.innerHTML =
    '<h3>Order Summary</h3>' +
    '<div class="summary-row"><span>Subtotal</span><span>$' + subtotal + '</span></div>' +
    '<div class="summary-row"><span>Shipping</span><span>' + (shipping === 0 ? "FREE" : "$" + shipping) + '</span></div>' +
    '<div class="summary-row total"><span>Total</span><span>$' + total + '</span></div>' +
    '<a class="checkout-link" href="checkout.html">Proceed to Checkout</a>';
}

// Increase or decrease item quantity
function changeQty(productId, delta) {
  var cart = getCart();
  var item = cart.find(function(i) { return i.id === productId; });
  if (!item) return;

  item.quantity += delta;

  // If quantity drops to 0, remove the item completely
  if (item.quantity <= 0) {
    cart = cart.filter(function(i) { return i.id !== productId; });
  }

  saveCart(cart);
  updateBadge();
  renderCartPage();
}

// Remove an item from the cart
function removeItem(productId) {
  var cart    = getCart();
  var updated = cart.filter(function(i) { return i.id !== productId; });
  saveCart(updated);
  updateBadge();
  renderCartPage();
  showToast("🗑️ Item removed");
}


// ================================================================
// CHECKOUT PAGE  –  order summary + form validation
// ================================================================

// Show the list of items being ordered
function renderCheckoutSummary() {
  var itemsDiv = document.getElementById("checkout-items");
  var totalDiv = document.getElementById("order-total");
  if (!itemsDiv) return;

  var cart     = getCart();
  var subtotal = 0;
  itemsDiv.innerHTML = "";

  if (cart.length === 0) {
    itemsDiv.innerHTML = '<p style="color:#888">No items in cart.</p>';
    return;
  }

  cart.forEach(function(item) {
    var row       = document.createElement("div");
    row.className = "checkout-row";
    var lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    row.innerHTML =
      '<span>' +
        '<img src="' + item.image + '" class="checkout-img" />' +
        item.name + ' ×' + item.quantity +
      '</span>' +
      '<span>$' + lineTotal + '</span>';

    itemsDiv.appendChild(row);
  });

  totalDiv.innerHTML =
    '<span>Total</span><span>$' + subtotal + '</span>';
}

// Validate the delivery form before placing order
function validateForm() {
  var valid = true;

  function check(fieldId, errorId, condition, message) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);
    if (!condition) {
      field.classList.add("invalid");
      error.textContent = message;
      valid = false;
    } else {
      field.classList.remove("invalid");
      error.textContent = "";
    }
  }

  var name    = document.getElementById("full-name").value.trim();
  var email   = document.getElementById("email").value.trim();
  var phone   = document.getElementById("phone").value.trim();
  var address = document.getElementById("address").value.trim();

  check("full-name", "error-name",    name    !== "",                             "Name is required.");
  check("email",     "error-email",   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),  "Enter a valid email.");
  check("phone",     "error-phone",   /^[+\d\s\-()]{7,}$/.test(phone),           "Enter a valid phone number.");
  check("address",   "error-address", address !== "",                             "Address is required.");

  return valid;
}

// Wire up the Place Order button
function initCheckoutPage() {
  var btn = document.getElementById("place-order-btn");
  if (!btn) return;

  renderCheckoutSummary();

  btn.addEventListener("click", function() {

    // Stop if cart is empty
    var cart = getCart();
    if (cart.length === 0) {
      showToast("❌ Your cart is empty!");
      return;
    }

    // Stop if any form field is invalid
    if (!validateForm()) return;

    // Hide the form and show the success message
    var fields = document.querySelectorAll(
      ".checkout-form label, .checkout-form input, .checkout-form textarea, .checkout-form .error"
    );
    fields.forEach(function(el) { el.style.display = "none"; });
    btn.style.display = "none";

    document.getElementById("order-success").classList.remove("hidden");

    // Clear the cart after successful order
    saveCart([]);
    updateBadge();
  });
}


// ================================================================
// START  –  runs once the page has fully loaded
// ================================================================
document.addEventListener("DOMContentLoaded", function() {
  updateBadge();       // Update cart count badge on every page
  initHomePage();      // Home page only
  renderCartPage();    // Cart page only
  initCheckoutPage();  // Checkout page only
});
