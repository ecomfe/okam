interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Typescripte 测试 , Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

const x: number = 0;

exports.greeter = greeter;

