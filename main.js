const addBox = document.querySelector('.add-box');
const popupBox = document.querySelector('.popup-box');
const popupTitle = document.querySelector('header p');
const closeIcon = document.querySelector('header .close');
const addBtn = document.querySelector('button');
const titleTag = document.querySelector('input');
const descTag = document.querySelector('textarea');

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const notes = JSON.parse(localStorage.getItem('notes') || '[]');

let isUpdate = false;
let updateID;

addBox.addEventListener('click', () => {
  titleTag.focus();
  popupBox.classList.add('show');
});

closeIcon.addEventListener('click', () => {
  isUpdate = false;

  titleTag.value = '';
  descTag.value = '';

  addBtn.innerText = 'Add Note';
  popupTitle.innerText = 'Add a new note';

  popupBox.classList.remove('show');
});

addBtn.addEventListener('click', (e) => {
  e.preventDefault();

  let noteTitle = titleTag.value;
  let noteDesc = descTag.value;

  if (noteTitle || noteDesc) {
    // Getting month, day, year from the current date
    let dateObj = new Date();
    let month = months[dateObj.getMonth()];
    let year = dateObj.getFullYear();
    let day = dateObj.getDate();

    let noteInfo = {
      title: noteTitle,
      description: noteDesc,
      date: `${month} ${day}, ${year}`,
    };

    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateID] = noteInfo;
    }

    localStorage.setItem('notes', JSON.stringify(notes));

    popupBox.classList.remove('show');

    showNotes();
  }
});

function showNotes() {
  document.querySelectorAll('.note').forEach((note) => note.remove());

  notes.forEach((note, index) => {
    let liTag = `
    <li class="note">
      <div class="details">
        <p>${note.title}</p>
        <span>${note.description}</span>
      </div>
      <div class="bottom-content">
        <span>${note.date}</span>
        <div class="settings">
          <svg onclick="showMenu(this)" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
          <ul class="menu">
            <li onclick="updateNote(${index}, '${note.title}', '${note.description}')">
              <svg viewBox="0 0 24 24">
                <path
                  d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                ></path>
              </svg>
              Edit
            </li>
            <li onclick="deleteNote(${index})">
              <svg viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                ></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Delete
            </li>
          </ul>
        </div>
      </div>
    </li>
    `;

    addBox.insertAdjacentHTML('afterend', liTag);
  });
}

function showMenu(elem) {
  elem.parentElement.classList.add('show');

  document.addEventListener('click', (e) => {
    if (e.target.tagName != 'I' || e.target != elem) {
      elem.parentElement.classList.remove('show');
    }
  });
}

function deleteNote(noteIndex) {
  let confirmDel = confirm('Are you sure you want to delete this note ?');

  if (!confirmDel) return;

  notes.splice(noteIndex, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  showNotes();
}

function updateNote(noteIndex, title, description) {
  isUpdate = true;
  updateID = noteIndex;

  addBox.click();

  titleTag.value = title;
  descTag.value = description;

  addBtn.innerText = 'Update Note';
  popupTitle.innerText = 'Update a Note';
  console.log(noteIndex, title, description);
}

showNotes();
