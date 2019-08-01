const name = document.getElementById('name');
const date = document.getElementById('date');
const startTime = document.getElementById('starttime');
const finishTime = document.getElementById('finishtime');
const cardGrid = document.getElementById('cardGrid');

const arr = JSON.parse(localStorage.getItem('events')) == null
            ? []
            : JSON.parse(localStorage.getItem('events'));
let editArrId = 0;

function createEvent(nameValue, startTimeValue, finishTimeValue) {
  const listItem = document.createElement('li');
  listItem.className = "list-group-item";
  const name = document.createElement('span');
  name.className = "nameBlock";
  name.innerHTML = nameValue;
  const startTime = document.createElement('span');
  startTime.className = "startTimeBlock";
  startTime.innerHTML = startTimeValue;
  const finishTime = document.createElement('span');
  finishTime.className = "finishTimeBlock";
  finishTime.innerHTML = finishTimeValue;
  const inputName = document.createElement('input')
  inputName.type = "text";
  inputName.className = "inputName";
  const inputStartTime = document.createElement('input')
  inputStartTime.type = "time";
  inputStartTime.className = "inputStartTime";
  const inputFinishTime = document.createElement('input')
  inputFinishTime.type = "time";
  inputFinishTime.className = "inputFinishTime";
  const editButton = document.createElement('button');
  editButton.className = "edit";
  editButton.innerHTML = '<i class="fas fa-edit"></i>';
  const deleteButton = document.createElement('button');
  deleteButton.className = "delete";
  deleteButton.innerHTML = '<i class="fas fa-times"></i>';

  listItem.appendChild(name)
  listItem.appendChild(startTime)
  listItem.appendChild(finishTime)
  listItem.appendChild(inputName)
  listItem.appendChild(inputStartTime)
  listItem.appendChild(inputFinishTime)
  listItem.appendChild(editButton)
  listItem.appendChild(deleteButton)

  return listItem
}

function createCard(dateValue, list) {
  const col = document.createElement('div');
  col.className = "col-lg-4 col-sm-6";
  const card = document.createElement('div');
  card.className = "card";
  const cardHeader = document.createElement('div');
  cardHeader.className = "card-header text-center";
  const cardTitle = document.createElement('h5');
  cardTitle.className = "card-title";
  cardTitle.innerText = dateValue;
  const cardBody = document.createElement('div');
  cardBody.className = "card-body";

  cardHeader.appendChild(cardTitle)
  card.appendChild(cardHeader)
  cardBody.appendChild(list)
  card.appendChild(cardBody)
  col.appendChild(card)

  return col
}

function sortEventsId() {
  const cardTitle = document.querySelectorAll('.card-title');
  const list = document.querySelectorAll('.list-group-flush');

  for (let i = 0; i < cardGrid.children.length; i++) {
    cardTitle[i].id = "cardNumber-" + i;
    list[i].id = "listNumber-" + i;
  }
}

function addSelect() {
  const select = document.createElement('select');
  const selectBlock = document.getElementById('selectBlock')

  select.id = 'select'
  selectBlock.innerHTML = ''
  select.innerHTML += `<option value="Дата">Дата</option>`

  const arrSort = sortDates()

  for (let i = 0; i < arrSort.length; i++) {
    const cardTitle = document.getElementById('cardNumber-' + i);
    select.innerHTML += `<option value="${arrSort[i]}">${arrSort[i]}</option> `
  }

  selectBlock.appendChild(select)

  if (selectBlock.innerHTML == '<select id="select"><option value="Дата">Дата</option></select>') {
    selectBlock.innerHTML = ''
  }
}

function addEvent() {
  if (date.value == '' || name.value == '' || startTime.value == '' || finishTime.value == '') {
    return alertMessage("Заполните все формы, поджалуйста")
  }

  if (startTime.value > finishTime.value) {
    return alertMessage("Время окончания раньше, чем время начала")
  }

  if (startTime.value == finishTime.value) {
    return alertMessage("Время окончания и начала мероприятия одинаковы")
  }

  for (let i = 0; i < arr.length; i++) {
    if (date.value == arr[i][0]) {
      if (startTime.value >= arr[i][2] && startTime.value <= arr[i][3]
        || finishTime.value >= arr[i][2] && finishTime.value <= arr[i][3]
        || startTime.value < arr[i][2] && finishTime.value > arr[i][3]
      ) {
        return alertMessage("Это время уже занято")
      }
    }
  }

  arr.push([date.value, name.value, startTime.value, finishTime.value])
  sortCards()
  save()
}

