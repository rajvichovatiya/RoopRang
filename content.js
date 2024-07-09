console.clear();

let contentTitle = [];

function createDynamicProductSection(product) {
  const boxDiv = document.createElement("div");
  boxDiv.classList.add("product-box");

  const boxLink = document.createElement("a");
  boxLink.href = `/contentDetails.html?id=${product.id}`;
  boxLink.classList.add("product-link");

  const imgTag = document.createElement("img");
  imgTag.src = product.api_featured_image;
  imgTag.alt = product.name;
  imgTag.classList.add("product-image");

  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("product-details");

  const h3 = document.createElement("h3");
  h3.textContent = product.name;

  const h4 = document.createElement("h4");
  h4.textContent = product.brand;

  const h2 = document.createElement("h2");
  h2.textContent = product.price > 0 ? `Rs ${product.price}` : "Not Available";

  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  boxLink.appendChild(imgTag);
  boxDiv.appendChild(boxLink);
  boxDiv.appendChild(detailsDiv);

  return boxDiv;
}


function updateBadgeFromCookie() {
  const counterMatch = document.cookie.match(/counter=(\d+)/);
  if (counterMatch) {
    const counter = counterMatch[1];
    document.getElementById("badge").textContent = counter;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderProducts(products) {
  const containerClothing = document.getElementById("containerClothing");
  containerClothing.innerHTML = '';

  products.forEach(product => {
    const productSection = createDynamicProductSection(product);
    containerClothing.appendChild(productSection);
  });
}

function applyFilter(filter) {
  let filteredProducts = contentTitle;

  if (filter !== "best") {
    filteredProducts = contentTitle.filter(product => product.product_type === filter);
  }

  shuffleArray(filteredProducts);
  const displayedProducts = filteredProducts.slice(0, 10);
  renderProducts(displayedProducts);

  const buttons = document.querySelectorAll(".filter-button");
  buttons.forEach(button => button.classList.remove("active"));

  document.querySelector(`button[onclick="applyFilter('${filter}')"]`).classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("./products.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      contentTitle = data;
      updateBadgeFromCookie();
      applyFilter('best'); // Apply default filter on load
    })
    .catch(error => {
      console.error("Fetch error:", error);
    });
});
