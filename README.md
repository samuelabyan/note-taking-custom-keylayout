# Note-Taking Web App with Custom Keyboard Layout

Note-taking web application that allows users to create, edit, delete, and search notes. It supports light/dark mode, language toggling (English/Armenian, with custom layout). All data is saved in user's browser storage and can be exported and imorted using JSON files.

**Live preview**: Go to the [Note Taking and Custom Layout](https://samuelabyan.github.io/note-taking-custom-keylayout) to use the webapp.


**Custom keyboard layout and character conversion**: As you type, the entered characters will be automatically converted to their equivalents based on the predefined mapping. In this example, typing 'a' will display 'ա', 'A' will show 'Ա', '8' will present 'ր', and so forth. (Armenian phonetic layout) You can replace/add characters to make a custom layout.

**Data management**: Notes data is automatically saved in your browser storage. You can save and load your notes using import/export feature in the Settings.

**Use case**: When connecting a physical keyboard to iOS or iPadOS, keyboard layouts are limited. This simple implementation gives possibility to configure personal layouts.

**Future Updates**
- Keyboard shortcut to toggle language.
- Building, saving and importing custom layouts using JSON files.
- Language toggle to effect on the search bar.

**License**
This project is open-source and available under the MIT License.
