"use strict";

// Выход из личного кабинета
const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout((response) => {
    if (response.success) {
      location.reload();
    } else {
      console.error('Ошибка при выходе из учетной записи');
    }
  });
};


// Получение информации о пользователе
ApiConnector.current((response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    } else {
      console.error('Ошибка получения информации о пользователе');
    }
});


// Получение текущих курсов валюты
const ratesBoard = new RatesBoard();

function getExchangeRates() {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    } else {
      console.error('Ошибка получения курсов валют');
    }
  });
}

// Функция для получения текущих валют
getExchangeRates();

// Интервал для получения валют каждую минуту
setInterval(getExchangeRates, 60000);


// Операции с деньгами
const moneyManager = new MoneyManager();

// Пополнение баланса
moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, "Баланс успешно пополнен");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
};


// Конвертация валюты
moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, "Конвертация выполнена успешно");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
};


// Перевод валюты
moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, "Перевод выполнен успешно");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
};


// Работа с избранным
const favoritesWidget = new FavoritesWidget();

// Запрос начального списка избранного
ApiConnector.getFavorites((response) => {
  if (response.success) {
    // Очистка текущего списка избранного
    favoritesWidget.clearTable();
    // Отрисовка полученных данных
    favoritesWidget.fillTable(response.data);
    // Обновление выпадающего списка для перевода денег
    moneyManager.updateUsersList(response.data);
  } else {
    console.error('Ошибка получения списка избранного');
  }
});

// Добавление пользователя в список избранного
favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    if (response.success) {
      // Очистка текущего списка избранного
      favoritesWidget.clearTable();
      // Отрисовка полученных данных
      favoritesWidget.fillTable(response.data);
      // Обновление выпадающего списка для перевода денег
      moneyManager.updateUsersList(response.data);
      // Вывод сообщения об успешном добавлении пользователя
      favoritesWidget.setMessage(true, 'Пользователь успешно добавлен в избранное');
    } else {
      // Вывод сообщения об ошибке добавления пользователя
      favoritesWidget.setMessage(false, response.error);
    }
  });
};

// Удаление пользователя из списка избранного
favoritesWidget.removeUserCallback = (userId) => {
  ApiConnector.removeUserFromFavorites(userId, (response) => {
    if (response.success) {
      // Очистка текущего списка избранного
      favoritesWidget.clearTable();
      // Отрисовка полученных данных
      favoritesWidget.fillTable(response.data);
      // Обновление выпадающего списка для перевода денег
      moneyManager.updateUsersList(response.data);
      // Вывод сообщения об успешном удалении пользователя
      favoritesWidget.setMessage(true, 'Пользователь успешно удален из избранного');
    } else {
      // Вывод сообщения об ошибке удаления пользователя
      favoritesWidget.setMessage(false, response.error);
    }
  });
};
