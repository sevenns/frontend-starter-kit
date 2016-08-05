# Requirements

You need [nodejs] (https://nodejs.org/en/) with npm, bower and gulp

    npm install -g bower
    
    npm install -g gulp
    
For work bower you need to install [git] (https://git-scm.com/downloads) on your PC

# Install

You need to open project directory in your terminal

First, make changes in package.json with:

    npm init

After that, you need to install node modules:

    npm install

Now do the same thing with bower:

    bower init
    bower install

# Use

You need to open project directory in your terminal and:

enter for help message

    gulp

enter for start main function

    gulp start

enter for image minification from ./src/img to ./dist/img

    gulp img-minify
