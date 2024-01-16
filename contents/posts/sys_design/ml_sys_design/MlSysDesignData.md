# Ml system design

![pipeline](/contents/posts/sys_design/ml_sys_design/factorio.gif)

____________
### Ml SDLC (software development life cycle)
####   1. Lock down the requirements
   - Metric
     - business metrics
       - business metrics are bad for optimization, they are not differentiable
       - cost of error
       - asymmetry of cost of errors of the first and second kind\
       - user satisfaction
     - technical metrics
     - proxy metrics  
     - metrics design 
       - decomposition into subtasks
       - compositions from different metric
   - Non-functional (NFR)
     - performance
       - latency
       - rps
     - reliability
       - the ability to produce the correct result on valid data
     - scalability
     - explainability
     - maintainability
     - adaptability
       - adaptability to data shift
       - adaptability to target drift
   - Limitations
     - availability of data with predictable force
     - cost with compared to human
     - money 
     - time 
     - laws - compliance & privacy 
     - technical 
     - integration 
     - learning maintainers and users
####   2. Design
   - task formalization
     - The same problem can be solved in different ways. For example helpdesk acceleration:
       - classification to which specialist to send the appeal
       - recommendation system - we recommend answers to the operator
       - regression to evaluate the importance of the user and the urgency of the appeal
       - respond with database search: ner, summation, qa
   - interface 
   - data 
   - algorithms
     - loss
       - papers with code for choosing loss
   - infrastructure 
   - approach
     - model centric approach
     - data centric approach
   - hardware
####   3. Data collection and preparation
####   4. Model development
   - model 
     - no ml 
     - simple model 
     - optimisation of simple model 
     - complex models
   - baseline 
     - existing solution on the market
     - easy on the rules
     - human decisions
     - competitor solutions
   - stages
     - the research stage is limited in time
     - the development stage based on the results of the first and limited in terms of the amount of work
####   5. Model deployment
####   6. Model monitoring
   - metrics and alerts
   - degradation of
      - model
      - data
####   7. Continuous delivery
####  8. Business analysis 


