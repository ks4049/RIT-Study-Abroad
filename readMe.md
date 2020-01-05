# Interactive form for choosing your Valentine (RIT Abroad Study program)

## Start Over - To start over the application from scratch.

## AJAX USING XHR - The datasets are retrieved by making XML HTTP requests to the data sources.

## Switch data source - To switch between the two datasets which is under the data directory on serenity.(URL:  http://serenity.ist.rit.edu/~ks4049/Project-01/data/)


## Information stored on Local Storage are as follows:

### 1. The pre-loaded data sources (data structure), the provided dataset and my own dataset on serenity.
### 2. The final destination program name.
### 3. The final destination program link.

## Information stored on Cookies are:(In order to maintain the session for the user, using the application)

	1. User's first name
	2. User's last name
	3. User's email ID

## Scalability
	The basic requirement is satified with both the datasets containing atleast a depth of 3 and width of 2.
	The application is scalable and scalability is verified with a dataset of depth:5 and the lowest level in tree containing a width of 3.
	Testing: The following options could be tried with my dataset:
	Which language do you prefer?  English -> Degree Level: Graduate -> Do you prefer expensive or cheap program? Expensive program -> Do you prefer technology or non-technology? Technology -> Do you prefer health-care/game design/imaging?(3 options) Game design

## Final Choices

### After the user has chosen the options from all the dropdowns, the list of choices he made from start is shown(dynamically generated) followed by the final destination program name(which is a link to that program on the RIT study abroad site).

## DTML/CSS Animation

### I have used DHTML for the header tag (by moving it from right to left)
### CSS Animation are applied on the dropdown. I have used slide-up animation on the dropdowns and also on hovering the dropdown the select box enlarges(by changing its width and height) and the content in it has bolder font by using CSS- select:hover. Made the select boxes responsive based on the screen sizes.

## Form Validation and Submission

### Most of the cases for my form validation, I have made use of the HTML5 validation by checking against regex patterns
### First name and last name can contain only characters
### Checks for validity of email.
### The radio buttons in the form are required.
### The text area which asks for feedback is conditionally required. If the previous radio is chosen as "Yes", then the feedback text area box is optional, otherwise it is made required.
### On form submission, I have made use of a third party library (sweet alert), showing a confirmation dialog, if OK is clicked then the form will be reset, otherwise if CANCEL the form is not resetted.

## Browser Detection
	I have made of the userAgent string to detect the browsers below IE 11 and shown message on the page, informing them to use the modern browsers above IE 10

## URL on serenity : http://serenity.ist.rit.edu/~ks4049/Project-01/. The code on serenity server is the babel transpiled version of JS code. The files uploaded on dropbox contains the non-transpiled version.


