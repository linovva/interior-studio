
const projects = [
    {
        id: 1,
        name: "Современная спальня",
        style: "Современный",
        roomType: "Спальня",
        description: "Проект спальни в современном стиле",
        photos: [
            "assets/images/living1.jpg",
            "assets/images/living2.jpg",
            "assets/images/living3.jpg",
            "assets/images/living4.jpg",
            "assets/images/living5.jpg"
        ],
        panoramas: "assets/panoramas/bedroom.png",
        model3D: "assets/interior-models/bedroom.glb",
        objects: [{
                    name: "Ковёр",
                    image: "assets/images/sofa.jpg",
                    description: "Серый ковер",
                    modelAndroid: "assets/ar-models/carpet.glb",
                    modelIOS: "assets/ar-models/carpet.usdz"
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
