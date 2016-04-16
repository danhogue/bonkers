Bonkers
=========
Web application project template, built with node, express, passport, etc. Focused on clean modular design.

Dev setup instructions
----------------------

Clone the repo then run the following:

    $ npm install (run this in the root folder)
    $ touch .env
    
As a bare minimum for the env file you'll want the following:

    HTTP_REDIRECT=false
    SECRET=12345abcde
    
Then go ahead and build and start:

    $ gulp build (may need to do ./node_modules/gulp/bin/gulp.js build)
    $ cd build
    $ npm install
    $ npm start
    
The default sign-in is: admin/password. (See ./application/models/user.js)

Deploying to Elastic Beanstalk
------------------------------

http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-getting-started.html

To create an environment

    $ eb create environment
    
To deploy to an existing environment
    
    $ eb deploy    
    
Notes:

When deploying to a new environment, don't forget to set the env variables and set start command to "npm start". If you 
forget you will get a "bad gateway" error 
