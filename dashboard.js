document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    const addBillButton = document.getElementById('addBillButton');
    const viewBillsButton = document.getElementById('viewBills');
    const searchBillsButton = document.getElementById('searchBills');
    const addSupplierButton = document.getElementById('addSupplier');
    const showTotalsButton = document.getElementById('showTotals');
    const viewSuppliersButton = document.getElementById('viewSuppliers');
    const billSection = document.getElementById('billSection');
    const totalsSection = document.getElementById('totalsSection');
    const searchSection = document.getElementById('searchSection');
    const supplierSection = document.getElementById('supplierSection');
    const addBillSection = document.getElementById('addBillSection');
    const addSupplierSection = document.getElementById('addSupplierSection');
    const billsTableBody = document.getElementById('billsTableBody');
    const suppliersTableBody = document.getElementById('suppliersTableBody');
    const totalAmount = document.getElementById('totalAmount');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const addBillForm = document.getElementById('addBillForm');
    const addSupplierForm = document.getElementById('addSupplierForm');
    const itemsSection = document.getElementById('itemsSection');
    const loadingSpinnerBill = document.getElementById('loadingSpinnerBill');
    const loadingSpinnerSupplier = document.getElementById('loadingSpinnerSupplier');
    const billImageInput = document.getElementById('billImage');

    let bills = JSON.parse(localStorage.getItem('bills')) || [];
    let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
    let items = [];

    // Function to render Bills
    const renderBills = () => {
        billsTableBody.innerHTML = '';
        bills.forEach((bill, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${bill.shopName || ''}</td>
                <td>${bill.amount || ''}</td>
                <td>${bill.billDate || ''}</td>
                <td><button class="deleteBillButton" data-index="${index}" data-id="${bill.id}">Delete</button></td>
            `;
            billsTableBody.appendChild(row);
        });

        // Delete Bill button functionality
        document.querySelectorAll('.deleteBillButton').forEach(button => {
            button.addEventListener('click', (e) => {
                const billIndex = e.target.getAttribute('data-index');
                bills.splice(billIndex, 1);
                localStorage.setItem('bills', JSON.stringify(bills));
                renderBills();
            });
        });
    };

    // Function to render Suppliers
    const renderSuppliers = () => {
        suppliersTableBody.innerHTML = '';
        suppliers.forEach((supplier, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${supplier.supplierName || ''}</td>
                <td>${supplier.supplierContact || ''}</td>
                <td>${supplier.supplierShop || ''}</td>
                <td><button class="deleteSupplierButton" data-index="${index}">Delete</button></td>
            `;
            suppliersTableBody.appendChild(row);
        });

        // Delete Supplier button functionality
        document.querySelectorAll('.deleteSupplierButton').forEach(button => {
            button.addEventListener('click', (e) => {
                const supplierIndex = e.target.getAttribute('data-index');
                suppliers.splice(supplierIndex, 1);
                localStorage.setItem('suppliers', JSON.stringify(suppliers));
                renderSuppliers();
            });
        });
    };

    // Function to calculate and show the total amount of the bills
    const calculateTotal = () => {
        const total = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
        totalAmount.textContent = `Total Amount: $${total.toFixed(2)}`;
    };

    // Function to search bills
    const searchBills = (query) => {
        searchResults.innerHTML = '';
        const filteredBills = bills.filter(bill => bill.shopName.toLowerCase().includes(query.toLowerCase()));
        filteredBills.forEach((bill, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${bill.shopName || ''}</td>
                <td>${bill.amount || ''}</td>
                <td>${bill.billDate || ''}</td>
            `;
            searchResults.appendChild(row);
        });
    };

    // Handle navigation between sections
    logoutButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    addBillButton.addEventListener('click', () => {
        billSection.style.display = 'none';
        totalsSection.style.display = 'none';
        searchSection.style.display = 'none';
        supplierSection.style.display = 'none';
        addBillSection.style.display = 'block';
        addSupplierSection.style.display = 'none';
    });

    viewBillsButton.addEventListener('click', () => {
        billSection.style.display = 'block';
        totalsSection.style.display = 'none';
        searchSection.style.display = 'none';
        supplierSection.style.display = 'none';
        addBillSection.style.display = 'none';
        addSupplierSection.style.display = 'none';
    });

    viewSuppliersButton.addEventListener('click', () => {
        billSection.style.display = 'none';
        totalsSection.style.display = 'none';
        searchSection.style.display = 'none';
        supplierSection.style.display = 'block';
        addBillSection.style.display = 'none';
        addSupplierSection.style.display = 'none';
    });

    showTotalsButton.addEventListener('click', () => {
        calculateTotal();
        billSection.style.display = 'none';
        totalsSection.style.display = 'block';
        searchSection.style.display = 'none';
        supplierSection.style.display = 'none';
        addBillSection.style.display = 'none';
        addSupplierSection.style.display = 'none';
    });

    searchBillsButton.addEventListener('click', () => {
        billSection.style.display = 'none';
        totalsSection.style.display = 'none';
        searchSection.style.display = 'block';
        supplierSection.style.display = 'none';
        addBillSection.style.display = 'none';
        addSupplierSection.style.display = 'none';
    });

    addSupplierButton.addEventListener('click', () => {
        billSection.style.display = 'none';
        totalsSection.style.display = 'none';
        searchSection.style.display = 'none';
        supplierSection.style.display = 'none';
        addBillSection.style.display = 'none';
        addSupplierSection.style.display = 'block';
    });

    // Function to add new item
    document.getElementById('addMoreItemsButton').addEventListener('click', () => {
        const itemName = prompt("Enter Item Name:");
        const itemQuantity = prompt("Enter Quantity:");
        const itemPrice = prompt("Enter Price per Item:");

        if (itemName && itemQuantity && itemPrice) {
            const totalAmount = itemQuantity * itemPrice;

            // Store the item in the items array
            items.push({ itemName, itemQuantity, itemPrice, totalAmount });

            // Update the total amount for the bill
            updateTotalAmount();
        } else {
            alert("Please provide valid details for the item.");
        }
    });

    // Function to update the total amount of the bill
    const updateTotalAmount = () => {
        let totalAmount = 0;
        items.forEach(item => {
            totalAmount += item.totalAmount;
        });
        document.getElementById('amount').value = totalAmount; // Update the Amount field
    };

    // Function to convert image file to base64 string
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    // Add Supplier Form Submission
    addSupplierForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loadingSpinnerSupplier.style.display = 'block'; // Show loading spinner

        const formData = new FormData(e.target);
        formData.append('type', 'supplier');

        fetch('https://script.google.com/macros/s/AKfycbzCG3VDVwpdXnoePQuY6WPOW3zkV3X5Qrz4zsWQzc3Z08ZFJI0-rUvOHYS5Nc_YV9dL/exec', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            suppliers.push(Object.fromEntries(formData)); // Add the new supplier to the list
            localStorage.setItem('suppliers', JSON.stringify(suppliers)); // Save to localStorage
            renderSuppliers(); // Re-render the suppliers list
            e.target.reset();
            loadingSpinnerSupplier.style.display = 'none'; // Hide loading spinner
        })
        .catch(error => {
            console.error('Error:', error);
            loadingSpinnerSupplier.style.display = 'none'; // Hide loading spinner if there's an error
        });
    });

    // Add Bill Form Submission
    addBillForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingSpinnerBill.style.display = 'block'; // Show loading spinner

        const formData = new FormData(e.target);
        formData.append('type', 'bill');

        // Add items to formData as a single string with newline characters
        const itemsString = items.map(item => `Name: ${item.itemName}, Qty: ${item.itemQuantity}, Price: ${item.itemPrice}, Total: ${item.totalAmount}`).join('\n');
        formData.append('items', itemsString);

        // Handle the image file input
        const file = billImageInput.files[0];
        if (file) {
            const base64Image = await getBase64(file);
            formData.append('base64Image', base64Image);
            formData.append('imageName', file.name);
            formData.append('imageType', file.type);
        }

        // Send form data to the server
        fetch('https://script.google.com/macros/s/AKfycbzCG3VDVwpdXnoePQuY6WPOW3zkV3X5Qrz4zsWQzc3Z08ZFJI0-rUvOHYS5Nc_YV9dL/exec', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            bills.push(Object.fromEntries(formData)); // Add the new bill to the list
            localStorage.setItem('bills', JSON.stringify(bills)); // Save to localStorage
            renderBills(); // Re-render the bills list
            e.target.reset();
            items = []; // Reset items array
            loadingSpinnerBill.style.display = 'none'; // Hide loading spinner
        })
        .catch(error => {
            console.error('Error:', error);
            loadingSpinnerBill.style.display = 'none'; // Hide loading spinner if there's an error
        });
    });

    renderBills();
    renderSuppliers();
});
