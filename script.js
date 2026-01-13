const API_URL = "https://fakestoreapi.com/products";

const productsDiv = document.getElementById("products");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const form = document.getElementById("productForm");
const searchInput = document.getElementById("search");

let products = [];
let editId = null;

/* FETCH ALL PRODUCTS */
async function fetchProducts() {
    try {
        loading.style.display = "block";
        const res = await fetch(API_URL);
        products = await res.json();
        displayProducts(products);
    } catch (error) {
        errorDiv.innerText = "Failed to load products";
    } finally {
        loading.style.display = "none";
    }
}

/* DISPLAY PRODUCTS */
function displayProducts(data) {
    productsDiv.innerHTML = "";
    data.forEach(product => {
        const div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
            <img src="${product.image}" />
            <h4>${product.title}</h4>
            <p>₹ ${product.price}</p>
            <p>${product.category}</p>
            <button onclick="editProduct(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
        `;

        productsDiv.appendChild(div);
    });
}

/* ADD OR UPDATE PRODUCT */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productData = {
        title: title.value,
        price: price.value,
        category: category.value,
        image: image.value,
        description: description.value
    };

    try {
        if (editId) {
            await fetch(`${API_URL}/${editId}`, {
                method: "PUT",
                body: JSON.stringify(productData),
                headers: { "Content-Type": "application/json" }
            });
            editId = null;
        } else {
            await fetch(API_URL, {
                method: "POST",
                body: JSON.stringify(productData),
                headers: { "Content-Type": "application/json" }
            });
        }

        form.reset();
        fetchProducts();
    } catch {
        alert("Error saving product");
    }
});

/* EDIT PRODUCT */
function editProduct(id) {
    const product = products.find(p => p.id === id);

    title.value = product.title;
    price.value = product.price;
    category.value = product.category;
    image.value = product.image;
    description.value = product.description;

    editId = id;
}

/* DELETE PRODUCT */
async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchProducts();
    } catch {
        alert("Error deleting product");
    }
}

/* SEARCH */
searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const filtered = products.filter(p =>
        p.title.toLowerCase().includes(value)
    );
    displayProducts(filtered);
});

/* INITIAL LOAD */
fetchProducts();