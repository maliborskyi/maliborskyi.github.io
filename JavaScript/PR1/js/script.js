// Завдання 5: Фільтрація та маніпуляція об'єктів
const orders = [
    { orderId: 1, customer: { name: "Олексій", email: "olexiy@example.com" }, items: ["Мишка", "Клавіатура"], total: 2500 },
    { orderId: 2, customer: { name: "Марія", email: "maria@example.com" }, items: ["Ноутбук"], total: 35000 },
    { orderId: 3, customer: { name: "Олексій", email: "olexiy@example.com" }, items: ["Монітор"], total: 8000 },
    { orderId: 4, customer: { name: "Іван", email: "ivan@example.com" }, items: ["Навушники"], total: 1500 }
];
  
function getTotalSpentByCustomer(ordersArr, customerName) {
    return ordersArr
        .filter(order => order.customer.name === customerName)
        .reduce((sum, order) => sum + order.total, 0);
}
  
// Обробник для кнопки
document.getElementById('btn-task5').addEventListener('click', () => {
    const olexiyTotal = getTotalSpentByCustomer(orders, "Олексій");
    const mariaTotal = getTotalSpentByCustomer(orders, "Марія");
    const ivanTotal = getTotalSpentByCustomer(orders, "Іван");
    
    // Виводимо текст прямо в div замість консолі
    document.getElementById('out-task5').innerHTML = 
        `Витрати Олексія: ${olexiyTotal} грн<br>` +
        `Витрати Марії: ${mariaTotal} грн<br>` +
        `Витрати Івана: ${ivanTotal} грн`;
});


// Завдання 6: Об'єднання та оптимізація даних
const products = [
    { productId: 101, name: "Смартфон", price: 15000 },
    { productId: 102, name: "Планшет", price: 12000 },
    { productId: 103, name: "Смарт-годинник", price: 5000 }
];
  
const purchases = [
    { purchaseId: 1, productId: 101, quantity: 2 },
    { purchaseId: 2, productId: 103, quantity: 3 },
    { purchaseId: 3, productId: 101, quantity: 1 },
    { purchaseId: 4, productId: 102, quantity: 4 }
];
  
function getTotalSales(productsArr, purchasesArr) {
    return purchasesArr.reduce((acc, purchase) => {
        const product = productsArr.find(p => p.productId === purchase.productId);
        
        if (product) {
            const revenue = product.price * purchase.quantity;
            acc[product.name] = (acc[product.name] || 0) + revenue;
        }
        
        return acc;
    }, {}); 
}

// Обробник для кнопки 
document.getElementById('btn-task6').addEventListener('click', () => {
    const salesReport = getTotalSales(products, purchases);
    
    // Перетворюємо об'єкт у читабельний JSON рядок і виводимо у <pre>
    document.getElementById('out-task6').textContent = JSON.stringify(salesReport, null, 2);
});