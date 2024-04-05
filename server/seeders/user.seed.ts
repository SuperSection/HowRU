import { createUser } from "../services/user.services";
import { faker } from "@faker-js/faker";


const createSampleUsers = async (numberOfUsers: number) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numberOfUsers; i++) {
      const fakeUser = await createUser({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: "password",
        bio: faker.lorem.sentence(10),
        profilePicture: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });

      usersPromise.push(fakeUser);
    }

    await Promise.allSettled(usersPromise);

    console.log("Users created", numberOfUsers);
    process.exit(1);
      
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


export { createSampleUsers };