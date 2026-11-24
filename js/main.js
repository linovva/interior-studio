import { createImg } from './utils.js';
// Получение данных о проектах из JSON-файла
async function loadProjects(){};

// проверяет массив проектов на пустоту
function isEmptyProject(projects) {
    if (!projects || projects.length === 0) return 0;
    return 1;
}


// Отображение проектов на странице 
function displayProjects(projects) {
    const projectContainer = document.querySelector('.cards-container');
    projectContainer.innerHTML = '';

    if (!isEmptyProject(projects)) {
        projectContainer.textContent = "Проекты не найдены";
        return;
    }

    projects.forEach(project => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const img = createImg(project.photos[0], project.name);

        card.appendChild(img);

        const title = document.createElement('h3');
        title.textContent = project.name || 'Без названия';
        card.appendChild(title);

        const description = document.createElement('p');
        description.textContent = project.description || 'Описание отсутствует';
        card.appendChild(description);

        const style = document.createElement('p');
        style.textContent = `Стиль: ${project.style || 'Не указан'}`;
        card.appendChild(style);

        const roomType = document.createElement('p');
        roomType.textContent = `Тип помещения: ${project.roomType || 'Не указан'}`;
        card.appendChild(roomType);

        const linkButton = document.createElement('a');
        linkButton.href = `project.html?id=${project.id}`
        linkButton.classList.add('card-link');
        linkButton.textContent = '>';
        card.appendChild(linkButton);

        projectContainer.appendChild(card);
    });
}

// фильтрует проекты по стилу и типу помещения
function filterProjects(projects, styleFilter, roomFilter) {
    const filteredProjects = [];

    projects.forEach(project => {
        if ((project.style === styleFilter || styleFilter === 'all') &&
            (project.roomType === roomFilter || roomFilter === 'all')) filteredProjects.push(project);
    })

    displayProjects(filteredProjects);
}

// устанавливает обработчики для фильтр-формы
function setupFilterListener(){
    const styleFilter = document.getElementById('styleFilter');
    const roomFilter = document.getElementById('roomFilter');
    const filterForm = document.getElementById('filterForm');
    
    styleFilter.addEventListener('change', () => {
        filterProjects(projects, styleFilter.value, roomFilter.value);
    });

    roomFilter.addEventListener('change', () => {
        filterProjects(projects, styleFilter.value, roomFilter.value);
    });

    filterForm.addEventListener('reset', () => {
        displayProjects(projects);
    });
}

// обработчики для кнопки-связи
function setupContactButtonListener(){
    const contactButton = document.getElementById('contactButton');
    const contactModal = document.getElementById('contactModal');

    contactButton.addEventListener('click', () =>{
        contactModal.showModal();
    });

    document.addEventListener('click', (e) =>{
        if (!e.target.classList.contains('close-button')) return;
        contactModal.close();
    })
}

// Проверка данных обращения
function validateContactForm(name, email, message) {
    const errors = [];

    if (name.length === 0) {
        errors.push('Введите имя');
    }

    if (email.length === 0) {
        errors.push('Введите email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Некорректный email');
    }

    if (message.length === 0) {
        errors.push('Введите сообщение');
    } else if (message.length > 1000) {
        errors.push('Сообщение слишком длинное');
    }

    return errors;
}

// Обработка отправки формы
function setupContactFormListener() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const message = form.elements.message.value.trim();

        const errors = validateContactForm(name, email, message);

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const request = {
            name: name,
            email: email,
            message: message
        };

        console.log('Подготовленное обращение:', request);
        alert('Данные обращения успешно проверены');

        form.reset();
    });
}

displayProjects(projects);
setupFilterListener();
setupContactButtonListener();
setupContactFormListener();