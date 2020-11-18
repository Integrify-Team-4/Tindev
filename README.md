# Tindev
### A job dating app for employer and job seeker**
Job Dating Web Application

# Introduction

The project is based on research about the solution of job seeker. The problem is that there is a very late response from the 
job advertiser. For example, Job hunter is applying today, but he sometimes gets a response after a long time or sometimes he gets
a response after 6 months  or sometimes he doesn't get anything. So, the main aim of this research and the project would be to identify
the solution either by suggesting to improve their profile within a short period with more skills or calling them for the interview when
the hunter got matched as well as the employer. This project will try to solve the problem for Job Hunter whose profile is matched with the
job title and the requirements of the employer. If the skills of the job hunter are matched with the requirements of the employer, 
there would be immediate contact in between them and the further process will go on via both parties, the Job hunter and the employer.


User Stories:






Problems:




Solution:




Scope: 




### Backend TinDev

Table of Contents:
1. Backend Tool Set
     The following tools are needed to install on your machine:
    - VS Code or any other IDES
    - Node > V10
    - npm > 6v
    - Docker
2.  Setup Database (no need)

3. How to run the project on your local machine
- first, clone the github repo(if you are not going to contribute on the repo) by the following command: `git clone git@github.com:Integrify-Team-4/Tindev.git `
(If you are going to contribute then, fork the repo into your account and then clone it from your account)
- go to your Tindev directory and install npm modules by the following commands
`cd Tindev` 
`npm install`
- if you are using the mac or linux(give the permission to execute script.sh file) by the following command
`chmod -x ./script.sh`
*This command allows to execute the file and install the docker container into your system, so that you don't need to install pg database manually*
- run the postgre database container on your system(optional)
- create a file in the root directory called `.env`
- set up the file with this variable
`PORT=3000
JWT_SECRET=abcd
DB_PASSWORD=secret`
- after setting up all of above, go to your terminal and hit the command `npm run watch`
