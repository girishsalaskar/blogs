# Mastering Object-Oriented Programming in Python

Object-Oriented Programming (OOP) is a programming paradigm that organizes code into objects that contain both data and behavior. Python's implementation of OOP is elegant and powerful, making it an excellent language for object-oriented design.

## Core Concepts in Python OOP

### 1. Classes and Objects

A class is a blueprint for creating objects. Objects are instances of classes that contain data and code.

```python
class BankAccount:
    # Class variable shared by all instances
    bank_name = "PyBank"
    
    def __init__(self, owner, balance=0):
        # Instance variables unique to each instance
        self.owner = owner
        self.balance = balance
        self._transaction_history = []  # Protected variable
        
    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            self._transaction_history.append(f"Deposit: {amount}")
            return True
        return False
        
    def get_balance(self):
        return f"Balance for {self.owner}: ${self.balance}"

# Creating objects (instances)
account1 = BankAccount("Alice", 1000)
account2 = BankAccount("Bob")

print(account1.get_balance())  # Output: Balance for Alice: $1000
print(account2.get_balance())  # Output: Balance for Bob: $0
```

### 2. Encapsulation

Encapsulation is about bundling data and methods that work on that data within a single unit and restricting access to internal details.

```python
class Employee:
    def __init__(self, name, salary):
        self._name = name          # Protected attribute (convention)
        self.__salary = salary     # Private attribute (name mangling)
        
    @property
    def salary(self):
        """Getter method for salary"""
        return self.__salary
    
    @salary.setter
    def salary(self, new_salary):
        """Setter method for salary with validation"""
        if new_salary > 0:
            self.__salary = new_salary
        else:
            raise ValueError("Salary must be positive")
    
    def get_annual_salary(self):
        return self.__salary * 12

emp = Employee("John", 5000)
print(emp.salary)  # Uses the getter
emp.salary = 6000  # Uses the setter
# print(emp.__salary)  # This would raise an AttributeError
```

### 3. Inheritance and Polymorphism

Inheritance allows a class to inherit attributes and methods from another class. Polymorphism lets us use a common interface for different implementations.

```python
class Shape:
    def __init__(self, color):
        self.color = color
    
    def area(self):
        raise NotImplementedError("Subclass must implement area()")
    
    def describe(self):
        return f"A {self.color} shape with area: {self.area()}"

class Circle(Shape):
    def __init__(self, color, radius):
        super().__init__(color)  # Call parent class's __init__
        self.radius = radius
    
    def area(self):
        return 3.14 * self.radius ** 2

class Rectangle(Shape):
    def __init__(self, color, width, height):
        super().__init__(color)
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

# Polymorphic behavior
shapes = [
    Circle("red", 5),
    Rectangle("blue", 4, 6)
]

for shape in shapes:
    print(shape.describe())
```

### 4. Multiple Inheritance

Python supports multiple inheritance, allowing a class to inherit from multiple parent classes.

```python
class Swimmer:
    def swim(self):
        return "Swimming"

class Flyer:
    def fly(self):
        return "Flying"

class Duck(Swimmer, Flyer):
    def __init__(self, name):
        self.name = name
    
    def move(self):
        return f"{self.name} can both {self.swim()} and {self.fly()}"

donald = Duck("Donald")
print(donald.move())  # Output: Donald can both Swimming and Flying
```

### 5. Advanced Concepts

#### Class Methods and Static Methods

```python
class DateUtils:
    @staticmethod
    def is_valid_date(year, month, day):
        # Static method doesn't need class or instance reference
        try:
            import datetime
            datetime.datetime(year, month, day)
            return True
        except ValueError:
            return False
    
    @classmethod
    def from_string(cls, date_str):
        # Class method receives class as first argument
        year, month, day = map(int, date_str.split('-'))
        if cls.is_valid_date(year, month, day):
            return cls(year, month, day)
        raise ValueError("Invalid date")

# Usage
print(DateUtils.is_valid_date(2025, 9, 10))  # True
print(DateUtils.is_valid_date(2025, 13, 10))  # False
```

#### Abstract Base Classes

```python
from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def connect(self):
        pass
    
    @abstractmethod
    def disconnect(self):
        pass

class PostgreSQL(Database):
    def connect(self):
        return "Connected to PostgreSQL"
    
    def disconnect(self):
        return "Disconnected from PostgreSQL"

# db = Database()  # This would raise TypeError
db = PostgreSQL()
print(db.connect())
```

## Best Practices in Python OOP

1. **Follow the Single Responsibility Principle**
   - Each class should have one and only one reason to change
   - Keep classes focused and cohesive

2. **Use Properties Instead of Direct Attribute Access**
   - Enables validation and computed attributes
   - Makes it easier to change implementation details later

3. **Prefer Composition Over Inheritance**
   - Inheritance can lead to complex hierarchies
   - Composition is more flexible and maintainable

4. **Use Type Hints for Better Code Documentation**
```python
from typing import List, Optional

class Library:
    def __init__(self) -> None:
        self.books: List[str] = []
    
    def add_book(self, book: str) -> None:
        self.books.append(book)
    
    def find_book(self, title: str) -> Optional[str]:
        return next((book for book in self.books if title in book), None)
```

5. **Implement Special Methods**
```python
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
    
    def __str__(self) -> str:
        return f"Point({self.x}, {self.y})"
    
    def __eq__(self, other: 'Point') -> bool:
        return self.x == other.x and self.y == other.y
    
    def __add__(self, other: 'Point') -> 'Point':
        return Point(self.x + other.x, self.y + other.y)
```

## Common Pitfalls to Avoid

1. **Mutable Default Arguments**
```python
# Bad
def add_item(item, list=[]):  # list is created once
    list.append(item)
    return list

# Good
def add_item(item, list=None):
    if list is None:
        list = []
    list.append(item)
    return list
```

2. **Not Using `super()` in Multiple Inheritance**
```python
# Always use super() for proper method resolution
class Derived(Base1, Base2):
    def __init__(self):
        super().__init__()  # Properly calls all parent classes
```

3. **Overusing Class Variables**
```python
class User:
    # Class variable (shared by all instances)
    roles = []  # This could lead to unexpected behavior
    
    def add_role(self, role):
        self.roles.append(role)  # Modifies the class variable!

# Better approach
class User:
    def __init__(self):
        self.roles = []  # Instance variable
    
    def add_role(self, role):
        self.roles.append(role)
```

## Additional Resources

- [Python Official Documentation on Classes](https://docs.python.org/3/tutorial/classes.html)
- [Python Data Model Reference](https://docs.python.org/3/reference/datamodel.html)
- [Type Hints Documentation](https://docs.python.org/3/library/typing.html)

Remember that while Python offers great flexibility in OOP, the key is to write clear, maintainable code that solves problems effectively. Start with simple designs and add complexity only when needed.
