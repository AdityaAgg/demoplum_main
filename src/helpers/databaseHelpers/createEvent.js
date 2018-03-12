module.exports = (obj, db) => {
  new db.Event(Object.assign({}, obj));
}
