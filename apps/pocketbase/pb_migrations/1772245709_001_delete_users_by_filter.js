/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const records = app.findRecordsByFilter("users", "email='test@example.com' || email='zadkielcarrillo22@gmail.com' || email='test1@example.com' || email='test2@example.com' || email='test3@example.com'");
  for (const record of records) {
    app.delete(record);
  }
}, (app) => {
  // Rollback: record data not stored, manual restore needed
})