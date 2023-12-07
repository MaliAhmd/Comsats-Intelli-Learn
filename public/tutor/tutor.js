fetch('/fetchTutorData')
    .then(response => response.json())
    .then(data => {
        // Assuming data is an array of objects with 'tutor_name' and 'tutor_email' properties
        data.forEach(tutor => {
            // console.log('Tutor Name:', tutor.tutor_name);
            // console.log('Tutor Email:', tutor.tutor_email);
            document.querySelector(".tutor-name").value=tutor.tutor_name;
            document.querySelector(".tutor-email").value=tutor.tutor_email;
        });
    })
    .catch(error => console.error('Error fetching tutor data:', error));
// Function to submit form data
function submitForm() {
    const form = document.querySelector('form');
    const tutor_name = document.querySelector('.tutor-name').value
    const tutor_email = document.querySelector('.tutor-email').value
    const bio = document.querySelector('.bio').value
    const birthday = document.querySelector('.bir').value
    const country = document.querySelector('.country').value
    const phone_no = document.querySelector('.phno').value
    // const resume_file = document.querySelector('.res-file').value
    // const matrix_file = document.querySelector('.metric-file').value
    // const intermediate_file = document.querySelector('.inter-file').value
    // const bachelors_file= document.querySelector('.bac-file').value
    const data = {tutor_name,tutor_email,bio,birthday,country,phone_no}
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // const formData = new FormData(data);
        try {
            const response = await fetch('/saveVerifyInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Data saved successfully:', result);
            } else {
                throw new Error('Error saving data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}