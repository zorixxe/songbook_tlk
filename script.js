let songs = [];
let categories = new Set();
let currentCategory = null;

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'menu-overlay';
document.body.appendChild(overlay);

// Handle menu toggle
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const categoriesMenu = document.getElementById('categoriesMenu');
    
    if (!menuToggle || !categoriesMenu) {
        console.error('Menu elements not found');
        return;
    }

    menuToggle.addEventListener('click', () => {
        console.log('Menu toggle clicked');
        menuToggle.classList.toggle('active');
        categoriesMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        console.log('Overlay clicked');
        menuToggle.classList.remove('active');
        categoriesMenu.classList.remove('active');
        overlay.classList.remove('active');
    });

    document.getElementById('categoryList').addEventListener('click', (e) => {
        if (window.innerWidth <= 772) {
            console.log('Category clicked on mobile');
            menuToggle.classList.remove('active');
            categoriesMenu.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
}

// Load songs from JSON file
async function loadSongs() {
    try {
        const response = await fetch('songs.json');
        const data = await response.json();
        songs = data.songs;
        
        console.log('Loaded songs:', songs.length);
        
        // Extract unique categories
        songs.forEach(song => {
            if (song.catagory) {
                categories.add(song.catagory);
            }
        });
        
        console.log('Found categories:', Array.from(categories));
        
        // Initialize the UI
        renderCategories();
        renderSongs(songs);
    } catch (error) {
        console.error('Error loading songs:', error);
        console.error('Error details:', error.message);
    }
}

// Render categories in the sidebar
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) {
        console.error('Category list element not found!');
        return;
    }
    
    console.log('Rendering categories:', Array.from(categories));
    
    // Create the All Songs button with category-button class
    categoryList.innerHTML = '<button class="category-button category-item active" data-category="all">All Songs</button>';
    
    categories.forEach(category => {
        categoryList.innerHTML += `
            <button class="category-button category-item" data-category="${category}">
                ${category}
            </button>
        `;
    });

    // Add click event listeners to categories
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const category = item.dataset.category;
            currentCategory = category === 'all' ? null : category;
            filterAndRenderSongs();

            // Close mobile menu if on mobile
            if (window.innerWidth <= 772) {
                const menuToggle = document.getElementById('menuToggle');
                const categoriesMenu = document.getElementById('categoriesMenu');
                menuToggle.classList.remove('active');
                categoriesMenu.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
}

// Filter and render songs based on search and category
function filterAndRenderSongs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let filteredSongs = songs;

    // Apply category filter
    if (currentCategory) {
        filteredSongs = filteredSongs.filter(song => song.catagory === currentCategory); // Changed to match JSON spelling
    }

    // Apply search filter
    if (searchTerm) {
        filteredSongs = filteredSongs.filter(song => 
            song.title.toLowerCase().includes(searchTerm) ||
            song.id.toString().includes(searchTerm)
        );
    }

    renderSongs(filteredSongs);
}

// Render songs in the main container
function renderSongs(songsToRender) {
    const songList = document.getElementById('songList');
    songList.innerHTML = '';

    songsToRender.forEach(song => {
        const songElement = createSongElement(song);
        songList.appendChild(songElement);
    });
}

// Add this function at the top level
function resetToAllSongs() {
    currentCategory = null;
    document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
    document.querySelector('.category-item[data-category="all"]').classList.add('active');
    filterAndRenderSongs();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadSongs();
    setupMobileMenu();

    // Add search event listener
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', filterAndRenderSongs);

    // Add logo click handler
    const logo = document.querySelector('.logo-title a');
    logo.addEventListener('click', () => {
        resetToAllSongs();
    });
}); 