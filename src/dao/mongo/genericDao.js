export default class GenericDao {
  constructor(model) {
    this.model = model;
  }

  async get(params = {}) {
    return this.model.find(params).lean();
  }

  async getBy(params = {}) {
    return this.model.findOne(params).lean();
  }

  async save(doc) {
    const entity = new this.model(doc);
    return entity.save();
  }

  async update(id, doc) {
    return this.model.findByIdAndUpdate(id, { $set: doc }, { new: true });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }
}
