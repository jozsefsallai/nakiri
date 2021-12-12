import db from '../../../services/db';

export default class TypeORMAdapter {
  build(Model: any, props: any) {
    const model = new Model();

    Object.keys(props).forEach((key) => {
      model[key] = props[key];
    });

    return model;
  }

  async save(model, Model) {
    const repository = db.getRepository(Model);
    return repository.save(model);
  }

  async destroy(model, Model) {
    const repository = db.getRepository(Model);
    return repository.delete(model);
  }

  get(model, attr, _Model) {
    return model[attr];
  }

  set(props, model, _Model) {
    Object.keys(props).forEach((key) => {
      model[key] = props[key];
    });

    return model;
  }
}
