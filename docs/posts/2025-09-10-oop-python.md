# Guidance to OOP in Python

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects. Python makes OOP simple and intuitive.

## Key Concepts
- **Class**: Blueprint for creating objects.
- **Object**: Instance of a class.
- **Inheritance**: Mechanism to create a new class from an existing one.
- **Encapsulation**: Restricting access to methods and variables.
- **Polymorphism**: Ability to use a common interface for different data types.

## Example: Basic Class
```python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        print(f"{self.name} makes a sound.")

cat = Animal("Whiskers")
cat.speak()
```

## Example: Inheritance
```python
class Dog(Animal):
    def speak(self):
        print(f"{self.name} barks.")

dog = Dog("Buddy")
dog.speak()
```

## Tips
- Use `self` to access instance variables.
- Use inheritance to reuse code.
- Encapsulate data using private variables (`_var` or `__var`).

For more details, visit the [Python OOP documentation](https://docs.python.org/3/tutorial/classes.html).
