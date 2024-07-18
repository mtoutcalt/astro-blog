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




philosphy of software design-----

* complexity - unknown unknowns - whack a mole bugs -- 
* strategic - good design over quick working code - be strategic about requirements - negotiating with business wants
* abstraction - simplified view, omit unimportant details -- signs abstraction is bad -> if you have to reproduce a bug by setting state in 2 places, automated test is difficult because you have to deal with multiple parts of system
* API patterns from tcp/ip and unix are still some of the best - deep abstractions
* classes should be small is dumb - shallow methods dont reduce complexity just spread it around like peanut butter
* 90% of severe failures in distributed systems were because of incorrect error handling - this book doesnt talk about testing enough
    * masking exceptions is bad - NFS example where client will keep pinging to downed server until it's brought up
* designing twice -- second system syndrome -- be careful
* comments - make them important - write them first - 
* naming - renaming-you should rename the more the system expands and the more you learn - need to have good test suite for this
* composition over inheritance when you can
* agile can encourage feature shipping which can lead not considering design decisions/abstractions
* performance - need measurements - simple, clean code is not optimized for performance but usually good enough

What book doesnt cover
* error handling code must have test coverage - least executed code
    * big mistake to focus on design and refactoring of common execution path and not error handling code
* these code quality books focus on the fun stuff, the formatting, naming, design patterns stuff, even though its the error handling and test coverage and security and reliability that really matters and is the reason for failure