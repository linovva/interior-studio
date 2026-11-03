
const projects = [
    {
        id: 1,
        name: "Современная гостиная",
        style: "Современный",
        roomType: "Гостиная",
        description: "Проект светлой гостиной в современном стиле.",
        photos: [
            "assets/images/living1.jpg",
            "assets/images/living2.jpg",
            "assets/images/living3.jpg",
            "assets/images/living4.jpg",
            "assets/images/living5.jpg"
        ],
        panoramas: "Панорама1",
        model3D: "Модель1",
        objects: [{
                    name: "Диван",
                    image: "assets/images/sofa.jpg",
                    description: "Изумрудный мягкий диван",
                    modelAndroid: "assets/models/sofa.glb",
                    modelIOS: "assets/models/sofa.usdz"
                }]
    },
    {
        id: 2,
        name: "Скандинавская кухня",
        style: "Скандинавский",
        roomType: "Кухня",
        description: "Кухня с натуральными материалами и светлой отделкой.",
        photos: [
            "assets/images/kitchen1.jpg",
            "assets/images/kitchen2.jpg"
        ],
        panoramas: null,
        model3D: null,
        objects: []
    },
    {
        id: 3,
        name: "Минималистичная спальня",
        style: "Минимализм",
        roomType: "Спальня",
        description: "Спальня с лаконичным интерьером.",
        photos: [
            "assets/images/bedroom1.jpg",
            "assets/images/bedroom2.jpg"
        ],
        panoramas: null,
        model3D: null,
        objects: []
    }
];
