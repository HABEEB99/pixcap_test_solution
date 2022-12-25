# PIXCAP_TEST_SOLUTION

EmployeeOrgApp Class
The EmployeeOrgApp class is an implementation of the IEmployeeOrgApp interface, which defines a class that can move an employee to a new supervisor, undo the last move action, and redo the last undone action.

# The EmployeeOrgApp class has three main properties:

1. ceo: an Employee object representing the CEO of the organization.
2. history: an array of objects representing the history of move actions that have been performed. Each object has a move property, which contains the employeeID and supervisorID of the employee that was moved.
3. future: an array of objects representing move actions that have been undone and can be redone. Each object has a move property, which contains the employeeID and supervisorID of the employee that was moved.
Methods

# The EmployeeOrgApp class also has four main methods:

1. constructor(ceo: Employee): a constructor that takes the ceo as a parameter and assigns it to the ceo property of the class.
2. move(employeeID: number, supervisorID: number): void: a method that moves the employee with the specified employeeID to be a subordinate of the supervisor with the specified supervisorID. This method first checks if the employee and supervisor exist, then removes the employee from the current supervisor's subordinates and adds the employee as the new supervisor's subordinate. It also adds the move action to the history array and clears the future array.
3. undo(): void: a method that undoes the last move action by reversing the move and adding it to the future array.
4. redo(): void: a method that redoes the last undone move action by performing the move again and adding it to the history array.

# The EmployeeOrgApp class also includes two private helper methods:

1. findEmployeeById(employee: Employee, id: number): Employee | undefined: a recursive method that searches the organization tree starting at the specified employee object and returns the employee with the specified id if found, or undefined if not found.
2. findSupervisor(employee: Employee, id: number): Employee: a recursive method that searches the organization tree starting at the specified employee object and returns the supervisor of the employee with the specified id. If the employee is not found, the method returns the specified employee object.
The findEmployeeById and findSupervisor methods are used by the move, undo, and redo methods to find employees and supervisors by their uniqueId properties.

# Using the EmployeeOrgApp Class
To use the EmployeeOrgApp class, you can create an instance of the class with the ceo object as a constructor parameter, like this:
``` 
const app = new EmployeeOrgApp(ceo)
// Then, you can use the move, undo, and redo methods to perform actions on the organization. For example:
app.move(2, 1); // move employee with id 2 to be subordinate of employee with id 1
app.undo(); // undo
