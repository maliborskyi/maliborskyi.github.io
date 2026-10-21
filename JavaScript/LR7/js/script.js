
"use strict";

// Координати коледжу
const COLLEGE = {
    latitude: 48.94321,
    longitude: 24.73380
};

const EARTH_RADIUS_KM = 6371;

let map = null;
let currentMarker = null;
let accuracyCircle = null;
let destinationMarker = null;
let watchId = null;
let lastPosition = null;
let lastTrackPoint = null;
let followMyLocation = true;

// Отримання HTML-елементів
const els = {
    latitude: document.getElementById("latitude"),
    longitude: document.getElementById("longitude"),
    accuracy: document.getElementById("accuracy"),
    measuredAt: document.getElementById("measuredAt"),
    distance: document.getElementById("distance"),
    message: document.getElementById("message"),
    trackingStatus: document.getElementById("trackingStatus"),
    getLocation: document.getElementById("getLocation"),
    watch: document.getElementById("watch"),
    clearWatch: document.getElementById("clearWatch"),
    centerMyLocation: document.getElementById("centerMyLocation"),
    destinationForm: document.getElementById("destinationForm"),
    destinationLat: document.getElementById("destinationLat"),
    destinationLon: document.getElementById("destinationLon"),
    destinationMessage: document.getElementById("destinationMessage")
};

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Обчислення відстані за формулою гаверсинуса
function computeDistance(startCoords, destCoords) {
    const lat1 = degreesToRadians(startCoords.latitude);
    const lon1 = degreesToRadians(startCoords.longitude);
    const lat2 = degreesToRadians(destCoords.latitude);
    const lon2 = degreesToRadians(destCoords.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLon / 2) ** 2;

    const safeA = Math.max(0, Math.min(1, a));

    const c = 2 * Math.asin(Math.sqrt(safeA));

    return EARTH_RADIUS_KM * c;
}

// Форматування часу
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

// Виведення інформаційних повідомлень
function setMessage(text, isError = false) {
    els.message.textContent = text;
    els.message.classList.toggle("error", isError);
}

// Оновлення стану кнопок
function updateTrackingState() {
    const active = watchId !== null;

    els.watch.disabled = active;
    els.clearWatch.disabled = !active;

    els.trackingStatus.textContent = active
        ? "Відстеження увімкнено"
        : "Відстеження вимкнено";

    els.trackingStatus.classList.toggle("active", active);
}

// Ініціалізація карти Leaflet
function initMap() {
    if (typeof L === "undefined") {
        document.getElementById("map").textContent =
            "Не вдалося завантажити карту. Перевірте інтернет.";
        return;
    }

    // Створення карти з центром біля коледжу
    map = L.map("map").setView(
        [COLLEGE.latitude, COLLEGE.longitude],
        13
    );

    // Підключення OpenStreetMap
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(map);

    // Маркер коледжу
    L.marker([
        COLLEGE.latitude,
        COLLEGE.longitude
    ])
        .addTo(map)
        .bindPopup(
            "<strong>Коледж</strong><br>" +
            "Широта: 48.94321<br>" +
            "Довгота: 24.73380"
        );
}

// Оновлення маркерів на карті
function updateMap(position) {
    if (!map) return;

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    const point = [latitude, longitude];

    // Інформаційне вікно поточного місцезнаходження
    const popupContent =
        `<strong>Моє місцезнаходження</strong><br>` +
        `Широта: ${latitude.toFixed(6)}<br>` +
        `Довгота: ${longitude.toFixed(6)}<br>` +
        `Час: ${formatTime(position.timestamp)}<br>` +
        `Точність: ±${accuracy.toFixed(1)} м`;

    // Створення або переміщення основного маркера
    if (currentMarker) {
        currentMarker.setLatLng(point);
        currentMarker.setPopupContent(popupContent);
    } else {
        currentMarker = L.marker(point)
            .addTo(map)
            .bindPopup(popupContent);
    }

    // Коло точності геолокації
    if (accuracyCircle) {
        accuracyCircle.setLatLng(point);
        accuracyCircle.setRadius(accuracy);
    } else {
        accuracyCircle = L.circle(point, {
            radius: accuracy,
            color: "#2563eb",
            fillColor: "#60a5fa",
            fillOpacity: 0.10,
            weight: 1
        }).addTo(map);
    }

    // Додавання нових точок під час відстеження
    if (watchId !== null) {
        const coords = {
            latitude: latitude,
            longitude: longitude
        };

        // Додаємо точку, якщо переміщення >= 3 метрів
        const moved =
            lastTrackPoint === null ||
            computeDistance(lastTrackPoint, coords) >= 0.003;

        if (moved) {
            L.circleMarker(point, {
                radius: 6,
                color: "#ffffff",
                weight: 2,
                fillColor: "#2563eb",
                fillOpacity: 1
            })
                .addTo(map)
                .bindPopup(
                    `<strong>Точка маршруту</strong><br>` +
                    `Широта: ${latitude.toFixed(6)}<br>` +
                    `Довгота: ${longitude.toFixed(6)}<br>` +
                    `Час: ${formatTime(position.timestamp)}`
                );

            lastTrackPoint = coords;
        }
    }

    // Центрування карти на користувачеві
    if (followMyLocation) {
        map.setView(
            point,
            Math.max(map.getZoom(), 15)
        );
    }
}

