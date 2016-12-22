# actores-y-datos

This Project is based in the [Angular Seed project](https://github.com/angular/angular-seed) and all commands from there work in this project too.



## App Structure
All files from the app itself are content in app folder, files and folders outside correspond to gereric config files of any regular Angular Project (refer to [Angular Seed project](https://github.com/angular/angular-seed) for more info)

These are the folders inside the app folder and their respective description


|Folder         |Description      
| ------------- |-------------- 
|components     | Widgets (some of them are not being used actually in the project)
|countries      | **View**: Consolidated data of all countries
|css            | All styles are here (included view's styles)
|files          | Downloadable files
|home           | **View**: home view  
|images         | Folder containing images from project
|img            | Folder containing images from project (TO-DO: merge with images folder)
|libs           | Javascrip projects are suposed to be used all along the project
|network-viz    | **View**: Network visualization of each country data
|what-is        | **View**: Explanation of the project

## Deploy

For deploying the project the command used is ``gulp deploy``, this command uses the functionality of [gulp-gh-pages](https://www.npmjs.com/package/gulp-gh-pages) and was declared in **gulpfile.js** file
