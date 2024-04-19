document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', async (e) => {
        if (form) {
            e.preventDefault();
            
            const title = document.getElementById('title').value;
            const format = document.querySelector('input[name="format"]:checked').value;
            let valueToStore;

            if (format === 'video') {
                valueToStore = 'video';
                
                // Get the video file input
                const courseFileInput = document.getElementById('course');
                const courseFile = courseFileInput.files[0];
                
                const tutoremail=JSON.parse(localStorage.getItem("tutorID"))

                // Check if a file is selected
                if (courseFile) {
                    // Proceed with uploading the video file
                    const formData = new FormData();
                    formData.append('title', title);
                    formData.append('format', format);
                    formData.append('tutor_email',tutoremail.tutor_email);
                    formData.append('tutor_id',tutoremail.id);
                    formData.append('course', courseFile);
                    
                    console.log('Value to store:', valueToStore);
                    try {
                        const tok = Cookies.get('token');
                        const response = await fetch('http://localhost:5000/tutorcourse', {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${tok}`,
                            },
                            credentials: "include",
                            withCredentials: true,
                            body: formData
                        });

                        if (response.ok) {
                            console.log('Upload successful');
                            form.reset();
                        } else {
                            console.log('Upload failed');
                        }
                    } catch (error) {
                        console.error('Error uploading file:', error);
                    }
                } else {
                    console.error('No video file selected');
                }
            } else if (format === 'file') {
                valueToStore = 'file';
                // Get the video file input
                const courseFileInput = document.getElementById('course');
                const courseFile = courseFileInput.files[0];
                
                const tutoremail=JSON.parse(localStorage.getItem("tutorID"))

                // Check if a file is selected
                if (courseFile) {
                    // Proceed with uploading the video file
                    const formData = new FormData();
                    formData.append('title', title);
                    formData.append('format', format);
                    formData.append('tutor_email',tutoremail.tutor_email);
                    formData.append('tutor_id',tutoremail.id);
                    formData.append('course', courseFile);
                    
                    console.log('Value to store:', valueToStore);
                    try {
                        const tok = Cookies.get('token');
                        const response = await fetch('http://localhost:5000/tutorcourse', {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${tok}`,
                            },
                            credentials: "include",
                            withCredentials: true,
                            body: formData
                        });

                        if (response.ok) {
                            console.log('Upload successful');
                            form.reset();
                        } else {
                            console.log('Upload failed');
                        }
                    } catch (error) {
                        console.error('Error uploading file:', error);
                    }
                } else {
                    console.error('No video file selected');
                }
                // Handle uploading file format
                // You can implement the file upload logic similar to the video upload logic here
            }

            // Optionally, reset the form after processing
            // form.reset();
        } else {
            console.error('Form element not found');
        }
    });
});

