
https://www.quora.com/What-is-the-costliest-coding-error-anyone-has-ever-made/answer/Theodore-Smith-9?prompt_topic_bio=1
* https://en.wikipedia.org/wiki/Knight_Capital_Group

### Knight Capital Group
* When: Aug 2012 
* high frequency trading company
* lost $457 after being bailed by Goldman Sachs
* deathmarch and overtime to deliver
* C++ - testing and prod method had same method signature
    * testing method was designed to buy the worse stock - highest offer given
* They deployed to prod, QA tested it, when market went live they were in meeting with no phones...
* They physically destroyed the serverse after losing billions of dollars in 37 min which put the company out of business
* no CI/CD pipelines
* there was copy/paste to propagate an error and because the method signature was the same the code compiled using the testing algorithm


### Crowdstrike


