// login hyphen validatiion
// Get the input element
const registrationInput = document.getElementById('regno');

// Add an input event listener to the input field
registrationInput.addEventListener('input', formatRegistrationNumber);

function formatRegistrationNumber() {
  // Remove any existing hyphens
  let formattedValue = registrationInput.value.replace(/-/g, '');

  // Insert hyphens at the desired positions
  if (formattedValue.length >= 4 && formattedValue.charAt(4) !== '-') {
    formattedValue = formattedValue.slice(0, 4) + '-' + formattedValue.slice(4);
  }
  if (formattedValue.length >= 8 && formattedValue.charAt(8) !== '-') {
    formattedValue = formattedValue.slice(0, 8) + '-' + formattedValue.slice(8);
  }

  // Set the formatted value back into the input field
  registrationInput.value = formattedValue.toUpperCase();
}
// signup hyphen validatiion
// Get the input element
const registrationInput1 = document.getElementById('regno1');

// Add an input event listener to the input field
registrationInput1.addEventListener('input', formatRegistrationNumber1);

function formatRegistrationNumber1() {
  // Remove any existing hyphens
  let formattedValue1 = registrationInput1.value.replace(/-/g, '');

  // Insert hyphens at the desired positions
  if (formattedValue1.length >= 4 && formattedValue1.charAt(4) !== '-') {
    formattedValue1 = formattedValue1.slice(0, 4) + '-' + formattedValue1.slice(4);
  }
  if (formattedValue1.length >= 8 && formattedValue1.charAt(8) !== '-') {
    formattedValue1 = formattedValue1.slice(0, 8) + '-' + formattedValue1.slice(8);
  }

  // Set the formatted value back into the input field
  registrationInput1.value = formattedValue1.toUpperCase();
}



  function showTutorDetails() {
          fetch('/show-tutors-details') // Replace this with your backend route
              .then(response => response.json())
              .then(data => {
                  const tableBody = document.getElementById('tableBody');
                  tableBody.innerHTML = ''; // Clear previous data
                  
                  data.forEach(tutor => {
                      const row = document.createElement('tr');
                      row.innerHTML = `
                          <td>${tutor.tutor_name}</td>
                          <td>${tutor.tutor_subject}</td>
                          <td>${tutor.tutor_email}</td>
                          <td><button class="btn btn-approve">Enroll</button></td>
                          <!-- Add other table data here based on your fetched columns -->
                      `;
                      tableBody.appendChild(row);
                  });
              })
              .catch(error => console.error('Error:', error));
      }
document.addEventListener('DOMContentLoaded', function() {
    console.log("Test")
    showTutorDetails();
    });