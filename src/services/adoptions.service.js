import { AdoptionsDao, UsersDao, PetsDao } from "../dao/mongo/daos.js";

const adoptionsDao = new AdoptionsDao();
const usersDao = new UsersDao();
const petsDao = new PetsDao();

export const getAllAdoptions = async () => {
  return adoptionsDao.get();
};

export const getAdoptionById = async (id) => {
  return adoptionsDao.getBy({ _id: id });
};

export const createAdoption = async (uid, pid) => {
  const user = await usersDao.getBy({ _id: uid });
  if (!user) throw { status: 404, message: "Usuario no encontrado" };

  const pet = await petsDao.getBy({ _id: pid });
  if (!pet) throw { status: 404, message: "Mascota no encontrada" };

  if (pet.adopted) throw { status: 400, message: "La mascota ya fue adoptada" };

  // Crear la adopción
  const adoption = await adoptionsDao.save({ owner: uid, pet: pid });

  // Actualizar mascota
  await petsDao.update(pid, { adopted: true, owner: uid });

  // Actualizar usuario
  const userPets = [...(user.pets || []), pid];
  await usersDao.update(uid, { pets: userPets });

  return adoption;
};
