async function loadProducts() {
    let apiurl = 'https://fakestoreapi.com/products';
    let response = await fetch(apiurl);
    let data = await response.json();

    console.log(data);

    let tableBody = $('#productTable tbody');
    data.forEach(product => {
        let row = $('<tr>');
        $('<td>').text(product.title).appendTo(row);
        let dateCell = $('<td>').text(new Date().toLocaleDateString());
        row.append(dateCell);
        let permissionsCell = $('<td>').text('N/A');
        row.append(permissionsCell);
        let statusCell = $('<td>').text(product.rating.rate > 3 ? 'Available' : 'Out of Stock');
        row.append(statusCell);
        let priceCell = $('<td>').text(`$${product.price.toFixed(2)}`); // Corrected price formatting
        row.append(priceCell);
        row.appendTo(tableBody);
    });

    updateTotalPrice(data); // Initial total price calculation
    updateTotalProducts(data); // Initial total products count
    updateStatusCount(data); // Initial count of "Available" and "Out of Stock" products
}

function updateTotalPrice(products) {
    let totalPrice = products.reduce((acc, product) => acc + product.price, 0);
    $('#totalPrice').text(`Total: $${totalPrice.toFixed(2)}`); // Corrected string interpolation
}

function updateTotalProducts(products) {
    $('#totalProducts').text(`Total Products: ${products.length}`); // Corrected string interpolation
}

function updateStatusCount(products) {
    let availableCount = products.filter(product => product.rating.rate > 3).length;
    let outOfStockCount = products.filter(product => product.rating.rate <= 3).length;
    $('#statusCount').text(`Available: ${availableCount}, Out of Stock: ${outOfStockCount}`); // Corrected string interpolation
}

loadProducts();

// Filter functionality using jQuery
$('#nameFilter').on('keyup', function () {
    let filterValue = $(this).val().toLowerCase();

    $('#productTable tbody tr').each(function () {
        let nameCellText = $(this).find('td:first-child').text().toLowerCase();

        if (nameCellText.includes(filterValue)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    // Get visible products after filtering
    let visibleProducts = $('#productTable tbody tr:visible').map(function () {
        return {
            title: $(this).find('td:first-child').text(),
            price: parseFloat($(this).find('td:last-child').text().replace('$', '')),
            status: $(this).find('td:nth-child(4)').text().toLowerCase()
        };
    }).get();

    updateStatusCountBasedOnVisibleProducts(visibleProducts);
    updateTotalPrice(visibleProducts); // Update total price based on visible products
    updateTotalProducts(visibleProducts); // Update total products count based on visible products
    updateStatusCount(visibleProducts); // Update status count based on visible products

});

function updateStatusCountBasedOnVisibleProducts(visibleProducts) {
    let availableCount = visibleProducts.filter(product => product.status.includes('available')).length;
    let outOfStockCount = visibleProducts.filter(product => product.status.includes('out of stock')).length;
    $('#statusCount').text(`Available: ${availableCount}, Out of Stock: ${outOfStockCount}`); // Corrected string interpolation
}
