

## Things to look for when doing Code Reviews for React


* move inline functions above the render/jsx code
    * reduces recreations of the function on re-renders - can be easier to export and test - can be easier to debug because stacktrace will have function name and not anonymous function

* instead of caching renders, fix issues with better structure and composition
* When state changes, like a useSTate is called by a button, the entire component re-renders again to decide the DOM DIFF
* Components re-render when their props change
* Components ALSO re-render when their parent re-renders.....because the child needs to be used to calculate the DOM DIFF
* This is the more common pitfall – you change the state of a parent and some slow child component is re-rendered everytime the user is interacting with the page and changing state
* What to look for -- you see a useState or useState change function that's called in a onClick -- understand those child JSX WILL BE RE-RENDERED EVERYTIME
* Better way to avoid child re-renders is to make sure that its not a child to the state changing parent but instead is a sibling
* Encapsulate that useState into its own small component – so you isolate the state changes and the re-renders....and now that child is a sibling and doesn't have a parent it has to listen to....
* Another way to avoid re-renders of children is the have a parent element which has changing state to wrap children and its props are the children elements themselves....
* This will only work assuming that those 'children' do not have props that depend on the parent and therefore those children will not re-render because when the parent state changed the child is exactly the same (Object.is())
* Place state as low in the tree as you can
* Pass components as children props - assuming the children isnt coupled to the parent
* Be careful with custom hooks – if they are still changing state useModalDialog -- you still have to encapsulate the user of that hook too
* Can I restructure my components to islate the effects of state changes?
* Careful to use global objects like window. For routing make sure you are using the location on react-router and not global



#### References
https://cekrem.github.io/posts/beyond-react-memo-smarter-performance-optimization/?
