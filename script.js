// DOM Elements
const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const searchInput = document.getElementById('search-input');
const notesList = document.getElementById('notes-list');
const addNoteBtn = document.getElementById('add-note-btn');
const noteInput = document.getElementById('note-input');
const noteTitle = document.getElementById('note-title');
const lastSaved = document.getElementById('last-saved');
const languageToggle = document.getElementById('language-toggle');
const nightModeToggle = document.getElementById('night-mode-toggle');
const settingsIcon = document.getElementById('settings-icon');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsModal = document.getElementById('close-settings-modal');
const exportNotesBtn = document.getElementById('export-notes');
const importNotesInput = document.getElementById('import-notes');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');

// Load saved notes from localStorage
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteIndex = null;
let isArmenian = false;
let noteToDeleteIndex = null; // Track the note to delete

// Armenian character mapping
const armenianMap = {
  '1': 'է',
  '!': 'Է',
  '2': 'թ',
  '@': 'Թ',
  '3': 'փ',
  '#': 'Փ',
  '4': 'ձ',
  '$': 'Ձ',
  '5': 'ջ',
  '%': 'Ջ',
  '6': 'ւ',
  '^': 'Ւ',
  '7': 'և',
  '&': 'և',
  '8': 'ր',
  '*': 'Ր',
  '9': 'չ',
  '(': 'Չ',
  '0': 'ճ',
  ')': 'Ճ',
  'q': 'ք',
  'Q': 'Ք',
  'w': 'ո',
  'W': 'Ո',
  'e': 'ե',
  'E': 'Ե',
  'r': 'ռ',
  'R': 'Ռ',
  't': 'տ',
  'T': 'Տ',
  'y': 'ը',
  'Y': 'Ը',
  'u': 'ւ',
  'U': 'Ւ',
  'i': 'ի',
  'I': 'Ի',
  'o': 'օ',
  'O': 'Օ',
  'p': 'պ',
  'P': 'Պ',
  '[': 'խ',
  '{': 'Խ',
  ']': 'ծ',
  '}': 'Ծ',
  '\\': 'շ',
  '|': 'Շ',
  'a': 'ա',
  'A': 'Ա',
  's': 'ս',
  'S': 'Ս',
  'd': 'դ',
  'D': 'Դ',
  'f': 'ֆ',
  'F': 'Ֆ',
  'g': 'գ',
  'G': 'Գ',
  'h': 'հ',
  'H': 'Հ',
  'j': 'յ',
  'J': 'Յ',
  'k': 'կ',
  'K': 'Կ',
  'l': 'լ',
  'L': 'Լ',
  'z': 'զ',
  'Z': 'Զ',
  'x': 'ղ',
  'X': 'Ղ',
  'c': 'ց',
  'C': 'Ց',
  'v': 'վ',
  'V': 'Վ',
  'b': 'բ',
  'B': 'Բ',
  'n': 'ն',
  'N': 'Ն',
  'm': 'մ',
  'M': 'Մ',
  '?': '՞'
};

// Convert text to Armenian
function convertToArmenian(text) {
  return text.split('').map(char => armenianMap[char] || char).join('');
}

