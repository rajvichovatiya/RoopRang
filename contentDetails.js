console.clear();

// Function to load components (header and footer)
function loadComponent(url, elementId) {
    let req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    document.getElementById(elementId).innerHTML = req.responseText;
}


// Function to dynamically create and populate product details
function dynamicContentDetails(product) {
    let mainContainer = document.createElement('div');
    mainContainer.id = 'containerD';
    document.getElementById('containerProduct').appendChild(mainContainer);

    // Creating image section
    let imageSectionDiv = document.createElement('div');
    imageSectionDiv.id = 'imageSection';

    let imgTag = document.createElement('img');
    imgTag.id = 'imgDetails';
    imgTag.src = product.api_featured_image;

    imageSectionDiv.appendChild(imgTag);

    // Creating product details section
    let productDetailsDiv = document.createElement('div');
    productDetailsDiv.id = 'productDetails';

    let h1 = document.createElement('h1');
    h1.textContent = product.name;

    let h4Brand = document.createElement('h4');
    h4Brand.textContent = 'Brand: ' + product.brand;

    let h4Category = document.createElement('h4');
    h4Category.textContent = 'Category: ' + product.category;

    let h3Price = document.createElement('h3');
    h3Price.textContent = 'Price: ' + 'Rs. ' + product.price;

     // Creating product description with read more functionality
     let pDescription = document.createElement('p');
     pDescription.classList.add('product-description');
     pDescription.textContent = truncateText(product.description, 200); // Truncate description to 200 characters initially
 
     let readMoreLink = document.createElement('a');
     readMoreLink.href = '#';
     readMoreLink.textContent = 'Read More';
     readMoreLink.classList.add('read-more-link');
     readMoreLink.onclick = function() {
         if (pDescription.classList.contains('expanded')) {
             pDescription.textContent = truncateText(product.description, 200);
             readMoreLink.textContent = 'Read More';
             pDescription.classList.remove('expanded');
         } else {
             pDescription.textContent = product.description;
             readMoreLink.textContent = 'Read Less';
             pDescription.classList.add('expanded');
         }
     };

    // Creating color options section
    let colorSectionDiv = document.createElement('div');
    colorSectionDiv.id = 'colorSection';

    let h3Colors = document.createElement('h3');
    h3Colors.textContent = 'Available Colors:';

    let ulColors = document.createElement('ul');
    ulColors.classList.add('color-list');

    // Loop through product_colors array to create color swatches or names
    product.product_colors.forEach(color => {
        let liColor = document.createElement('li');
    
        // Create a div for the color swatch
        let colorSwatch = document.createElement('div');
        colorSwatch.classList.add('color-swatch');
        colorSwatch.style.backgroundColor = color.hex_value;
    
        liColor.appendChild(colorSwatch);
        ulColors.appendChild(liColor);
    });

    colorSectionDiv.appendChild(h3Colors);
    colorSectionDiv.appendChild(ulColors);

    let buttonDiv = document.createElement('div')
    buttonDiv.id = 'button'

    let buttonTag = document.createElement('button')
    buttonDiv.appendChild(buttonTag)

    buttonText = document.createTextNode('Add to Cart')
    buttonTag.onclick  =   function()
    {
        let order = id+" "
        let counter = 1
        if(document.cookie.indexOf(',counter=')>=0)
        {
            order = id + " " + document.cookie.split(',')[0].split('=')[1]
            counter = Number(document.cookie.split(',')[1].split('=')[1]) + 1
        }
        document.cookie = "orderId=" + order + ",counter=" + counter
        document.getElementById("badge").innerHTML = counter
        console.log(document.cookie)
    }
    buttonTag.appendChild(buttonText)

    // Appending elements to product details section
    productDetailsDiv.appendChild(h1);
    productDetailsDiv.appendChild(h4Brand);
    productDetailsDiv.appendChild(h4Category);
    productDetailsDiv.appendChild(h3Price);
    productDetailsDiv.appendChild(pDescription);
    productDetailsDiv.appendChild(readMoreLink);
    productDetailsDiv.appendChild(colorSectionDiv);
    productDetailsDiv.appendChild(buttonDiv)

    // Appending image section and product details to main container
    mainContainer.appendChild(imageSectionDiv);
    mainContainer.appendChild(productDetailsDiv);

    return mainContainer;
}

// Function to truncate text
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Function to find product by ID in the JSON data
function findProductById(products, id) {
    return products.find(function(product) {
        return product.id === +id;
    });
}

// Fetching product details based on ID from local JSON file
let id = location.search.split('?id=')[1];
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        let productsData = JSON.parse(this.responseText);
        let product = findProductById(productsData, id);
        if (product) {
            dynamicContentDetails(product);
        } else {
            console.error('Product not found');
        }
    }
};
httpRequest.open('GET', 'products.json', true);
httpRequest.send();