// Відображення поточного місцезнаходження
function displayLocation(position) {
    lastPosition = position;

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    // Розрахунок відстані до коледжу
    const distanceKm = computeDistance(
        {
            latitude: latitude,
            longitude: longitude
        },
        COLLEGE
    );

    // Виведення результатів на сторінку
    els.latitude.textContent = latitude.toFixed(6) + "°";
    els.longitude.textContent = longitude.toFixed(6) + "°";
    els.accuracy.textContent = "±" + accuracy.toFixed(1) + " м";
    els.measuredAt.textContent = formatTime(position.timestamp);
    els.distance.textContent = distanceKm.toFixed(3) + " км";

    setMessage("Координати успішно отримано.");

    // Оновлення карти
    updateMap(position);
}

// Обробка помилок Geolocation API
function displayError(error) {
    const errorTypes = {
        0: "Невідома помилка.",
        1: "Користувач заборонив доступ до геолокації.",
        2: "Місцезнаходження недоступне.",
        3: "Час очікування визначення координат вичерпано."
    };

    const errorMessage =
        errorTypes[error.code] ||
        "Помилка: " + error.message;

    if (error.code === 1) {
        clearWatch();
    }

    setMessage(errorMessage, true);
}

// Перевірка підтримки геолокації
function isGeolocationAvailable() {
    if (!navigator.geolocation) {
        setMessage(
            "Ваш браузер не підтримує Geolocation API.",
            true
        );
        return false;
    }

    if (!window.isSecureContext) {
        setMessage(
            "Геолокація працює через HTTPS або localhost.",
            true
        );
        return false;
    }

    return true;
}

// Параметри визначення місцезнаходження
const geoOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
};

// Одноразове визначення поточного місцезнаходження
function getMyLocation() {
    if (!isGeolocationAvailable()) {
        return;
    }

    setMessage("Визначення місцезнаходження...");

    navigator.geolocation.getCurrentPosition(
        displayLocation,
        displayError,
        geoOptions
    );
}

// Початок відстеження місцезнаходження
function watchLocation() {
    if (!isGeolocationAvailable()) {
        return;
    }

    if (watchId !== null) {
        return;
    }

    lastTrackPoint = null;
    followMyLocation = true;

    setMessage("Відстеження місцезнаходження розпочато...");

    watchId = navigator.geolocation.watchPosition(
        displayLocation,
        displayError,
        geoOptions
    );

    updateTrackingState();
}

// Зупинка відстеження місцезнаходження
function clearWatch() {
    if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
    }

    watchId = null;

    updateTrackingState();

    if (lastPosition) {
        setMessage(
            "Відстеження зупинено. Точки маршруту залишилися на карті."
        );
    }
}

// Перевірка координат пункту призначення
function parseCoordinate(value, minimum, maximum) {
    const normalized = value.trim().replace(",", ".");

    const pattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

    if (!pattern.test(normalized)) {
        return null;
    }

    const number = Number(normalized);

    if (
        !Number.isFinite(number) ||
        number < minimum ||
        number > maximum
    ) {
        return null;
    }

    return number;
}

// Перехід до пункту призначення
function showDestination(event) {
    event.preventDefault();

    const latitude = parseCoordinate(
        els.destinationLat.value,
        -90,
        90
    );

    const longitude = parseCoordinate(
        els.destinationLon.value,
        -180,
        180
    );

    // Перевірка правильності координат
    if (latitude === null || longitude === null) {
        els.destinationMessage.textContent =
            "Введіть правильні координати: широта від -90 до 90, довгота від -180 до 180.";

        els.destinationMessage.classList.add("error");

        return;
    }

    if (!map) {
        els.destinationMessage.textContent =
            "Карта недоступна. Перевірте інтернет.";

        els.destinationMessage.classList.add("error");

        return;
    }

    els.destinationMessage.classList.remove("error");

    els.destinationMessage.textContent =
        `Пункт призначення: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

    // Вимкнення автоматичного центрування
    followMyLocation = false;

    const point = [latitude, longitude];

    // Створення або переміщення маркера призначення
    if (destinationMarker) {
        destinationMarker.setLatLng(point);
    } else {
        destinationMarker = L.marker(point).addTo(map);
    }

    // Інформаційне вікно
    destinationMarker.bindPopup(
        `<strong>Пункт призначення</strong><br>` +
        `Широта: ${latitude.toFixed(6)}<br>` +
        `Довгота: ${longitude.toFixed(6)}`
    );

    // Переміщення карти до пункту призначення
    map.setView(point, 15);

    destinationMarker.openPopup();

    // Прокручування сторінки до карти
    document.getElementById("map").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// Центрування карти на поточному місцезнаходженні
function centerMyLocation() {
    if (lastPosition && map) {
        followMyLocation = true;

        const latitude = lastPosition.coords.latitude;
        const longitude = lastPosition.coords.longitude;

        map.setView([latitude, longitude], 16);

        if (currentMarker) {
            currentMarker.openPopup();
        }
    } else {
        getMyLocation();
    }
}

// Ініціалізація вебдодатка
function init() {
    // Створення карти
    initMap();

    // Кнопка визначення координат
    els.getLocation.addEventListener(
        "click",
        getMyLocation
    );

    // Кнопка початку відстеження
    els.watch.addEventListener(
        "click",
        watchLocation
    );

    // Кнопка зупинки відстеження
    els.clearWatch.addEventListener(
        "click",
        clearWatch
    );

    // Кнопка повернення до поточного місця
    els.centerMyLocation.addEventListener(
        "click",
        centerMyLocation
    );

    // Форма пункту призначення
    els.destinationForm.addEventListener(
        "submit",
        showDestination
    );

    updateTrackingState();

    // Автоматичне визначення координат
    getMyLocation();
}

// Запуск після завантаження HTML
document.addEventListener("DOMContentLoaded", init);