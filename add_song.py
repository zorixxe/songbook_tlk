import json
import os
import shutil

def validate_input(value, field_name, max_length=None, required=True):
    """Validate input to ensure SQL compatibility"""
    if not value and required:
        raise ValueError(f"{field_name} cannot be empty")
    if max_length and len(value) > max_length:
        raise ValueError(f"{field_name} cannot exceed {max_length} characters")
    return value

def load_songs():
    if os.path.exists('songs.json'):
        print("Found existing songs.json file")
        try:
            # First try to read the file contents
            with open('songs.json', 'r', encoding='utf-8') as file:
                file_content = file.read()
                
            # Try to parse the JSON
            try:
                data = json.loads(file_content)
                print(f"Successfully loaded {len(data['songs'])} songs")
                return data
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON: {str(e)}")
                print("Attempting to load backup file...")
                
                # Try to load from backup
                if os.path.exists('songs.json.bak'):
                    with open('songs.json.bak', 'r', encoding='utf-8') as bak_file:
                        try:
                            data = json.load(bak_file)
                            print(f"Successfully loaded {len(data['songs'])} songs from backup")
                            # Restore the backup
                            shutil.copy2('songs.json.bak', 'songs.json')
                            return data
                        except:
                            print("Backup file also corrupted")
                
                # If we get here, both files are corrupted
                print("Creating new songs file")
                return {"songs": []}
                
        except Exception as e:
            print(f"Error reading file: {str(e)}")
            return {"songs": []}
    else:
        print("No existing songs.json file found")
        return {"songs": []}

def save_songs(songs_data):
    # Create a backup of the existing file if it exists and is valid
    if os.path.exists('songs.json'):
        try:
            with open('songs.json', 'r', encoding='utf-8') as file:
                json.load(file)  # Try to parse the existing file
            shutil.copy2('songs.json', 'songs.json.bak')
            print("Created backup of songs.json")
        except:
            print("Existing file is corrupted, skipping backup")
    
    # Save the updated data
    with open('songs.json', 'w', encoding='utf-8') as file:
        json.dump(songs_data, file, ensure_ascii=False, indent=4)
    print(f"Saved {len(songs_data['songs'])} songs to file")

def get_multiline_input(prompt, required=True):
    print(prompt)
    print("(Enter an empty line twice to finish, once for paragraph break)")
    lines = []
    last_line_empty = False
    
    while True:
        line = input()
        if line.strip() == "":
            if last_line_empty:  # Second empty line
                if not required or lines:  # If not required or we have content
                    break
                else:
                    print("Please enter at least one line of text:")
                    last_line_empty = False
                    continue
            else:  # First empty line - add paragraph break
                if lines:  # Only add paragraph break if we have content
                    lines.append("")  # This will create a blank line between paragraphs
                last_line_empty = True
        else:
            lines.append(line)
            last_line_empty = False
    
    # Remove trailing empty lines but keep paragraph breaks
    while lines and lines[-1] == "":
        lines.pop()
    
    return "\n".join(lines)

def add_song(last_genre=None):
    songs_data = load_songs()
    
    # Get the next ID (max existing ID + 1, or 1 if no songs exist)
    existing_ids = [song.get('id', 0) for song in songs_data.get('songs', [])]
    print(f"Found existing IDs: {existing_ids}")
    next_id = (max(existing_ids) + 1) if existing_ids else 1
    print(f"Next ID will be: {next_id}")
    
    print(f"\nAdding new song (ID: {next_id})")
    print("-" * 30)
    
    while True:
        try:
            # Get song details with validation
            if last_genre:
                print(f"Current catagory is: {last_genre}")
                change_genre = input("Would you like to change the catagory? (y/n): ").lower().strip() == 'y'
                if change_genre:
                    genre = validate_input(input("Enter new catagory: ").strip(), "Genre", max_length=100)
                else:
                    genre = last_genre
            else:
                genre = validate_input(input("Enter catagory: ").strip(), "Genre", max_length=100)
            
            title = validate_input(input("Enter title: ").strip(), "Title")
            
            print("\nEnter song text (one paragraph at a time):")
            print("Press Enter once for a new line in the same verse")
            print("Press Enter twice to start a new verse")
            print("Press Enter three times to finish")
            text = validate_input(get_multiline_input("Enter text:", required=True), "Text")
            
            creator = validate_input(input("\nEnter creator (press Enter if none): ").strip(), 
                                   "Creator", max_length=200, required=False)
            melodi = validate_input(input("Enter melody name (press Enter if none): ").strip(), 
                                  "Melodi", max_length=100, required=False)
            music = validate_input(input("Enter music composer (press Enter if none): ").strip(), 
                                 "Music", max_length=200, required=False)
            
            print("\nEnter any fun facts or interesting information about the song (optional):")
            print("(This can include historical context, meaning, or any other interesting details)")
            fun_facts = get_multiline_input("Enter fun facts (empty line twice to finish):", required=False)
            
            # Create song dictionary with SQL-friendly structure
            song = {
                "id": next_id,
                "catagory": genre,
                "title": title,
                "text": text,
                "creator": creator or None,  # Convert empty string to None
                "melodi": melodi or None,    # Convert empty string to None
                "music": music or None,      # Convert empty string to None
                "fun_facts": fun_facts or None  # Convert empty string to None
            }
            break
        except ValueError as e:
            print(f"\nError: {e}")
            print("Please try again.\n")
    
    # Add to songs list
    songs_data['songs'].append(song)
    
    # Save to file
    save_songs(songs_data)
    print(f"\nSong '{title}' has been added successfully!")
    
    return genre  # Return the genre for the next song

def main():
    print("Song Addition Program (SQL-Compatible)")
    print("=====================================")
    print("Note: This program includes data validation for SQL database compatibility.")
    print("Maximum lengths:")
    print("- catagory: 100 characters")
    print("- Title: Unlimited (stored as TEXT)")
    print("- Creator: 200 characters (optional)")
    print("- Melodi: 100 characters (optional) - name of the melody")
    print("- Music: 200 characters (optional) - composer of the music")
    print("- Fun facts: Unlimited (optional) - interesting information about the song")
    print("- Text: Unlimited")
    print()
    
    last_genre = None
    while True:
        try:
            last_genre = add_song(last_genre)
            continue_adding = input("\nWould you like to add another song? (y/n): ").lower()
            if continue_adding != 'y':
                break
        except Exception as e:
            print(f"\nAn error occurred: {e}")
            print("Please try again.")
    
    print("\nThank you for using the song addition program!")

if __name__ == "__main__":
    main() 