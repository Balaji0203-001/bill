const baseUrl = 'https://script.google.com/macros/s/AKfycbzCG3VDVwpdXnoePQuY6WPOW3zkV3X5Qrz4zsWQzc3Z08ZFJI0-rUvOHYS5Nc_YV9dL/exec'; // Replace with your actual deployed script URL

// Function to fetch and display bills and suppliers
function fetchBillsAndSuppliers() {
  fetch(`${baseUrl}`)
    .then(response => response.json())
    .then(data => {
      // Update the bills and suppliers tables dynamically
      updateBillsTable(data.bills);
      updateSuppliersTable(data.suppliers);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Function to update the bills table
function updateBillsTable(bills) {
  const billsTableBody = document.getElementById('billsTableBody');
  billsTableBody.innerHTML = ''; // Clear existing bills

  bills.forEach(bill => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${bill.billId}</td>
      <td>${bill.shopName}</td>
      <td>${bill.paidBy}</td>
      <td>${bill.returnPaidBy}</td>
      <td>${bill.amount}</td>
      <td>${bill.billDate}</td>
      <td><button class="view-button" onclick="viewBillImage('${bill.billImage}')">View Image</button></td>
    `;
    billsTableBody.appendChild(row);
  });
}

// Function to update the suppliers table
function updateSuppliersTable(suppliers) {
  const suppliersTableBody = document.getElementById('suppliersTableBody');
  suppliersTableBody.innerHTML = ''; // Clear existing suppliers

  suppliers.forEach(supplier => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${supplier.supplierId}</td>
      <td>${supplier.supplierName}</td>
      <td>${supplier.supplierContact}</td>
      <td>${supplier.supplierShop}</td>
      <td><a href="${supplier.supplierAddress}" target="_blank">View Address</a></td>
      <td><button class="delete-button" onclick="deleteSupplier('${supplier.supplierId}')">Delete</button></td>
    `;
    suppliersTableBody.appendChild(row);
  });
}

// Function to add a new bill
function addBill(event) {
  event.preventDefault();
  const formData = new FormData(document.getElementById('addBillForm'));
  formData.append('type', 'bill'); // Indicate that it's a bill

  const fileInput = document.getElementById('billImage');
  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64Image = reader.result.split(',')[1]; // Get the base64 image string
      formData.append('base64Image', base64Image);
      formData.append('imageName', fileInput.files[0].name);
      formData.append('imageType', fileInput.files[0].type);

      sendBillData(formData); // Send the data
    };
    reader.readAsDataURL(fileInput.files[0]);  // Read the image as base64
  } else {
    sendBillData(formData); // Send without image
  }
}

// Function to send bill data to Google Apps Script
function sendBillData(formData) {
  document.getElementById('loadingSpinnerBill').style.display = 'block'; // Show loading spinner

  fetch(baseUrl, {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(result => {
    document.getElementById('loadingSpinnerBill').style.display = 'none'; // Hide loading spinner
    alert(result); // Notify the user
    fetchBillsAndSuppliers(); // Refresh the data after adding the bill
  })
  .catch(error => {
    document.getElementById('loadingSpinnerBill').style.display = 'none';
    console.error('Error adding bill:', error);
  });
}

// Function to add a new supplier
function addSupplier(event) {
  event.preventDefault();
  const formData = new FormData(document.getElementById('addSupplierForm'));
  formData.append('type', 'supplier'); // Indicate that it's a supplier

  fetch(baseUrl, {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(result => {
    alert(result);  // Notify the user that the supplier was added successfully
    fetchBillsAndSuppliers();  // Refresh the data after adding the supplier
  })
  .catch(error => {
    console.error('Error adding supplier:', error);
  });
}

// Function to view the bill image
function viewBillImage(imageUrl) {
  window.open(imageUrl, '_blank');
}

// Function to delete a supplier (implementation may vary depending on your Apps Script setup)
function deleteSupplier(supplierId) {
  if (confirm('Are you sure you want to delete this supplier?')) {
    fetch(`${baseUrl}?delete=true&supplierId=${supplierId}`)
      .then(response => response.text())
      .then(result => {
        alert(result);  // Notify the user that the supplier was deleted
        fetchBillsAndSuppliers();  // Refresh the data
      })
      .catch(error => {
        console.error('Error deleting supplier:', error);
      });
  }
}

// Function to switch between sections (show/hide content)
function showSection(sectionId) {
  const sections = document.querySelectorAll('.card');
  sections.forEach(section => {
    section.style.display = 'none';  // Hide all sections
  });

  document.getElementById(sectionId).style.display = 'block'; // Show the selected section
}

// Function to initialize the page and setup event listeners
function initialize() {
  fetchBillsAndSuppliers(); // Fetch the data when the page loads

  // Event listeners for menu items
  document.getElementById('viewBills').addEventListener('click', () => {
    showSection('billSection'); // Show bills section
  });

  document.getElementById('viewSuppliers').addEventListener('click', () => {
    showSection('supplierSection'); // Show suppliers section
  });

  document.getElementById('addBillButton').addEventListener('click', () => {
    showSection('addBillSection'); // Show add bill form
  });

  document.getElementById('addSupplier').addEventListener('click', () => {
    showSection('addSupplierSection'); // Show add supplier form
  });

  // Event listeners for form submissions
  document.getElementById('addBillForm').addEventListener('submit', addBill);
  document.getElementById('addSupplierForm').addEventListener('submit', addSupplier);

  // Initial section visibility
  showSection('billSection'); // Default section to show
}

// Run the initialization when the page is ready
window.addEventListener('DOMContentLoaded', initialize);
