document.addEventListener('DOMContentLoaded', function() {
    const authContainer = document.getElementById('auth-container');
    const crudContainer = document.getElementById('crud-container');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const authForm = document.getElementById('auth-form');
    const crudForm = document.getElementById('crud-form');
    const itemList = document.getElementById('item-list');

    let authenticated = false;

    // Check if user is authenticated
    function checkAuth() {
        if (authenticated) {
            authContainer.style.display = 'none';
            crudContainer.style.display = 'block';
        } else {
            authContainer.style.display = 'block';
            crudContainer.style.display = 'none';
        }
    }

    // Login
    authForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simulate authentication (replace with actual authentication logic)
        if (username === 'admin' && password === 'password') {
            authenticated = true;
            checkAuth();
        } else {
            alert('Invalid credentials');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        authenticated = false;
        checkAuth();
    });

    // Retrieve items
    function getItems() {
        fetch('/items')
            .then(response => response.json())
            .then(data => {
                itemList.innerHTML = '';
                data.forEach(item => {
                    itemList.innerHTML += `<li>${item.item} <button class="delete" data-id="${item.id}">Delete</button> <button class="edit" data-id="${item.id}">Edit</button></li>`;
                });
            });
    }

    // Add item
    crudForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newItem = document.getElementById('item').value;

        fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item: newItem })
        })
        .then(response => {
            getItems();
            document.getElementById('item').value = '';
        });
    });

    // Delete item
    itemList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete')) {
            const itemId = event.target.getAttribute('data-id');
            fetch(`/items/${itemId}`, {
                method: 'DELETE'
            })
            .then(response => {
                getItems();
            });
        }
    });

    // Edit item (not implemented in backend, requires additional server logic)
    itemList.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit')) {
            const itemId = event.target.getAttribute('data-id');
            const newItem = prompt('Enter new item text:');
            if (newItem !== null && newItem !== '') {
                fetch(`/items/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ item: newItem })
                })
                .then(response => {
                    getItems();
                });
            }
        }
    });

    // Initial check for authentication status
    checkAuth();

    // Retrieve items on page load
    getItems();
});