function deleteEvent(el) {
  const listItem = el.parentNode;
  const ul = listItem.parentNode;
  const card = ul.parentNode.parentNode.parentNode
  const cardGrid = card.parentNode
  ul.removeChild(listItem);

  for (let i = 0; i < arr.length; i++) {

    if (arr[i][0] == ul.parentNode.parentNode.children[0].children[0].innerHTML
        && arr[i][1] == listItem.children[0].innerHTML
        && arr[i][2] == listItem.children[1].innerHTML
        && arr[i][3] == listItem.children[2].innerHTML
      ) {
        arr.splice(i, 1);
    }
  }

  if (ul.children.length == 0) {
    cardGrid.removeChild(card);
    sortEventsId()
    addSelect()
  }
  save()
}

function editEvent(el) {
  const listItem = el.parentNode;
  const ul = listItem.parentNode;
  const cardName = ul.parentNode.parentNode.children[0].children[0].innerHTML
  const nameBlock = listItem.querySelector('.nameBlock');
  const startTimeBlock = listItem.querySelector('.startTimeBlock');
  const finishTimeBlock = listItem.querySelector('.finishTimeBlock');
  const inputName = listItem.querySelector('.inputName');
  const inputStartTime = listItem.querySelector('.inputStartTime');
  const inputFinishTime = listItem.querySelector('.inputFinishTime');

  const containsClass = listItem.classList.contains('editMode');

  if (!containsClass) {
    inputName.value = nameBlock.innerHTML
    inputStartTime.value = startTimeBlock.innerHTML
    inputFinishTime.value = finishTimeBlock.innerHTML

    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] == cardName
          && arr[i][1] == inputName.value
          && arr[i][2] == inputStartTime.value
          && arr[i][3] == inputFinishTime.value
        ) {
          editArrId = i
      }
    }
  } else {
    nameBlock.innerHTML = inputName.value
    startTimeBlock.innerHTML = inputStartTime.value
    finishTimeBlock.innerHTML = inputFinishTime.value

    arr.splice(editArrId, 1, [cardName, inputName.value, inputStartTime.value, inputFinishTime.value]);
  }

  listItem.classList.toggle('editMode');
  save()
}

function sortSelect(selectValue) {
  if (selectValue == 'Дата') {
    return sortCards()
  }

  cardGrid.innerHTML = ''
  sortEvents(selectValue)
  sortEventsId()
}

function sortDates() {
  let arrEmpty = []

  for (let i = 0; i < arr.length; i++) {
    arrEmpty.push(arr[i][0])
  }

  let arrSort = arrEmpty.sort().filter((x, i, a) => !i || x != a[i-1])

  return arrSort
}

function sortEvents(date) {
  const list = document.createElement('ul');
  list.className = "list-group-flush";
  let arrSortTimeStartEvents = []
  let arrSortEvents = []

  for (let i = 0; i < arr.length; i++) {
    if (date == arr[i][0]) {
      arrSortTimeStartEvents.push(arr[i][2])
      arrSortEvents.push(arr[i])
    }
  }

  arrSortTimeStartEvents.sort()
  for (let z = 0; z < arrSortTimeStartEvents.length; z++) {
    for (let x = 0; x < arrSortEvents.length; x++) {
      if (arrSortTimeStartEvents[z] == arrSortEvents[x][2]) {
        let listItem = createEvent(arrSortEvents[x][1], arrSortEvents[x][2], arrSortEvents[x][3]);
        list.appendChild(listItem)
      }
    }
  }

  let cardItem = createCard(date, list)
  cardGrid.appendChild(cardItem);
}

function sortCards() {
  const arrSortDates = sortDates()

  cardGrid.innerHTML = ''

  for (let i = 0; i < arrSortDates.length; i++) {
    sortEvents(arrSortDates[i])
  }

  sortEventsId()
  addSelect()
}

function alertMessage(text) {
  $("#alertText").html('')
  $("#alertText").append(text)

  return $(".alert").show().fadeOut(3000);
}

function save() {
    localStorage.removeItem('events');
    localStorage.setItem('events', JSON.stringify(arr));
}

function load(){
    return JSON.parse(localStorage.getItem('events'));
}

sortCards()

$("#btn").on("click", function(){
    addEvent();
});

$("body").on("click", "button.edit", function(){
    editEvent(this);
});

$("body").on("click", "button.delete", function(){
    deleteEvent(this);
});

startTime.onchange = () => finishTime.value = ""

$("body").on("change", "#select", function(){
    sortSelect($('#select')[0].value)
});
