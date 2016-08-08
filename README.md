# aws-s3-client
Web based client for AWS S3

#Preview 
The site can be viewed at http://vamshi-krishna.com/aws-s3-client/build

#Steps to build locally 
1. `npm install`
2. `bower install`
3. `npm start`

Last statement will run the custom build tool to run the app. 

Open in the browser `http://localhost:8080`

#Unit tests 
Spec files of a component or service are included in their respective folders.
To start unit tests run 

`npm test`

#TODO
* Add eslint
* Integrate karma into build tool
* Inject sessionStorage for easier testing 
* Show error when something goes wrong 
* Font icons might not work some cases 
* List fetches only first 1000 files
* Create folders ( UI missing ) 
* Abort upload 
* Configure file upload max size and supported file formats
* Pause and resume file upload 
* Local storage of the credentials instead of giving everytime
* Test connection before saving credentials
* Set sub folders other than root folder  . Right now only the main root bucket can be given, others might not work
