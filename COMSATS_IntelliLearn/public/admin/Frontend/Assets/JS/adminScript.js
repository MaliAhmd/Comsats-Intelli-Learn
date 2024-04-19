const modal = document.getElementById('userModal');
            const openDialogButton = document.querySelectorAll('.openDialogButton');
            const modalForm = document.getElementById('modalForm');
            const table = document.getElementById('userTable');
            let currentUserId = null;

            // Function to open the modal dialog
            openDialogButton.addEventListener('click', () => {
                modal.style.display = 'block';
                currentUserId = null; // Reset current user ID when opening the dialog
                modalForm.reset(); // Reset the form fields
            });

            // Function to close the modal dialog
            document.querySelector('.close').addEventListener('click', () => {
                modal.style.display = 'none';
            });