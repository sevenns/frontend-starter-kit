# Requirements

You need [nodejs] (https://nodejs.org/en/) with npm, bower and gulp

    npm install -g bower
    
    npm install -g gulp
    
For work bower you need to install [git] (https://git-scm.com/downloads) on your PC

# Install

You need to open project directory in your terminal

First, you need to install node modules:

    npm i

Now do the same thing with bower:

    bower i

# Use

You need to open project directory in your terminal and:

enter for start main function

    gulp

enter for craft icons

    gulp craft-svg

# SVG Sprites

All svg icons need to move in ./src/icons

How to add icon in pug file
```pug
+icon('filename-in-iconsdir', 'custom-style')
```
or without custom style
```pug
+icon('filename-in-iconsdir')
```

For customization icon you can use
```scss
.icon--filename-in-iconsdir {
    // styles
    
    & .custom-style {
        // styles
    }
}
```
or without custom style
```scss
.icon--filename-in-iconsdir {
    // styles
}
```
