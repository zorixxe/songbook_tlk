let songs = [];
let categories = new Set();
let currentCategory = null;

// Base path for all assets
const BASE_PATH = '/sangbok';

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
        const response = await fetch(`${BASE_PATH}/songs.json`);
        const songs = await response.json();
        return songs;
    } catch (error) {
        console.error('Error loading songs:', error);
        return [];
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
        filteredSongs = filteredSongs.filter(song => song.category === currentCategory);
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
async function init() {
    const songs = await loadSongs();
    if (songs.length === 0) {
        console.error('No songs loaded');
        return;
    }

    // Populate categories
    const categories = ['all', ...new Set(songs.map(song => song.category))];
    const categoriesContainer = document.querySelector('.categories');
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = category === 'all' ? 'All Songs' : category;
        button.onclick = () => filterByCategory(category);
        categoriesContainer.appendChild(button);
    });

    // Set up search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => filterSongs(e.target.value));

    // Show all songs initially
    filterByCategory('all');
}

// Filter songs by category
function filterByCategory(category) {
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach(button => {
        button.classList.toggle('active', button.textContent === (category === 'all' ? 'All Songs' : category));
    });

    const filteredSongs = category === 'all' 
        ? songs 
        : songs.filter(song => song.category === category);
    
    displaySongs(filteredSongs);
}

// Filter songs by search term
function filterSongs(searchTerm) {
    const filteredSongs = songs.filter(song => 
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    displaySongs(filteredSongs);
}

// Display songs in the song list
function displaySongs(songs) {
    const songList = document.getElementById('songList');
    songList.innerHTML = '';

    songs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'song-item';
        songElement.innerHTML = `
            <h3>${song.title}</h3>
            <p class="category">${song.category}</p>
        `;
        songElement.onclick = () => showSong(song);
        songList.appendChild(songElement);
    });
}

// Show song details
function showSong(song) {
    const songView = document.getElementById('songView');
    songView.innerHTML = `
        <h2>${song.title}</h2>
        <p class="category">${song.category}</p>
        <div class="song-content">
            ${song.content}
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Start the application
init();

function createSongElement(song) {
    const songElement = document.createElement('div');
    songElement.className = 'song-entry';
    
    const header = document.createElement('div');
    header.className = 'song-header';
    
    const title = document.createElement('div');
    title.className = 'song-id-title';
    title.textContent = `${song.id}. ${song.title}`;
    header.appendChild(title);

    // Add mini-credits when credits box is not visible
    if (window.innerHeight < 1270) {
        const miniCredits = document.createElement('div');
        miniCredits.className = 'mini-credits';
        miniCredits.innerHTML = 'Made by <a href="songbook_flowchart.pdf" target="_blank">Robin "Tildis" Tildeman</a>';
        header.appendChild(miniCredits);
    }

    if (song.melody) {
        const melody = document.createElement('div');
        melody.className = 'song-melody';
        melody.textContent = `Melody: ${song.melody}`;
        header.appendChild(melody);
    }
    
    songElement.appendChild(header);

    // ... rest of the existing song creation code ...
    
    return songElement;
}

// Add window resize listener to update mini-credits visibility
window.addEventListener('resize', () => {
    const miniCredits = document.querySelectorAll('.mini-credits');
    const shouldShow = window.innerHeight < 1270;
    
    miniCredits.forEach(credit => {
        credit.style.display = shouldShow ? 'block' : 'none';
    });
}); 