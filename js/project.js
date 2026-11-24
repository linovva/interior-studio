import { initPanoramaViewer, startRendering as startPanoramaRendering, stopRendering as stopPanoramaRendering } from "./panorama360.js";
import { init3DViewer, startRendering as start3DRendering, stopRendering as stop3DRendering } from "./viewer3D.js";
import { createImg } from './utils.js';

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
    if (!project.photos?.length) return;
    // Галерея
    const projectInteract = document.getElementById('project-interact');
    projectInteract.innerHTML = '';

    const gallery = document.createElement('div');
    gallery.classList.add('gallery');
    projectInteract.appendChild(gallery);

    // Большая фотография
    const main = document.createElement('div');
    
    main.classList.add('gallery-main');

    const mainImg = createImg(project.photos?.[0], project.name)
    mainImg.id = 'mainImg';
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
        const img = createImg(photo, project.name);
        img.dataset.number = index;

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
        buttonPanorama.id = 'panoramaButton';
        interactPart.appendChild(buttonPanorama);
    }

    // 3Д-модель, если есть
    if (project.model3D != null) {
        const buttonModel3D = document.createElement('button');
        buttonModel3D.textContent = '3D-модель интерьера';
        buttonModel3D.id = 'modelButton';
        interactPart.appendChild(buttonModel3D);
    }

    projectInteract.appendChild(interactPart);
}

const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isAndroid = /Android/i.test(navigator.userAgent);

// Отображение кнопки просмотра в AR
async function displayARObjects(project) {
    // Проверяем ОС и поддержку AR
    const ARViewer = document.getElementById('ARViewer');

    if (isIOS) {
        const supportsAR = document.createElement('a').relList.supports('ar');
        if (!supportsAR) return;
    }
    
    else if (isAndroid) {
        const supportsAR = await navigator.xr?.isSessionSupported('immersive-ar') ?? false;
        if (!supportsAR) return;
    } else { // если это пк
        return; 
    }

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

            const imgAR = createImg(object.image, object.name);

            cardAR.appendChild(imgAR);

            const nameAR = document.createElement('h4');
            nameAR.textContent = object.name;
            cardAR.appendChild(nameAR);

            const descriptionAR = document.createElement('p');
            descriptionAR.textContent = object.description;
            cardAR.appendChild(descriptionAR);

            const buttonAR = document.createElement('button');
            buttonAR.textContent = 'Посмотреть в AR';
            buttonAR.classList.add('ar-button');

            if (isIOS) buttonAR.dataset.modelIOS = object.modelIOS; 
            buttonAR.dataset.model = object.modelAndroid;

            cardAR.appendChild(buttonAR);

            cardContainerAR.appendChild(cardAR);
        });

        projectInteract.appendChild(cardContainerAR);
    }
}

async function displayProject(project) {
    if (!project) {
        projectContainer.textContent = "Проекты не найдены";
        return;
    }

    displayProjectInfo(project);
    displayGallery(project);
    displayInteractButtons(project);
    await displayARObjects(project);
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

let initializedPanoramaViewer = false;
let loadingPanoramaViewer = false;

// Обработчик кнопки 360-панорамы
function setupPanoramaListener(project){
    const openButton = document.getElementById('panoramaButton');
    const panoramaModal = document.getElementById('panoramaModal');
    const closeButton = panoramaModal.querySelector('.modal-close');

    openButton.addEventListener('click', async () => {
        panoramaModal.showModal();
        if (loadingPanoramaViewer) return;
        try {
            if (!initializedPanoramaViewer) {
                loadingPanoramaViewer = true;
                await initPanoramaViewer(project);
                initializedPanoramaViewer = true;
            }
            if (panoramaModal.open) {
            startPanoramaRendering();
            }
        } catch (error) {
            console.error(error);
            alert("Не удалось загрузить панораму")
        } finally {
            loadingPanoramaViewer = false;
        }
    });

    closeButton.addEventListener('click', () => {
        panoramaModal.close();
    });

    panoramaModal.addEventListener('close', () => {
        stopPanoramaRendering();
    });
}

let initialized3DViewer = false;
let loading3DViewer = false;

// Обработчик кнопки 3Д-модели
function setup3DmodelListener(project){
    const openButton = document.getElementById('modelButton');
    const modelModal = document.getElementById('modelModal');
    const closeButton = modelModal.querySelector('.modal-close');

    openButton.addEventListener('click', async () =>{
        modelModal.showModal();
        if (loading3DViewer) return;
        try { 
            if(!initialized3DViewer) {
                loading3DViewer = true;
                await init3DViewer(project);
                initialized3DViewer = true;
            } 
            if (modelModal.open) {
                start3DRendering();
            }
        } catch (error) {
            alert('Не удалось загрузить модель');
            console.error(error);
        } finally {
            loading3DViewer = false;
        }
    });

    closeButton.addEventListener('click', () => {
        modelModal.close();
    });

    modelModal.addEventListener('close', () => {
        stop3DRendering();
    });
}

let initARViewer = false; 

// Обработчик кнопки AR
function setupARListener(project){
    const ARModal = document.getElementById('ARModal');
    const closeButton = ARModalModal.querySelector('.modal-close');
    const ARViewer = ARModal.querySelector('#ARViewer');
    const openButtons = document.querySelectorAll('.ar-button');

    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            ARModal.showModal();

            if (isIOS) {
                ARViewer.src = button.dataset.model;
                ARViewer.setAttribute(
                    'ios-src',
                    button.dataset.modelIOS
                );
            }

            // Здесь будет твоя логика для Android
        });
    });

    closeButton.addEventListener('click', () => {
        ARModal.close();
    });

    ARModal.addEventListener('close', () => {});
}

const project = findProjectById(projects, id);

if (project) {
    await displayProject(project);
    if (project.photos?.length > 0) {
        setupMiniGalleryListener();
        setupGalleryListener();
    }

    if (project.panoramas != null) {
        setupPanoramaListener(project);
    }

    if (project.model3D != null) {
        setup3DmodelListener(project);
    }

    if (project.objects?.length > 0) {
        setupARListener(project);
    }
} else {
    displayProject(null);
}

