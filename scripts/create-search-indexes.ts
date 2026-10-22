// ИНСТРУКЦИЯ ПО СОЗДАНИЮ ИНДЕКСОВ MONGODB
// Файл: scripts/create-search-indexes.ts
// Запуск: npx ts-node scripts/create-search-indexes.ts
//         (или добавить в package.json как "db:index": "ts-node scripts/create-search-indexes.ts")

/**
 * ПОЧЕМУ НУЖНЫ ИНДЕКСЫ
 * ---------------------
 * Без индексов поиск по name делает full collection scan — O(n) для каждого запроса.
 * Текстовый индекс MongoDB:
 *   - поддерживает стемминг (морфологию) для русского и английского
 *   - позволяет искать по нескольким полям одновременно с разными весами
 *   - работает с оператором $text, который значительно быстрее $regex
 *
 * ОГРАНИЧЕНИЕ: на коллекцию может быть только ОДИН текстовый индекс.
 * Поэтому все нужные поля включаем в один составной текстовый индекс.
 */

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db';

async function createIndexes() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(); // берёт дефолтную БД из URI
    const products = db.collection('products');

    // 1. ТЕКСТОВЫЙ ИНДЕКС — для быстрого нечёткого поиска ($text + $search)
    //    weight определяет приоритет поля при ранжировании результатов
    await products.createIndex(
      {
        name: 'text',        // основное поле — высокий вес
        description: 'text', // описание — меньший вес
      },
      {
        name: 'products_text_search',
        weights: {
          name: 10,        // совпадение в name важнее
          description: 3,  // описание — дополнительный сигнал
        },
        default_language: 'russian', // стемминг для русского языка
        // Для смешанного RU/EN контента можно использовать 'none'
        // (отключает стемминг, но ищет точнее по обоим языкам)
      }
    );
    console.log('✅ Text index created: products_text_search');

    // 2. ОБЫЧНЫЙ ИНДЕКС на category — для быстрой фильтрации по категории
    //    и JOIN-подобных операций при depth:1
    await products.createIndex(
      { category: 1 },
      { name: 'products_category_idx' }
    );
    console.log('✅ Index created: products_category_idx');

    // 3. ИНДЕКС на isPublished + name — для фильтрации опубликованных товаров
    //    Compound index: MongoDB использует его для WHERE isPublished=true ORDER BY name
    await products.createIndex(
      { isPublished: 1, name: 1 },
      { name: 'products_published_name_idx' }
    );
    console.log('✅ Index created: products_published_name_idx');

    // 4. ИНДЕКС на slug — для быстрого поиска по URL
    //    Payload сам создаёт такой же индекс (slug_1) для unique-поля — если он
    //    уже есть, MongoDB отвечает IndexOptionsConflict (85): индекс с тем же
    //    ключом и опциями, только с другим именем. Это не ошибка — пропускаем.
    try {
      await products.createIndex(
        { slug: 1 },
        { unique: true, name: 'products_slug_unique_idx' }
      );
      console.log('✅ Index created: products_slug_unique_idx');
    } catch (err) {
      if ((err as { code?: number }).code !== 85) throw err;
      console.log('✅ Unique slug index already exists (создан Payload)');
    }

    // Список всех индексов для проверки
    const indexes = await products.indexes();
    console.log('\nВсе индексы коллекции products:');
    indexes.forEach((idx) => console.log(' -', idx.name, JSON.stringify(idx.key)));

    // 5. TTL-ИНДЕКС на заявках — автоудаление по сроку хранения ПД (ч. 7 ст. 5 152-ФЗ).
    //    retainUntil проставляет коллекция CallbackRequests (последнее изменение + 3 года),
    //    MongoDB удаляет документ, как только эта дата прошла (expireAfterSeconds: 0).
    //    Бэкапы deploy.sh живут KEEP_BACKUPS=14 дней, поэтому удалённая заявка
    //    исчезает и из резервных копий не позже чем через 2 недели.
    const callbackRequests = db.collection('callback-requests');

    // Заявки, созданные до появления поля, получают срок от своего updatedAt
    // (amount совпадает с CALLBACK_RETENTION_YEARS из src/resources/legal.ts)
    const backfill = await callbackRequests.updateMany(
      { retainUntil: { $exists: false } },
      [
        {
          $set: {
            retainUntil: {
              $dateAdd: { startDate: '$updatedAt', unit: 'year', amount: 3 },
            },
          },
        },
      ]
    );
    console.log(`✅ retainUntil проставлен у ${backfill.modifiedCount} заявок`);

    await callbackRequests.createIndex(
      { retainUntil: 1 },
      { name: 'callback_requests_retention_ttl', expireAfterSeconds: 0 }
    );
    console.log('✅ TTL index created: callback_requests_retention_ttl');

  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

createIndexes().catch((err) => {
  console.error('Failed to create indexes:', err);
  process.exit(1);
});

/*
 * АЛЬТЕРНАТИВА — создать индексы через MongoDB Shell или Compass:
 *
 * use your-database-name
 *
 * // Текстовый индекс
 * db.products.createIndex(
 *   { name: "text", description: "text" },
 *   { weights: { name: 10, description: 3 }, default_language: "russian", name: "products_text_search" }
 * )
 *
 * // Индекс по категории
 * db.products.createIndex({ category: 1 }, { name: "products_category_idx" })
 *
 * // Составной индекс
 * db.products.createIndex({ isPublished: 1, name: 1 }, { name: "products_published_name_idx" })
 *
 * // Уникальный slug
 * db.products.createIndex({ slug: 1 }, { unique: true, name: "products_slug_unique_idx" })
 *
 * // Проверить что индексы созданы:
 * db.products.getIndexes()
 */