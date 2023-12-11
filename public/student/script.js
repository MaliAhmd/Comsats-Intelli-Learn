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

const submitBtn = document.querySelector('.submit');
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // Prevents the default form submission
            
            const tutorEmail = document.getElementById('regno').value;
            const tutorPassword = document.querySelector('input[name="password"]').value;

            try {
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    withCredentials: true,  
                    body: JSON.stringify({
                        regno: tutorEmail,
                        password: tutorPassword
                    })
                });
                const data = await response.json();
                console.log('Response data:', data);
                // cookie.set("token",data.token)
                // document.cookie = `token=${data.token}`
                Cookies.set("token",`${data.token}`)
                const tok = Cookies.get('token')
                if(tok){
                    window.location.href = '/student/dashbaord.html'
                }
                // response.redirect('/tutor/tutor-dashboard.html');
            } catch (error) {
                // Handle fetch error
                console.error('Error:', error);
            }
        });