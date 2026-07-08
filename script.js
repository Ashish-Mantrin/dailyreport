// ================= PASSWORD =================

function checkPassword() {
  let password = document.getElementById('passwordInput').value;

  if (password === 'A1') {
    document.getElementById('passwordPage').classList.add('hidden');

    document.getElementById('homePage').classList.remove('hidden');
  } else {
    document.getElementById('wrongPassword').innerHTML = '❌ Wrong Password';
  }
}

// ================= VARIABLES =================

let currentDate = '';

const datePicker = document.getElementById('datePicker');

const tableBody = document.getElementById('tableBody');

// ================= START =================

datePicker.value = new Date().toISOString().split('T')[0];

showDate();

datePicker.addEventListener('change', showDate);

// ================= DATE =================

function showDate() {
  let d = new Date(datePicker.value);

  document.getElementById('dayName').value = d.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  let start = new Date(d.getFullYear(), 0, 1);

  let number = Math.floor((d - start) / (1000 * 60 * 60 * 24)) + 1;

  document.getElementById('dayNumber').value = 'Day ' + number;
}

// ================= OPEN REPORT =================

function openReport() {
  currentDate = datePicker.value;

  document.getElementById('homePage').classList.add('hidden');

  document.getElementById('reportPage').classList.remove('hidden');

  document.getElementById('reportDate').value = datePicker.value;

  document.getElementById('reportDay').value =
    document.getElementById('dayName').value;

  document.getElementById('reportNumber').value =
    document.getElementById('dayNumber').value;

  loadTable();

  loadImage();
}

// ================= BACK =================

function goBack() {
  document.getElementById('reportPage').classList.add('hidden');

  document.getElementById('homePage').classList.remove('hidden');
}

// ================= TABLE =================

function addRow(data = {}) {
  let row = tableBody.insertRow();

  row.innerHTML = `


<td>${tableBody.rows.length}</td>


<td>
<input value="${data.batch || ''}">
</td>


<td>
<input value="${data.product || ''}">
</td>


<td>
<input value="${data.size || ''}">
</td>


<td>
<input value="${data.batchSize || ''}">
</td>


<td>
<input value="${data.total || ''}">
</td>


<td>

<input 
type="date"
value="${data.prod || ''}"
onchange="setExpiry(this)">

</td>


<td>

<input
type="date"
value="${data.exp || ''}">

</td>


`;

  row.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', saveTable);
  });
}

function deleteRow() {
  if (tableBody.rows.length > 0) {
    tableBody.deleteRow(-1);

    saveTable();
  }
}

// ================= AUTO EXPIRY =================

function setExpiry(input) {
  if (!input.value) return;

  let production = new Date(input.value);

  production.setFullYear(production.getFullYear() + 1);

  production.setDate(production.getDate() - 1);

  let expiry = production.toISOString().split('T')[0];

  input.parentElement.nextElementSibling.querySelector('input').value = expiry;

  saveTable();
}

// ================= SAVE TABLE =================

function saveTable() {
  let rows = [];

  tableBody.querySelectorAll('tr').forEach((row) => {
    let input = row.querySelectorAll('input');

    rows.push({
      batch: input[0].value,

      product: input[1].value,

      size: input[2].value,

      batchSize: input[3].value,

      total: input[4].value,

      prod: input[5].value,

      exp: input[6].value,
    });
  });

  localStorage.setItem(
    'dailyReport_' + currentDate,

    JSON.stringify(rows),
  );
}

// ================= LOAD TABLE =================

function loadTable() {
  tableBody.innerHTML = '';

  let saved = localStorage.getItem('dailyReport_' + currentDate);

  if (saved) {
    JSON.parse(saved).forEach((row) => {
      addRow(row);
    });
  } else {
    for (let i = 0; i < 5; i++) {
      addRow();
    }
  }
}

// ================= IMAGE SYSTEM =================

const imageInput = document.getElementById('imageInput');

const previewImage = document.getElementById('previewImage');

const deleteImageBtn = document.getElementById('deleteImageBtn');

imageInput.addEventListener('change', function () {
  let file = this.files[0];

  if (!file) return;

  let reader = new FileReader();

  reader.onload = function () {
    localStorage.setItem(
      'image_' + currentDate,

      reader.result,
    );

    loadImage();
  };

  reader.readAsDataURL(file);
});

function loadImage() {
  let image = localStorage.getItem('image_' + currentDate);

  if (image) {
    previewImage.src = image;

    previewImage.style.display = 'block';

    deleteImageBtn.style.display = 'block';
  } else {
    previewImage.style.display = 'none';

    deleteImageBtn.style.display = 'none';
  }
}

function deleteImage() {
  localStorage.removeItem('image_' + currentDate);

  previewImage.src = '';

  previewImage.style.display = 'none';

  deleteImageBtn.style.display = 'none';
}

// ================= IMAGE ZOOM =================

function zoomImage() {
  if (!previewImage.src) return;

  document.getElementById('bigImage').src = previewImage.src;

  document.getElementById('imageViewer').style.display = 'flex';
}

function closeZoom() {
  document.getElementById('imageViewer').style.display = 'none';
}
