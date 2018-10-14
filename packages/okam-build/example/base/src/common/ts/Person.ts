/**
 * @file Person
 * @author xxx
 */

export interface IPerson {
    firstName: string;
    lastName: string;
    age: number;
}

export class Person {
    private firstName: string;
    private lastName: string;
    private age: number;

    constructor(config: IPerson){
        this.firstName = config.firstName;
        this.lastName = config.lastName;
        this.age = config.age;
    }

    greet(person: Person) {
        console.log('hi', person.getName());
    }

    getName() {
        return this.firstName + ' ' + this.lastName;
    }
}
