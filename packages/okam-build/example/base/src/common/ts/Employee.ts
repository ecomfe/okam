/**
 * @file Employee
 * @author xxx
 */

import {IPerson, Person} from './Person';

export default class Employee extends Person {
    constructor(config: IPerson) {
        super(config);
    }

    work(hours: number) {
        console.log(this.getName(), 'need to work', hours + 'h');
    }
}
