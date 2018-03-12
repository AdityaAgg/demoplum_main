module.exports = (userIdVar, db) => {
  return await db.Session.findOne({userId: userIdVar});
}