// Format relative time (e.g., "2 hours ago")
function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `about ${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

// Handle input for language conversion
function handleInput(e) {
  if (isArmenian) {
    const cursorPosition = e.target.selectionStart;
    const inputValue = e.target.value;
    const newChar = inputValue[cursorPosition - 1]; // Get the newly typed character

    if (newChar && armenianMap[newChar]) {
      const newText =
        inputValue.slice(0, cursorPosition - 1) +
        armenianMap[newChar] +
        inputValue.slice(cursorPosition);
      e.target.value = newText;
      e.target.setSelectionRange(cursorPosition, cursorPosition); // Maintain cursor position
    }
  }
  saveNote(); // Save the note
}

// Render notes
function renderNotes(filterText = '') {
  notesList.innerHTML = '';
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(filterText.toLowerCase()) ||
    note.body.toLowerCase().includes(filterText.toLowerCase())
  );

  filteredNotes.forEach((note, index) => {
    const noteItem = document.createElement('div');
    noteItem.className = `note-item ${currentNoteIndex === index ? 'active' : ''}`;
    noteItem.innerHTML = `
      <div class="note-content">
        <div class="note-header">
          <strong>${note.title || 'Untitled note'}</strong>
          <span class="delete-note" onclick="showDeleteConfirmation(${index})">
            <i class='bx bx-trash' style='color:#686f7d'  ></i>
          </span>
        </div>
        <p>${note.body.substring(0, 20)}... <span class="last-saved">${formatRelativeTime(new Date(note.lastSaved))}</span></p>
      </div>
    `;
    noteItem.addEventListener('click', () => openNote(index));
    notesList.appendChild(noteItem);
  });
}

// Open a note
function openNote(index) {
  currentNoteIndex = index;
  noteTitle.value = notes[index].title;
  noteInput.value = notes[index].body;
  lastSaved.textContent = `Last saved: ${formatRelativeTime(new Date(notes[index].lastSaved))}`;

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('active');
  }

  // Re-render notes to highlight the active note
  renderNotes();
  updateBlankNotesArea();
}

// Add a new note
addNoteBtn.addEventListener('click', () => {
  const newNote = {
    title: 'Untitled note',
    body: '',
    lastSaved: new Date(),
  };
  notes.unshift(newNote); // Add to the top
  currentNoteIndex = 0;
  localStorage.setItem('notes', JSON.stringify(notes));
  renderNotes();
  noteTitle.value = newNote.title;
  noteInput.value = newNote.body;
  lastSaved.textContent = `Last saved: ${formatRelativeTime(new Date(newNote.lastSaved))}`;
  noteInput.focus();
  updateBlankNotesArea(); // Add this line to update the blank notes area
});

// Show delete confirmation modal
function showDeleteConfirmation(index) {
  noteToDeleteIndex = index;
  confirmationModal.style.display = 'flex';
}

// Delete a note
function deleteNote() {
  if (noteToDeleteIndex !== null) {
    notes.splice(noteToDeleteIndex, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    if (currentNoteIndex === noteToDeleteIndex) {
      noteTitle.value = '';
      noteInput.value = '';
      lastSaved.textContent = '';
      currentNoteIndex = null;
    }
    noteToDeleteIndex = null;
    confirmationModal.style.display = 'none';
    updateBlankNotesArea(); // Add this line to update the blank notes area
  }
}

// Cancel delete
function cancelDelete() {
  noteToDeleteIndex = null;
  confirmationModal.style.display = 'none';
}

// Attach event listeners for delete confirmation
confirmDeleteBtn.addEventListener('click', deleteNote);
cancelDeleteBtn.addEventListener('click', cancelDelete);

// Auto-save while typing
function saveNote() {
  if (currentNoteIndex !== null) {
    notes[currentNoteIndex].title = noteTitle.value;
    notes[currentNoteIndex].body = noteInput.value;
    notes[currentNoteIndex].lastSaved = new Date();
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    lastSaved.textContent = `Last saved: ${formatRelativeTime(new Date(notes[currentNoteIndex].lastSaved))}`;
  }
}

// Attach input handlers
noteTitle.addEventListener('input', handleInput);
noteInput.addEventListener('input', handleInput);

// Search notes
searchInput.addEventListener('input', () => {
  renderNotes(searchInput.value);
});

// Hamburger menu for mobile
hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Language toggle
languageToggle.addEventListener('click', () => {
  isArmenian = !isArmenian;
  languageToggle.classList.toggle('active');
});

// Night mode toggle
nightModeToggle.addEventListener('click', () => {
  const isNightMode = document.body.classList.toggle('night-mode');
  saveNightModePreference(isNightMode);
  nightModeToggle.classList.toggle('active');
});

// Settings modal
settingsIcon.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});

closeSettingsModal.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === settingsModal || e.target === confirmationModal) {
    settingsModal.style.display = 'none';
    confirmationModal.style.display = 'none';
  }
});

// Export notes as JSON
exportNotesBtn.addEventListener('click', () => {
  const dataStr = JSON.stringify(notes);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = 'notes.json';
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
});

// Import notes from JSON
importNotesInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const importedNotes = JSON.parse(event.target.result);
      notes = importedNotes;
      localStorage.setItem('notes', JSON.stringify(notes));
      renderNotes();
    };
    reader.readAsText(file);
  }
});

// Save and load night mode preference
function saveNightModePreference(isNightMode) {
  localStorage.setItem('nightMode', isNightMode ? 'enabled' : 'disabled');
}

function loadNightModePreference() {
  const nightMode = localStorage.getItem('nightMode');
  if (nightMode === 'enabled') {
    document.body.classList.add('night-mode');
    nightModeToggle.classList.add('active');
  }
}

// Initialize night mode
loadNightModePreference();

// Show blank notes area when no note is selected
function updateBlankNotesArea() {
  const blankNotesArea = document.getElementById('blank-notes-area');
  const noteTitle = document.getElementById('note-title');
  const noteInput = document.getElementById('note-input');

  if (currentNoteIndex === null) {
    blankNotesArea.style.display = 'flex';
    noteTitle.style.display = 'none';
    noteInput.style.display = 'none';
  } else {
    blankNotesArea.style.display = 'none';
    noteTitle.style.display = 'block';
    noteInput.style.display = 'block';
  }
}


// Initialize blank notes area
updateBlankNotesArea();

// Initialize
renderNotes();