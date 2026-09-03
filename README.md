# 🎵 TLK Songbook

An online songbook for **Tekniska läroverkets kamratförbund r.f.** (TLK) - a modern, responsive web application that brings the traditional songbook into the digital age.

**Live Demo:** [https://zorixxe.github.io/songbook_tlk/](https://zorixxe.github.io/songbook_tlk/)

##  About

The TLK Songbook is a comprehensive collection of songs curated by Sångbokskomittén, featuring traditional student songs, drinking songs, and other cultural pieces important to the TLK association. This web application makes the songbook accessible on any device, anywhere, anytime.

##  Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.6+ (for song management features)
- Basic knowledge of HTML/CSS/JavaScript (for customization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zorixxe/songbook_tlk.git
   cd songbook_tlk
   ```

2. **Open in your browser**
   - Simply open `index.html` in your web browser
   - Or serve locally using a web server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     ```

3. **Access the application**
   - Navigate to `http://localhost:8000` (if using a local server)
   - Or open `index.html` directly in your browser

## 🛠️ Development

### Project Structure

```
songbook_tlk/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # Main JavaScript functionality
├── songView.js         # Song display logic
├── songs.json          # Song database
├── add_song.py         # Python script for adding new songs
├── tlklogo-white.png   # TLK logo
```

### Adding New Songs

Use the included Python script to add new songs to the collection:

```bash
python add_song.py
```

The script will guide you through the process of adding:
- Song title
- Lyrics
- Category
- Additional metadata

### Customization

- **Styling**: Modify `styles.css` to change the appearance
- **Functionality**: Edit `script.js` for new features
- **Songs**: Update `songs.json` directly or use the Python script

## Links

- **Live Songbook**: [https://zorixxe.github.io/songbook_tlk/](https://zorixxe.github.io/songbook_tlk/)
- **TLK Website**: [https://www.tlk.fi/](https://www.tlk.fi/)
- **TLK Members Songbook**: [https://www.tlk.fi/medlemmar/sangbok/](https://www.tlk.fi/medlemmar/sangbok/)


---

*Made with ❤️ for the any student in need of a songbook*
