// Base path for all assets
const BASE_PATH = '/sangbok';

function createSongElement(song) {
    const songDiv = document.createElement('div');
    songDiv.className = 'song-entry';

    songDiv.innerHTML = `
        <div class="song-header">
            <div class="song-id-title">${song.id}. ${song.title}</div>
            ${song.melodi ? `<div class="song-melody">Melodi: ${song.melodi}</div>` : ''}
        </div>
        
        <div class="song-text">${formatSongText(song.text)}</div>
        
        <div class="song-credits">
            ${song.creator ? `<div>Text: ${song.creator}</div>` : ''}
            ${song.music ? `<div>Music: ${song.music}</div>` : ''}
        </div>
        
        ${song.fun_facts ? `
            <div class="song-fun-fact">
                ${formatSongText(song.fun_facts)}
            </div>
        ` : ''}
    `;

    return songDiv;
}

function formatSongText(text) {
    if (!text) return '';
    
    // First, replace repeat markers with styled spans
    text = text.replace(/\/\/:/g, '<span class="repeat-start">//:</span>');
    text = text.replace(/:\/\//g, '<span class="repeat-end">://</span>');
    
    // Replace double newlines with a special marker
    text = text.replace(/\n\n+/g, '\n<p>\n');
    
    // Replace single newlines with <br> and restore paragraphs
    return text
        .split('\n')
        .map(line => line.trim())
        .join('<br>')
        .replace(/<br><p><br>/g, '</p><p>');
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

// Export the function for use in script.js
window.showSong = showSong; 