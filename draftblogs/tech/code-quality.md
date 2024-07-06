Notes about coding

* Make invalid states unrepresentable - type systems and DB schemas help with this
    - reduce complexity by reducing valid and invalid states (which means less exception handling code)
* use enums instead of booleans - compiler will tell you, arglist is more explicit and better named, you can make an object that combines codependent booleans, easier to keep track or permutations and write tests for them
* ask yourself, do I actually need to do this code?  less code is better.
* document intent and context around code when it's helpful
* Harder part of the job? working with a team, influencing, prioritizing work, navigating team dynamics
* The most important decisions are not technical, it's bigger, what are you working on?  What is the impact?  What is the user experience and is it helpful and simple and understandable? Is your thing actually used? 
* mitigating the growing entropy/complexity is harder and more important than picking clever data structures or algorithms like an interview question
    - software erosion - https://en.wikipedia.org/wiki/Software_architecture#Software_architecture_erosion
    - big ball of mud, god classes, magic numbers, classes that exist just to invoke other methods - https://en.wikipedia.org/wiki/Anti-pattern#Software_engineering_anti-patterns
* reduce complexity with consistency - types and contraints for valid and invalid data states, schemas, fewer places to store data and state, less redundant normalized data, ACID transactions, 
* data will outlive the code, get the data design correct first - data structures, their relationships, their constraints - get those right
* start with simple, working solutions before you scale, before you make it more complex, before you optimize performance
* prefer the code that reduces complexity over performance, unless you are not meeting a specific performance metric
* find the balance between encapsulation and DRY principle vs. locality of behavior - make decisions from the lens of 'complexity'
* focus on learning principles and concepts of new technology and frameworks - the syntax will get your overwhelmed with its noise
* for code to be testable, it needs to be modular - preferably a highly cohesive module loosely coupled to other modules
    - if you have to make a ton of mocks to test, probably not loosely coupled enough
* global variables are bad - https://wiki.c2.com/?GlobalVariablesAreBad - keep variables/state as local as possible to minimize complexity from side effects
* use interfaces as clear boundaries/restricted data exchange areas, create constraints on data exchange and data hiding/encapsulation
* modularization, encapsulation, high-cohesion - these all lend to cognitive chunking which lowers complexity of understanding