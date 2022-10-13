import User, { Person } from './../entity/User';

interface UserMapper {
  findUsers(): Person[];
  findUserByName(name: string): Person | null;
  updateUserByName(user: Person, name: string): void;
}
const users = [1, 2].map((item, index) => {
  const user: Person = {
    name: '佛耶格',
    age: 1000,
    sex: index,
    tall: 183,
    address: '暗影岛'
  }
  return new User(index == 1 ? user : { ...user, name: '伊苏尔德', tall: 165 }).get()
}) 
class UserMapperImpl implements UserMapper {
  findUsers(): Person[] {
    return users
  }
  findUserByName(name: string): Person | null {
    return users.find((user: Person) => user.name === name) || null
  }
  updateUserByName(user: Person, name: string): void {
    throw new Error('Method not implemented.');
  }
  
}

export default UserMapperImpl