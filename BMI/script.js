const inputHeight = document.getElementById('height');
const inputWeight = document.getElementById('weight');
const alert = document.getElementById('alert');
const result_btn = document.getElementById('result-btn');
const hide_btn = document.getElementById('hide-btn');
const bmi_list = document.getElementById('bmi-list');
const empty = document.getElementById('empty');

let data = JSON.parse(localStorage.getItem('bmi')) || [];
let status_class;
let status;
let hide_class;
let return_bg;
let date = new Date();

// 顯示hide btn & 更新hide-btn裡的DOM
function showHideBtn(obj) {
  const { hide_class, bmi, return_bg} = obj;
  hide_btn.style.display = 'block';
  result_btn.style.display = 'none';

  switch(true) {
    case bmi < 18.5:
      hide_btn.classList.add('balance-hide');
      break;
    case bmi >= 18.5 && bmi < 24:
      hide_btn.classList.add('under-hide');
      break;
    case bmi >= 24:
      hide_btn.classList.add('over-hide');
      break;
  }

  hide_btn.innerHTML = `
    <div class="content">
      <span>${bmi}</span>
      <span>BMI</span>
      <img style="background: ${return_bg}" class="return-btn" src="https://i.postimg.cc/hP7htyRR/icons-loop.png" alt="return-btn">
    </div>
  `
}

// 取得BMI資料
function getBmiData() {
  if(inputHeight.value !== '' && inputWeight.value !== '') {
    const calc = +(inputWeight.value / (inputHeight.value * inputHeight.value) * 10000)
    .toFixed(2);

    if(calc < 18.5) {
      status_class = 'under-weight';
      status = '過輕';
      hide_class = 'balance-hide';
      return_bg = '#31baf9';
    } else if(calc >= 18.5 &&　calc < 24) {
      status_class = 'balance';
      status = '適中';
      hide_class = 'under-hide';
      return_bg = '#86d73f';
    } else {
      status_class = 'over-weight';
      status = '過胖';
      hide_class = 'over-hide';
      return_bg = '#ff1200';
    }

    let obj = {
      bmi: calc,
      status_class: status_class,
      hide_class: hide_class,
      return_bg: return_bg,
      status: status,
      date: `${date.getFullYear()}-${date.getMonth()+ 1}-${date.getDate()}`,
      height: inputHeight.value,
      weight: inputWeight.value,
      index: Math.floor(Math.random() * 100)
    }

    inputHeight.value = '';
    inputWeight.value = '';
    alert.innerText = '';

    data.push(obj);
    localStorage.setItem('bmi', JSON.stringify(data));
    showHideBtn(obj);
    UpdateDOM();
  } else {
    alert.innerText = '*欄位不得為空'
  }
}

// Update obj to Dom
function UpdateDOM() {
  let str = '';
  for(let i = 0; i <data.length; i++) {
    const { bmi, status_class, date, status, weight, height } = data[i];
    str += `
      <li class="${status_class}">
        <span>${status}</span>
        <span>BMI</span><span>${bmi}</span>
        <span>weight</span><span>${weight}kg</span>
        <span>height</span><span>${height}cm</span>
        <span>${date}</span>
        <a class="remove" id="remove" href="#" data-index="${i}">刪除</a>
      </li>
    `;
  }
  bmi_list.innerHTML = str; 
}

UpdateDOM();

// Event Listener
result_btn.addEventListener('click', getBmiData);

bmi_list.addEventListener('click', e => {
  e.preventDefault();
  const index = e.target.dataset.index;
  if(e.target.nodeName !== 'A') { return };
  data.splice(index, 1);
  localStorage.setItem('bmi', JSON.stringify(data));
  UpdateDOM();
})

hide_btn.addEventListener('click', e => {
  e.preventDefault();
  const node = e.target.nodeName;
  if(node !== 'IMG') { return }
  hide_btn.style.display = 'none';
  result_btn.style.display = 'block';

  if(hide_btn.classList.contains('balnace')) {
    hide_btn.classList.remove('balance');
  } else if(hide_btn.classList.contains('under-hide')) {
    hide_btn.classList.remove('under-hide');
  } else {
    hide_btn.classList.remove('over-hide');
  }
})

empty.addEventListener('click', () => {
  data = [];
  localStorage.setItem('bmi', JSON.stringify(data));
  UpdateDOM();
})
