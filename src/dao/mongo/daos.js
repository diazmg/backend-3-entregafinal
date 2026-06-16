import GenericDao from "./genericDao.js";
import { userModel } from "../../models/User.js";
import { petModel } from "../../models/Pet.js";
import { adoptionModel } from "../../models/Adoption.js";

export class UsersDao extends GenericDao {
  constructor() {
    super(userModel);
  }
}

export class PetsDao extends GenericDao {
  constructor() {
    super(petModel);
  }
}

export class AdoptionsDao extends GenericDao {
  constructor() {
    super(adoptionModel);
  }
}
