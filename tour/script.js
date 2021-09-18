const select = document.getElementById('select');
const hot_btn = document.querySelectorAll('button');
const area_title = document.getElementById('area-title');
const content = document.getElementById('content');
const go_top = document.getElementById('go-top');
const loading = document.getElementById('loading');
const page = document.getElementById('pagination');

let area_data = [];

setTimeout(() => {
  loading.classList.add('close');
  setTimeout(() => {
    getData();
  }, 200)
},1000)

// Fetch the api and get data
function getData() {
  fetch('https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json')
  .then(res => res.json())
  .then(data => {
    const len = data.result.records.length;
    for (let i = 0; i < len; i++) {
      area_data.push(data.result.records[i]);
    }

    filterRepeatName();
    pagination(area_data);
  });
}

// Pagiantion
function pagination(data, now_page = 1) {
  const data_total = data.length;
  const each_page = 8;
  const page_total = Math.ceil(data_total / each_page);

  let current_page = now_page;

  if(current_page > page_total) {
    current_page = page_total;
  }

  const min_data = current_page * each_page - each_page + 1;
  const max_data = current_page * each_page;
  const new_data = [];

  data.forEach((item, index) => {
    const num = index + 1

    if(num >= min_data && num <= max_data) {
      new_data.push(item);
    }
  })

  const page = {
    page_total,
    current_page,
    has_prev: current_page > 1,
    has_next: current_page < page_total,
  }
  updatePageDOM(page);
  updateDOM(new_data);
}

// Update pagination DOM
function updatePageDOM(item) {
  const { page_total, current_page, has_prev, has_next } = item;
  let str = '';

  if(has_prev) {
    str += `
    <li class="page-item">
      <a class="page-link" href="#" data-page="${Number(current_page) - 1}">Prev</a>
    </li>`;
  } else {
    str += `
    <li class="page-item disabled">
      <span style="color:#D0D0D0" class="page-link">Prev</span>
    </li>`;
  }

  for(let i = 1; i <= page_total; i++) {
    if(Number(current_page) === i) {
      str += `
      <li class="page-item active">
        <a style="color:#fff; cursor: default;" href="#" class="page-link" data-page="${i}">${i}</a>
      </li>`
    } else {
      str += `
      <li class="page-item">
        <a href="#" class="page-link" data-page="${i}">${i}</a>
      </li>`
    }
  }

  if(has_next) {
    str += `
    <li class="page-item">
      <a class="page-link" href="#" data-page="${Number(current_page) + 1}">Next</a>
    </li>`;
  } else {
    str += `
    <li class="page-item disabled">
      <span style="color:#D0D0D0" class="page-link">Next</span>
    </li>`;
  }
  
  page.innerHTML = str;
}

// filter the repeat name
function filterRepeatName() {
  const array = area_data.map(item => item.Zone);
  const filter_array = array.filter((item, index) => array.indexOf(item) === index);
  
  let str = '';

  for(let i = 0; i < filter_array.length; i++) {
    str += `<option value="${filter_array[i]}">${filter_array[i]}</option>`
  }
  
  select.innerHTML = 
  '<option value="" selected disabled>--請選擇行政區--</option><option value="全部區域">全部區域</option>' +  str;
}

// Select the Area
function selectArea(e) {
  let filter_array = e.target.value !== '全部區域'
  ? area_data.filter(item => e.target.value === item.Zone)
  : area_data;

  area_title.innerText = e.target.value;
  select.value = e.target.value;
  
  pagination(filter_array);
}

// Update DOM
function updateDOM(item) {
  let str = '';
  
  for(let i = 0; i < item.length; i++) {
    const { Name, Zone, Picture1, Tel, Add, Opentime, Ticketinfo } = item[i];
    str += `
    <div class="area-content">
    <div class="area-header" style="background-image: url('${Picture1}');">
      <span>${Name}</span>
      <span>${Zone}</span>
    </div>
    <div class="area-body">
      <ul class="area-info">
        <li>
          <img src="https://i.postimg.cc/L5QZ8Dn6/icons-clock.png" alt="">${Opentime}
        </li>
        <li>
          <img src="https://i.postimg.cc/MG0MQqvL/icons-pin.png" alt="">${Add}
        </li>
        <li class="two-tag">
          <span>
            <img src="https://i.postimg.cc/1XXf2FJx/icons-phone.png" alt="">${Tel}
          </span>
          <span>
            <img src="https://i.postimg.cc/JnPspx3c/icons-tag.png" alt="">${Ticketinfo}
          </span>
        </li>
      </ul>
    </div>
  </div>
    `
  }
  content.innerHTML = str;
}

// Event listener
select.addEventListener('change', selectArea);
hot_btn.forEach(btn => btn.addEventListener('click',selectArea));
content.addEventListener('click', e => {
  console.log(e.target.parentElement)
})

page.addEventListener('click', e => {
  e.preventDefault();
  if(e.target.nodeName !== 'A') return;
  const page_index = e.target.dataset.page;
  pagination(area_data, page_index);
})

window.addEventListener('scroll', () => {
  const { scrollTop } = document.documentElement;
  if(scrollTop > 200) {
    go_top.classList.add('show');
  } else {
    go_top.classList.remove('show')
  }
})

go_top.addEventListener('click', () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
})
