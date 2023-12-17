 // Declare getdetail variable outside the event listener scope
 let getdetail;

 
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission

            try {
                const tutorEmail = document.getElementById('email').value;
                const tutorPassword = document.querySelector('input[name="tutor_password"]').value;

                const response = await fetch('http://localhost:5000/tutor-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    withCredentials: true,
                    body: JSON.stringify({
                        tutor_email: tutorEmail,
                        tutor_password: tutorPassword
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Login failed:', errorData.error);
                    return;
                }

                const data = await response.json();
                
                console.log('Login Data idddddd:', data.result[0].id)
                const id = data.result[0].id
                Cookies.set("token", `${data.token}`);
                const tok = Cookies.get('token');
                if (tok) {
                    window.location.href = `/tutor/tutor-dashboard.html?id=${id}`;
                    console.log(getdetail)
                    getdetail =  data;

                    resolveGetDetail(data);
                    // getTutorData();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    } else {
        console.error('Form element not found');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const signoutLink = document.getElementById('signoutLink');

        if (signoutLink) {
        signoutLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior

        fetch('/tutor-logout', {
            method: 'GET',
        })
        .then(response => {
            // console.log('Logout request sent successfully');
            window.location.href = '/public/tutor/t_index.html'; // Redirect after logout
            toastr.success('in COMSATS Intelli-Learn','Please fill in all fields')
            Cookies.remove('token');
            console.log(response)
        })
        .catch(error => {
            console.error('Error sending logout request:', error);
        });
    });
} else {
    console.error('Signout link not found');
}
});




        
    // Function to submit form data
    // function submitForm() {
    //     const form = document.querySelector('form');
    //     const tutor_name = document.querySelector('.tutor-name').value
    //     const tutor_email = document.querySelector('.tutor-email').value
    //     const bio = document.querySelector('.bio').value
    //     const birthday = document.querySelector('.bir').value
    //     const country = document.querySelector('.country').value
    //     const phone_no = document.querySelector('.phno').value
    //     const resume_file = document.querySelector('.res-file').value
    //     const matrix_file = document.querySelector('.metric-file').value
    //     const intermediate_file = document.querySelector('.inter-file').value
    //     const bachelors_file= document.querySelector('.bac-file').value
    //     const data = {tutor_name,tutor_email,bio,birthday,country,phone_no,resume_file,matrix_file,intermediate_file,bachelors_file}
    //     const tok = Cookies.get('token')
    //     form.addEventListener('submit', async (event) => {
    //         event.preventDefault();
            
    //         // const formData = new FormData(data);
    //         try {
    //             const response = await fetch('/saveVerifyInfo', {
    //                 method: 'POST',
    //                 mode: "cors",
    //                 cache: "no-cache",
    //                 credentials: "include", 
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${tok}`
    //                 },
    //                 redirect: "follow",
    //                 referrerPolicy: "no-referrer", 
    //                 credentials: "include",
    //                 withCredentials: true,
    //                 body: JSON.stringify(data),
    //             });
    //             console.log(tok)
    //             if (response.ok) {
    //                 const result = await response.json();
    //                 console.log('Data saved successfully:', result);
    //             } else {
    //                 throw new Error('Error saving data');
    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }
    //     });
    // }

    // Function to handle form submission
    async function handleFormSubmission(event) {
        event.preventDefault();
        const tutor_image = document.querySelector('.tutor-image').files[0];
        const tutor_name = document.querySelector('.tutor-name').value;
        const tutor_email = document.querySelector('.tutor-email').value;
        const bio = document.querySelector('.bio').value;
        const birthday = document.querySelector('.bir').value;
        const country = document.querySelector('.country').value;
        const phone_no = document.querySelector('.phno').value;
        const resume_file = document.querySelector('.res-file').files[0];
        const matrix_file = document.querySelector('.metric-file').files[0];
        const intermediate_file = document.querySelector('.inter-file').files[0];
        const bachelors_file = document.querySelector('.bac-file').files[0];
        console.log(tutor_image)
        // Validation checks
        if (!tutor_image || !tutor_name || !tutor_email || !bio || !birthday || !country || !phone_no || !resume_file || !matrix_file || !intermediate_file || !bachelors_file) {
        
        toastr.error('in COMSATS Intelli-Learn','Please fill in all fields')

        console.error('Please fill in all fields');
        // You might want to show an error message to the user indicating which fields are missing
        return;
    }
    
        const formData = new FormData();
        formData.append('t_image', tutor_image);
        formData.append('tutor_name', tutor_name);
        formData.append('tutor_email', tutor_email);
        formData.append('bio', bio);
        formData.append('birthday', birthday);
        formData.append('country', country);
        formData.append('phone_no', phone_no);
        formData.append('resume_file', resume_file);
        formData.append('matrix_file', matrix_file);
        formData.append('intermediate_file', intermediate_file);
        formData.append('bachelors_file', bachelors_file);
    
        try {
            const tok = Cookies.get('token');
            const response = await fetch('http://localhost:5000/saveVerifyInfo', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${tok}`,
                },
                body: formData,
            });
    
            if (response.ok) {
                const result = await response.json();
                toastr.success('in COMSATS Intelli-Learn','Your Data Save Successfully')
                console.log('Data saved successfully:', result);
            } else {
                throw new Error('Error saving data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('verifyForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmission);
        } else {
            console.error('Form not found');
        }
    });
    