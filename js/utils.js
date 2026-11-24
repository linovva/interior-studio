export function createImg(src, alt) {
    const img = document.createElement('img');

    img.src = src || 'assets/images/default.jpg';
    img.alt = alt || 'Изображение проекта';

    img.onerror = function() {
        this.onerror = null;
        this.src = 'assets/images/default.jpg';
    };

    return img;
}