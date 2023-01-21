# System design

![sys design](/contents/posts/sys_design/sys_design/factorio.gif)


### HLD (High Level Design)

1. Lock down the requirements
   * Functional (FR)
     * features
   * Non-functional (NFR)
     * scale
     * latency
     * availability
     * consistency
     * ...
   * Future proof
     *  non-restrictive
     * pluggable
2. Propose an actual design
     * components and services
       * pros and cons in terms of our system NFR
     * interaction between the systems
     * databases
3. Tradeoffs
   * bottlenecks
   * health monitoring
   * audit systems
4. Limitations

### LLD (Low Level Design?)
1. Lock down the requirements
2. Code
   * define the interfaces
   * REST APIs
   * class diagrams
     * hierarchy    
   * entities and data models
   * design pattern
   
### Lock down the requirements

####  Functional
* generalise reqs to understand api methods
* input params and return values
* design api throughout several iterations

####  Non-functional
We need choose 2-3 with highest priority 

* scalable (requests/sec)
* performance  (request/sec)
* availability (no failure time)
* Consistency
* Cost 
  * hardware
  * development
  * maintenance

#### Sample questions

1. Users/Customers  
   - who will use? 
   - how the system will be used?
2. Scale (read and write)
   - how many read queries/sec?   
   - how much data is queried per request?
3. Performance
   - what is expected write-to-read delay? 
   - what is expected p99 latency for read queries?
4. Cost
   - should design minimise the cost of development?
   - should design minimise the cost of maintenance?