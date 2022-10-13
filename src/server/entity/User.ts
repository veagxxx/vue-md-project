export interface Person {
  name: string;
  age: number;
  sex: number;
  tall: number;
  address: string;
}

class User implements Person {
  name: string;
  age: number;
  sex: number;
  tall: number;
  address: string;
  constructor (user: Person) {
    this.name = user.name
    this.age = user.age
    this.sex = user.sex
    this.tall = user.tall
    this.address = user.address
  }
  get() {
    return {
      name: this.name,
      age: this.age,
      sex: this.sex,
      tall: this.tall,
      address: this.address
    }
  }
  set (user: Person) {
    this.name = user.name
    this.age = user.age
    this.sex = user.sex
    this.tall = user.tall
    this.address = user.address
  }
}

export default User