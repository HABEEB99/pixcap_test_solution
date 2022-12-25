interface Employee {
  uniqueId: number;
  name: string;
  subordinates: Employee[];
}

interface IEmployeeOrgApp {
  ceo: Employee;
  /**
    * Moves the employee with employeeID (uniqueId) under a supervisor
    (another employee) that has supervisorID (uniqueId).
    * E.g. move Bob (employeeID) to be subordinate of Georgina
    (supervisorID). * @param employeeID
    * @param supervisorID
    */
  move(employeeID: number, supervisorID: number): void;
  /** Undo last move action */
  undo(): void;
  /** Redo last undone action */
  redo(): void;
}

class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: Employee;
  history: { move: { employeeID: number; supervisorID: number } }[] = [];
  future: { move: { employeeID: number; supervisorID: number } }[] = [];

  constructor(ceo: Employee) {
    this.ceo = ceo;
  }

  move(employeeID: number, supervisorID: number): void {
    // check if employee and supervisor exist
    const employee = this.findEmployeeById(this.ceo, employeeID);
    const supervisor = this.findEmployeeById(this.ceo, supervisorID);

    if (!employee) {
      throw new Error(`Employee with ID ${employeeID} not found`);
    }
    if (!supervisor) {
      throw new Error(`Supervisor with ID ${supervisorID} not found`);
    }

    // check if employee is not already subordinate to supervisor
    if (supervisor.subordinates.some((e) => e.uniqueId === employeeID)) {
      throw new Error(
        `Employee with ID ${employeeID} is already a subordinate of supervisor with ID ${supervisorID}`
      );
    }

    // remove employee from current supervisor's subordinates
    const currentSupervisor = this.findSupervisor(this.ceo, employeeID);
    currentSupervisor.subordinates = currentSupervisor.subordinates.filter(
      (e) => e.uniqueId !== employeeID
    );

    // add employee as supervisor's subordinate
    supervisor.subordinates.push(employee);

    // add move to history
    this.history.push({ move: { employeeID, supervisorID } });
    // clear future
    this.future = [];
  }
  undo(): void {
    if (this.history.length === 0) {
      return;
    }

    const action = this.history.pop();
    if (!action) {
      return;
    }

    const { employeeID, supervisorID } = action.move;
    const employee = this.findEmployeeById(this.ceo, employeeID);
    const currentSupervisor = this.findSupervisor(this.ceo, employeeID);

    // remove employee from current supervisor's subordinates if employee exists
    if (employee) {
      currentSupervisor.subordinates = currentSupervisor.subordinates.filter(
        (e) => e.uniqueId !== employeeID
      );
    }

    // find employee's previous supervisor
    const previousSupervisor = this.findEmployeeById(this.ceo, supervisorID);

    // add employee as previous supervisor's subordinate if previous supervisor and employee exists
    if (previousSupervisor && employee) {
      previousSupervisor.subordinates.push(employee);
    }

    // add reversed move to future
    this.future.push({
      move: { employeeID, supervisorID: currentSupervisor.uniqueId },
    });
  }

  redo(): void {
    if (this.future.length === 0) {
      return;
    }

    const action = this.future.pop();
    if (!action) {
      return;
    }

    const { employeeID, supervisorID } = action.move;
    this.move(employeeID, supervisorID);
  }
  private findEmployeeById(
    employee: Employee,
    id: number
  ): Employee | undefined {
    if (employee.uniqueId === id) {
      return employee;
    }

    for (const subordinate of employee.subordinates) {
      const found = this.findEmployeeById(subordinate, id);
      if (found) {
        return found;
      }
    }

    return undefined;
  }

  private findSupervisor(employee: Employee, id: number): Employee {
    for (const subordinate of employee.subordinates) {
      if (subordinate.uniqueId === id) {
        return employee;
      }
      const supervisor = this.findSupervisor(subordinate, id);
      if (supervisor) {
        return supervisor;
      }
    }

    return employee;
  }
}

// In Summary, The EmployeeOrgApp class is an implementation of the IEmployeeOrgApp interface,
// which defines a class that can move an employee to a new supervisor, undo the last move action,
// and redo the last undone action.

// The EmployeeOrgApp class has three main properties:

// 1. ceo: an Employee object representing the CEO of the organization.

// 2. history: an array of objects representing the history of move actions that have been performed.
//    Each object has a move property, which contains the employeeID and supervisorID of the employee that was moved.

// 3. future: an array of objects representing move actions that have been undone and can be redone.
//    Each object has a move property, which contains the employeeID and supervisorID of the employee that was moved.

// The EmployeeOrgApp class also has four main methods:

// 1. constructor(ceo: Employee): a constructor that takes the ceo as a parameter and
//    assigns it to the ceo property of the class.

// 2. move(employeeID: number, supervisorID: number): void: a method that moves the employee with
//    the specified employeeID to be a subordinate of the supervisor with the specified supervisorID.
//    This method first checks if the employee and supervisor exist, then removes the employee from the
//    current supervisor's subordinates and adds the employee as the new supervisor's subordinate.
//    It also adds the move action to the history array and clears the future array.

// 3. undo(): void: a method that undoes the last move action by
//    reversing the move and adding it to the future array.

// 4. redo(): void: a method that redoes the last undone move action by performing
//    the move again and adding it to the history array.

// The EmployeeOrgApp class also includes two private helper methods:

// 1. findEmployeeById(employee: Employee, id: number): Employee | undefined: a recursive method that searches
//    the organization tree starting at the specified employee object and returns the employee with
//    the specified id if found, or undefined if not found.

// 2. findSupervisor(employee: Employee, id: number): Employee: a recursive method that searches the organization tree
//    starting at the specified employee object and returns the supervisor of the employee with the specified id.
//    If the employee is not found, the method returns the specified employee object.

// The findEmployeeById and findSupervisor methods are used by the move, undo, and redo methods to find employees
//  and supervisors by their uniqueId properties.

// To use the EmployeeOrgApp class, you can create an instance of the class with
// the ceo object as a constructor parameter, like this:

// const app = new EmployeeOrgApp(ceo);
// Then, you can use the move, undo, and redo methods to perform actions on the organization. For example:
// app.move(2, 1); // move employee with id 2 to be subordinate of employee with id 1
// app.undo(); // undo the last move action
// app.redo(); // redo the last undone action
