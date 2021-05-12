- Строгий режим
- Подключение необходимых файлов
- Специфичный код, необходимый для выполнения команды
- Интерфейс команды
- - имя команды
- - запуск и т.д.
- - Экспорт


команды

- node src/service/service.js --generate 5
- src/service/service.js --version
- npm run server - to run server
- node src/index.js - to run express

возвращает результаты поиска. 
Поиск объявлений выполняется по наименованию. 
Объявление соответствует поиску в случае наличия хотя бы одного вхождения искомой фразы.

to test query in postman
GET => http://localhost:3000/api/search?query=hohohho
GET => http://localhost:3000/api/search?query=Продам книги Стивена Кинга


Категории запрос

GET => http://localhost:3000/api/categories
