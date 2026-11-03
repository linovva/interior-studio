
const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id'));
const projectContainer = document.getElementById('projectContainer');


function findProjectById(projects, id) {
    for (const project of projects) {
        if (project.id === id) return project;
    }

    return null;
}

// Отображение общей информации о проекте
function displayProjectInfo(project) {
    // Информация о проекте
    const projectInfo = document.getElementById('project-info');
    projectInfo.innerHTML = '';
    projectInfo.classList.add('hero-content');

    const subtitle = document.createElement('h2');
    subtitle.textContent = "ПРОЕКТ";
    projectInfo.appendChild(subtitle);

    const title = document.createElement('h1');
    title.textContent = project.name || 'Без названия';
    projectInfo.appendChild(title);

    const description = document.createElement('p');
    description.textContent = project.description || 'Описание отсутствует';
    projectInfo.appendChild(description);

    const style = document.createElement('p');
    style.textContent = `Стиль: ${project.style || 'Не указан'}`;
    projectInfo.appendChild(style);

    const roomType = document.createElement('p');
    roomType.textContent = `Тип помещения: ${project.roomType || 'Не указан'}`;
    projectInfo.appendChild(roomType);
}

// Отображение галереи проекта
function displayGallery(project) {
    // Галерея
    const projectInteract = document.getElementById('project-interact');
    projectInteract.innerHTML = '';

    const gallery = document.createElement('div');
    gallery.classList.add('gallery');
    projectInteract.appendChild(gallery);

    // Большая фотография
    const main = document.createElement('div');
    main.classList.add('gallery-main');

    const mainImg = document.createElement('img');
    mainImg.src = project.photos?.[0] || 'assets/images/default.jpg';
    mainImg.alt = project.name || 'Изображение проекта';
    mainImg.id = 'mainImg';

    mainImg.onerror = function() {
        this.onerror = null;
        mainImg.src = 'assets/images/default.jpg';
    };

    main.appendChild(mainImg);

    const prevButton = document.createElement('button');
    prevButton.id = 'prevButton';
    prevButton.classList.add('gallery-button');
    prevButton.textContent = '←';

    const nextButton = document.createElement('button');
    nextButton.id = 'nextButton';
    nextButton.classList.add('gallery-button');
    nextButton.textContent = '→';

    main.appendChild(prevButton);
    main.appendChild(nextButton);
    gallery.appendChild(main);

    // Миниатюры
    const sidebar = document.createElement('div');
    sidebar.classList.add('gallery-sidebar');

    const thumbnails = document.createElement('div');
    thumbnails.classList.add('gallery-thumbnails');

    project.photos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = photo || 'assets/images/default.jpg';
        img.alt = project.name || 'Изображение проекта';
        img.dataset.number = index;

        img.onerror = function() {
            this.onerror = null;
            img.src = 'assets/images/default.jpg';
        };

        thumbnails.appendChild(img);
    });

    const upButton = document.createElement('button');
    upButton.id = 'scrollUp';
    upButton.classList.add('gallery-button');
    upButton.textContent = '↑';

    const downButton = document.createElement('button');
    downButton.id = 'scrollDown';
    downButton.classList.add('gallery-button');
    downButton.textContent = '↓';

    sidebar.appendChild(upButton);
    sidebar.appendChild(thumbnails);
    sidebar.appendChild(downButton);

    gallery.appendChild(sidebar);
}

// Отображение кнопок открытия панорами и 3д-модели, если они есть
function displayInteractButtons(project) {
    // 360-панорама и 3D-модель, если есть
    if (project.panoramas === null && project.model3D === null) return;
    
    const projectInteract = document.getElementById('project-interact');

    const interactPart = document.createElement('div');
    interactPart.classList.add('interactPart');

    if (project.panoramas != null) {
        const buttonPanorama = document.createElement('button');
        buttonPanorama.textContent = '360-панорама интерьера';
        interactPart.appendChild(buttonPanorama);
    }

    // 3Д-модель, если есть
    if (project.model3D != null) {
        const buttonModel3D = document.createElement('button');
        buttonModel3D.textContent = '3D-модель интерьера';
        interactPart.appendChild(buttonModel3D);
    }

    projectInteract.appendChild(interactPart);
}

// Отображение кнопки просмотра в AR
function displayARObjects(project) {
    // Объекты интерьера, доступные в AR, если есть
    if (project.objects.length > 0) {
        const projectInteract = document.getElementById('project-interact');

        const titleAR = document.createElement('h2');
        titleAR.textContent = "Объекты доступные для просмотра в AR";
        projectInteract.appendChild(titleAR);

        const cardContainerAR = document.createElement('div');
        cardContainerAR.classList.add('card-container-AR');

        project.objects.forEach(object => {
            const cardAR = document.createElement('div');

            const imgAR = document.createElement('img');
            imgAR.src = object.image || 'assets/images/default.jpg';
            imgAR.alt = object.name;

            imgAR.onerror = function() {
                this.onerror = null;
                imgAR.src = 'assets/images/default.jpg';
            };

            cardAR.appendChild(imgAR);

            const nameAR = document.createElement('h4');
            nameAR.textContent = object.name;
            cardAR.appendChild(nameAR);

            const descriptionAR = document.createElement('p');
            descriptionAR.textContent = object.description;
            cardAR.appendChild(descriptionAR);

            const buttonAR = document.createElement('button');
            buttonAR.textContent = 'Посмотреть в AR';
            cardAR.appendChild(buttonAR);

            cardContainerAR.appendChild(cardAR);
        });

        projectInteract.appendChild(cardContainerAR);
    }
}

function displayProject(project) {
    if (!project) {
        projectContainer.textContent = "Проекты не найдены";
        return;
    }

    displayProjectInfo(project);
    displayGallery(project);
    displayInteractButtons(project);
    displayARObjects(project);
}

// Обработчик мини-галереи
function setupMiniGalleryListener() {
    const upButton = document.getElementById('scrollUp');
    const downButton = document.getElementById('scrollDown');
    const thumbnails = document.querySelector('.gallery-thumbnails');

    upButton.addEventListener('click', () => {
        thumbnails.scrollBy({
            top: -150,
            behavior: 'smooth'
        });
    });

    downButton.addEventListener('click', () => {
        thumbnails.scrollBy({
            top: 150,
            behavior: 'smooth'
        });
    });
}

// Обработчик главной фотографии
function setupGalleryListener(){
    let currentIndex = 0;
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const mainImg = document.getElementById('mainImg');
    const photos = document.querySelectorAll('.gallery-thumbnails img');
    const thumbnails = document.querySelector('.gallery-thumbnails');

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        mainImg.src = photos[currentIndex].src;
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1 + photos.length) % photos.length;
        mainImg.src = photos[currentIndex].src;
    });

    thumbnails.addEventListener('click', (e) =>{
        if(e.target.tagName != "IMG") return;

        currentIndex = Number(e.target.dataset.number);
        mainImg.src = e.target.src;
    });

}

// Обработчик кнопки 360-панорамы
function setupPanoramaListener(){}

// Обработчик кнопки 3Д-модели
function setup3DmodelListener(){}

// Обработчик кнопки AR
function setupARListener(){}

const project = findProjectById(projects, id);

if (project) {
    displayProject(project);
    setupMiniGalleryListener();
    setupGalleryListener();
} else {
    displayProject(null);
}

