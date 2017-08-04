# Requirements

You need [nodejs] (https://nodejs.org/en/) with npm and gulp
    
    npm install -g gulp

# Install

You need to open project directory in your terminal

You need to install node modules:

    npm i

# Use

You need to open project directory in your terminal and:

enter for start main function

    gulp

enter for build only

    gulp build

enter for copy all assets

    gulp copy

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
