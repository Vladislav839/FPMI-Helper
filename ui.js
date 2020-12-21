function redirectToShedule() {
    document.getElementById('main-area').innerHTML = shedulePage
}

function handleNmberOfGroups() {
    console.log(document.getElementById('course').value)
}

function detectTeacher(value) {
    const regex = /[А-Я]\./
    return regex.test(value)
}
function detectClassroom(value) {
    const regex = /[0-9]+[А-Я]*/
    return regex.test(value)
}
function parseClass(array) {
    const lesson = {
        name: "",
        type: "",
        teachers: [],
        classRooms: []
    }

    lesson.name = array[0].v;
    lesson.type = array[0].t;
    if(array.length > 1) {
        for (let i = 1; i < array.length; i++) {
            if(detectTeacher(array[i].v)) {
                lesson.teachers.push(array[i].v)
            } else {
                lesson.classRooms.push(array[i].v)
            }
        }
    }

    if(lesson.teachers.length == 0) lesson.teachers = [""];
    if(lesson.classRooms.length == 0) lesson.classRooms = [""];

    lesson.teachers = [...new Set(lesson.teachers)];
    lesson.classRooms = [...new Set(lesson.classRooms)]

    return lesson
}

function handleFetch() {
    const course = document.getElementById('course').value;
    const group = document.getElementById('group').value;
    const day = document.getElementById('day').value;
    const link = LinksService.getLink(course);
    fetchData(link, group, day);
}

function drawTable(classesMap) {
    let html = `
    <table class="table table-bordered">
    <thead>
      <tr>
        <th scope="col">Время</th>
        <th scope="col">Дисциплина</th>
        <th scope="col">Тип</th>
        <th scope="col">Преподаватель</th>
        <th scope="col">Аудитория</th>
      </tr>
    </thead>
    <tbody>`;
    for(let [key, value] of classesMap) {
        html += `
            <tr>
            <td>${key}</td>
            `;
        const lesson = parseClass(value);
        html += `<td>${lesson.name}</td>\n`;
        html += `<td>${lesson.type}</td>\n`;
        if(lesson.teachers.length > 1) {
           html += `<td><table style="width: 100%; height: 100%"><tr><td>${lesson.teachers[0]}</td></tr><tr><td>${lesson.teachers[1]}</td></tr></table></td>`;
        } else {
            html += `<td>${lesson.teachers[0]}</td>\n`;
        }
        if(lesson.classRooms.length > 1) {
            html += `<td><table style="width: 100%; height: 100%"><tr><td>${lesson.classRooms[0]}</td></tr><tr><td>${lesson.classRooms[1]}</td></tr></table></td>`;
        } else {
            html += `<td>${lesson.classRooms[0]}</td>\n`;
        }
        html += '</tr>\n'
    }
    html += `</tbody>\n
            </table>\n`;
    
    return html;
}

const shedulePage = `
<form>
<div class="form-group">
  <label for="exampleFormControlSelect1">Выберете курс</label>
  <select class="form-control" id="course" onchange="handleNmberOfGroups()">
    <option>1</option>
    <option>2</option>
  </select>
</div>
<div class="form-group">
  <label for="exampleFormControlSelect1">Выберете группу</label>
  <select class="form-control" id="group">
    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
    <option>5</option>
    <option>6</option>
    <option>7</option>
    <option>8</option>
    <option>9</option>
    <option>10</option>
    <option>11</option>
    <option>12</option>
    <option>13</option>
    <option>14</option>
  </select>
</div>
<div class="form-group">
  <label for="exampleFormControlSelect1">Выберете день недели</label>
  <select class="form-control" id="day">
    <option>понедельник</option>
    <option>вторник</option>
    <option>среда</option>
    <option>четверг</option>
    <option>пятница</option>
    <option>суббота</option>
  </select>
</div>
</form>
<button class="btn btn-primary mb-2" id="submit-button" onclick="handleFetch()">Узнать</button>`

let homeButton = document.getElementById('home');
homeButton.addEventListener('click', () => {
    document.getElementById('main-area').innerHTML = ` <br>
    <h1>FPMI-Helper</h1>
    <p>Добро пожаловать в FPMI-Helper</p>
    <p>Здесь вы сможете узнать свое распиание</p>
    <button class="btn btn-success to-shedule" onclick="redirectToShedule()">Узнать распиание</button>`;
})
