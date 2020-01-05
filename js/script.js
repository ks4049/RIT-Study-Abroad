/* Browser detection for non-modern browsers */
window.onload = function detectBrowser(){						
	if(navigator.userAgent.indexOf("MSIE ")>0){
		// Swal.fire({
	// 			type: "error",
	// 			title: "Oops...Not supported in browsers < IE 11.",
	// 			text: "Please try in browsers IE11 and above!",
	// 			showConfirmButton: false,	  				
	// 			allowOutsideClick: false  								
		// });
		document.write("Oops...no support in browsers less than IE 11. Please try in browsers IE11 and above!");
	} else 	{
		getDataSource();
	}
}

/* XHR to get the data sources (Pre-loading)
* dataSource_2.json on serenity contains the RIT study abroad program (for Valentine's)
* dataSource_1.json contains the provided data set
*/
function getDataSource(){
	let http = new XMLHttpRequest(),
	http1 = new XMLHttpRequest(),			
	url = "https://people.rit.edu/ks4049/Projects/data/dataSource_2.json",
	url_1 = "https://people.rit.edu/ks4049/Projects/data/dataSource_1.json";

	http.open("GET", url, true);			
	http.onreadystatechange = function(){				
		if(http.readyState==4 && http.status==200){
			data = JSON.parse(http.responseText);
			localStorage.setItem("dataSource_1", http.responseText);					
			createDropDown(JSON.parse(localStorage.getItem("dataSource_1")) || data ,document.interactiveForm,'Question');
		}
	}
	http.send(null);			
	http1.open("GET", url_1, true);	
	http1.onreadystatechange = function(){				
		if(http1.readyState==4 && http1.status==200){
			dataSource2 = JSON.parse(http1.responseText);
			localStorage.setItem("dataSource_2", http1.responseText);
		}
	}	
	http1.send(null);
	// DHTML for moving the header tag
	let headingTag = document.getElementById("ritHead").querySelector("h3");
	headingTag.setAttribute("style","font-weight:900;width:580px;left:5px");
	//moveHeading(headingTag,5);
}

/*Dynamic HTML to move the heading*/
// function moveHeading(headingTag, dx){
// 	if((parseInt(headingTag.style.width)+parseInt(headingTag.style.left)+dx) < screen.width){
// 		headingTag.style.left= parseInt(headingTag.style.left)+dx+"px";
// 	}else{
// 		headingTag.style.left = "0px";
// 	}
// 	setTimeout(function(){
// 		moveHeading(headingTag,5);	
// 	}, 30);
// }

/*Generic functionality to create dropdown 		
*key - indicating the key to be referred in the data structure
*target - the target node where dropdown option was selected
*dataObj - the current data object
*/
function createDropDown(dataObj, target, key){
	let targetParent = target.parentNode;
	key = key || target.value;
	let divSelect = document.createElement("div");
	if(targetParent.id!="forms"){
		let parentID = parseInt(targetParent.id.split("_")[1]);				
		divSelect.setAttribute("id","div_"+(parentID+1));
	}else{
		divSelect.setAttribute("id","div_1");
	}
	let selectOpt = dataObj[key];
	if(selectOpt==undefined)
		return;		
	let selectTag = document.createElement("select");
	selectTag.setAttribute("id", key);
	for(let question in selectOpt){
		let optionTag = document.createElement("option");
		let optionText = document.createTextNode(question);
		optionTag.setAttribute("value", question);
		optionTag.appendChild(optionText);
		selectTag.appendChild(optionTag);
		let options = selectOpt[question];												
		for(let i=0, len=options.length;i<len;i++){
			let optionTag = document.createElement("option");					
			let	optionText = document.createTextNode(options[i]);					
			optionTag.setAttribute("value", options[i]);					
			optionTag.appendChild(optionText);
			selectTag.appendChild(optionTag);
		}
	}			
	divSelect.appendChild(selectTag);			
	if(targetParent.id!="forms"){
		targetParent.appendChild(divSelect);			
	}else{
		target.appendChild(divSelect);
	}						
}		

document.body.addEventListener("change", function(event){
	/* On change of dropdown, removing all children of target element
	*/
	if(event.target.nodeName == "SELECT"){	
		let targetNode = event.target;
		// removing old childnodes of the changed dropdown							
		if(targetNode.nextElementSibling){
			targetNode.parentNode.removeChild(targetNode.parentNode.lastChild);
			if(document.contactForm!=undefined){
				document.getElementById("forms").removeChild(document.contactForm);	
			}
		}
		// on reaching the final decision, which contains the destination
		if(typeof data[targetNode.value]=="string"){				
			let divTag;
			divTag = document.getElementById("result");
			if(divTag==undefined){
				divTag = document.createElement('div');
				divTag.setAttribute("id","result")
			}
			let h3Tag = document.createElement('h3');
			let h3Text = document.createTextNode("The following were your choices:");
			h3Tag.appendChild(h3Text);								
			let resultNode = getResultDetails(data[targetNode.value]);				
			if(divTag.childNodes.length>0){
				divTag.replaceChild(h3Tag, divTag.childNodes[0]);
				divTag.replaceChild(resultNode, divTag.childNodes[1]);
			}else{
				divTag.appendChild(h3Tag);
				divTag.appendChild(resultNode);
			}
			targetNode.parentNode.appendChild(divTag);
			if(document.contactForm==undefined){
				createContactForm();
			}
		}else{
			createDropDown(data, targetNode);
		}			
	}

	/*On change of input in contact form, storing the user's information in cookies*/
	if(event.target.nodeName == "INPUT"){			
		let firstName, lastName, userEmail;
		if(event.target.id=="fName"){
			firstName = event.target.value;
			cookies.setCookie("firstName", firstName);
		}else if(event.target.id == "lName"){
			lastName = event.target.value;
			cookies.setCookie("lastName", lastName);
		}else if(event.target.id == "email"){
			userEmail =  event.target.value;
			cookies.setCookie("userEmail", userEmail);
		}
	}
});

/*To start the search from scratch 
* on click of startOver/ switching data source(swapping the data sources)
* on click of submit/final destination link (opens up the destination link in new window)
*/ 
document.body.addEventListener("click", function(event){
	
	if(event.target.id=="startOver"){
		startFromScratch();
	} else if(event.target.id=="switchData") {  
		// swap the data sources 
		let temp = data;
		data = dataSource2;
		dataSource2 = temp;
		localStorage.setItem("dataSource_1", JSON.stringify(data));
		localStorage.setItem("dataSource_2", JSON.stringify(dataSource2));

		startFromScratch(true);
	} else if(event.target.id=="finalDecision" || event.target.id=="submitInfo" ) {
		let target = (JSON.parse(localStorage.getItem("dataSource_1"))[event.target.textContent]) ||data[event.target.textContent] || event.target.href;
		event.target.href="#";
		let win = window.open(target,'_blank');
		win.focus();			
	}
});

/* functionality to start over the application/switch the data source
 * maintaining consistency with cookies and local storage(removing items in storage and deleting cookies)
 * boolean, when true indicates (it has been called from switch data)
 */
function startFromScratch(replaceDropDown) {
	let initialSelect = document.interactiveForm.querySelector("SELECT");
	// clearing local storage and cookies 
	localStorage.removeItem("finalProgram");
	localStorage.removeItem("programLink");
	cookies.deleteCookie("firstName");
  	cookies.deleteCookie("lastName");
  	cookies.deleteCookie("userEmail");
	if(initialSelect.nextElementSibling){
		initialSelect.parentNode.removeChild(initialSelect.nextElementSibling);
		if(document.contactForm!=undefined) {
			document.interactiveForm.parentNode.removeChild(document.contactForm);
		}
	}		
	initialSelect.value = initialSelect.childNodes[0].value;
	// creating initial dropdown on switching data source
	if(replaceDropDown){
		document.interactiveForm.removeChild(document.interactiveForm.lastChild);
		createDropDown((JSON.parse(localStorage.getItem("dataSource_1")) || data) ,document.interactiveForm,'Question');
	}
}


/*
* Creating the contact form dynamically
* HTML 5 validation added wherever required
*/
function createContactForm(){
	let formTag = document.createElement("form");
	formTag.setAttribute("name","contactForm");
	formTag.setAttribute("class","contactForm");
	// <h3 style="color:#E86100;left:15px;">Search Programs</h3>
	let h3Tag = document.createElement("h3");
	let h3Text = document.createTextNode("Fill out the form below");
	h3Tag.appendChild(h3Text);
	h3Tag.setAttribute("style","color:#E86100;left:15px;");
	let spanEle = document.createElement("span");
	spanEle.setAttribute("style","position:relative;left:15px");
	let spanText = document.createTextNode("We are here to help you find the best suitable program");
	spanEle.appendChild(spanText);
	formTag.appendChild(h3Tag);
	formTag.appendChild(spanEle);
	let fNameDivEle = document.createElement("div");			
	let labelEle = document.createElement("label");
	let labelText = document.createTextNode("First Name");
	labelEle.appendChild(labelText);
	labelEle.setAttribute("for", "fName");
	let fnameEle = document.createElement("input");
	fnameEle.setAttribute("name","fName");
	fnameEle.setAttribute("type","text");
	fnameEle.setAttribute("id","fName");
	fnameEle.setAttribute("placeholder","Your first name...");
	fnameEle.setAttribute("required","");
	fnameEle.setAttribute("pattern", "[a-zA-Z]+");
	//fnameEle.setAttribute("title","Name should contain only letters. e.g. john");
	spanEle = document.createElement("span");
	spanEle.setAttribute("class", "form_hint");
	spanText = document.createTextNode("First name should contain only characters");
	spanEle.appendChild(spanText);
	fNameDivEle.appendChild(labelEle);
	fNameDivEle.appendChild(document.createElement("br"));
	fNameDivEle.appendChild(fnameEle);
	fNameDivEle.appendChild(spanEle);
	formTag.appendChild(fNameDivEle);
	let lNameDivEle = document.createElement("div");
	labelEle = document.createElement("label");		
	labelText = document.createTextNode("Last Name");
	labelEle.setAttribute("for","lName");
	labelEle.appendChild(labelText);
	let lNameEle = document.createElement("input");
	lNameEle.setAttribute("type","text");
	lNameEle.setAttribute("id","lName");
	lNameEle.setAttribute("name","lName");		
	lNameEle.setAttribute("pattern", "[a-zA-Z]+");
	lNameEle.setAttribute("required","");
	lNameEle.setAttribute("placeholder","Your last name...");
	let spanEle_1 = document.createElement("span");
	spanEle_1.setAttribute("class", "form_hint");
	spanText_1 = document.createTextNode("Last name should contain only characters");
	spanEle_1.appendChild(spanText_1);		
	lNameDivEle.appendChild(labelEle);
	lNameDivEle.appendChild(document.createElement("br"));
	lNameDivEle.appendChild(lNameEle);
	lNameDivEle.appendChild(spanEle_1);
	formTag.appendChild(lNameDivEle);
	let emailDivEle = document.createElement("div");
	labelEle = document.createElement("label");
	labelEle.setAttribute("for","email");
	labelText = document.createTextNode("Email Address");
	labelEle.appendChild(labelText);
	let emailEle = document.createElement("input");
	emailEle.setAttribute("type","email");
	emailEle.setAttribute("name","email");
	emailEle.setAttribute("id","email");
	emailEle.setAttribute("placeholder","khavyas@example.com");
	emailEle.setAttribute("required","");		
	let spanEle_2 = document.createElement("span");
	spanEle_2.setAttribute("class","form_hint");
	spanText_2 = document.createTextNode("Proper format \"name@something.com\"");
	spanEle_2.appendChild(spanText_2);
	emailDivEle.appendChild(labelEle);
	emailDivEle.appendChild(document.createElement("br"));
	emailDivEle.appendChild(emailEle);
	emailDivEle.appendChild(spanEle_2);
	formTag.appendChild(emailDivEle);
	let genderDivEle = document.createElement("div");
	let gender = ["Male", "Female", "Unknown"];
	labelEle = document.createElement("label");
	labelEle.setAttribute("for","gender");
	labelText = document.createTextNode("Gender");
	labelEle.appendChild(labelText);
	genderDivEle.appendChild(labelEle);
	genderDivEle.appendChild(document.createElement("br"));
	for(let i=0, len=gender.length; i<len; i++){
		let radioEle = document.createElement("input");
		radioEle.setAttribute("type","radio");
		radioEle.setAttribute("name","gender");
		radioEle.setAttribute("required","");			
		radioEle.setAttribute("id",gender[i]);
		let radioLabel = document.createElement("label");
		radioLabel.setAttribute("for",gender[i]);
		radioLabel.setAttribute("style", "font-weight: normal;");
		let radioText = document.createTextNode(gender[i]);
		radioLabel.appendChild(radioText);
		genderDivEle.appendChild(radioEle);
		genderDivEle.appendChild(radioLabel);
		genderDivEle.appendChild(document.createElement("br"));
	}
	formTag.appendChild(genderDivEle);
	let interestDivEle = document.createElement("div");
	labelEle = document.createElement("label");
	labelEle.setAttribute("for","interests");
	labelText = document.createTextNode("Did the final choice match your interests?");
	labelEle.appendChild(labelText);
	interestDivEle.appendChild(labelEle);
	interestDivEle.appendChild(document.createElement("br"));
	let choices = ["Yes","No"];
	for(let i=0, len=choices.length; i<len; i++){
		let radioEle = document.createElement("input");
		radioEle.setAttribute("type","radio");
		radioEle.setAttribute("name","interests");			
		radioEle.setAttribute("required","");
		radioEle.setAttribute("id",choices[i]);
		let radioLabel = document.createElement("label");
		radioLabel.setAttribute("for",choices[i]);
		radioLabel.setAttribute("style", "font-weight: normal;");			
		let radioText = document.createTextNode(choices[i]);
		radioLabel.appendChild(radioText);
		interestDivEle.appendChild(radioEle);
		interestDivEle.appendChild(radioLabel);
		interestDivEle.appendChild(document.createElement("br"));
	}
	formTag.appendChild(interestDivEle);
	let feedBackDivEle = document.createElement("div");
	labelEle = document.createElement("label");
	labelEle.setAttribute("for","feedback");
	labelText = document.createTextNode("If no, provide more information about your interests");
	labelEle.appendChild(labelText);
	let textAreaEle = document.createElement("textarea");
	textAreaEle.setAttribute("rows",6);
	textAreaEle.setAttribute("cols",40);
	textAreaEle.setAttribute("name","feedback");
	spanEle = document.createElement("span");
	spanEle.setAttribute("style","color:blue");
	spanText = document.createTextNode("If you're having trouble finding a program, contact us at ");
	let aEle = document.createElement("a");
	aEle.setAttribute("href","mailto:global@rit.edu");
	let aText = document.createTextNode("global@rit.edu");
	aEle.appendChild(aText);
	spanEle.appendChild(spanText);
	spanEle.appendChild(aEle);
	feedBackDivEle.appendChild(labelEle);
	feedBackDivEle.appendChild(document.createElement("br"));
	feedBackDivEle.appendChild(textAreaEle);
	feedBackDivEle.appendChild(document.createElement("br"));
	feedBackDivEle.appendChild(spanEle);		
	formTag.appendChild(feedBackDivEle);
	let submitDivEle = document.createElement("div");		
	let submitEle = document.createElement("input");
	submitEle.setAttribute("type","submit");
	submitEle.setAttribute("value","Submit Form");
	submitEle.setAttribute("id","submitForm");
	submitDivEle.appendChild(submitEle);
	formTag.appendChild(submitDivEle);
	document.getElementById("forms").appendChild(formTag);

	// on click of Submit button in form
	document.getElementById("submitForm").addEventListener("click", function(event){

		// if the interest radio button is "No", making feedback text area as required
		let feedEle = document.getElementsByName("feedback")[0];
		if(document.getElementsByName("interests")[1].checked){		
			feedEle.setAttribute("required","");
			feedEle.setAttribute("title", "Let us know how can we improve.");
		}else{	
			feedEle.removeAttribute("required");
			feedEle.removeAttribute("title");
		}
		/* HTML validation of the contact form */
		if(document.contactForm.checkValidity()){

			// Getting the user's session information from the cookies set.
			let fullName = cookies.getCookie("firstName") && cookies.getCookie("firstName")+" "+cookies.getCookie("lastName") || (document.getElementById("fName").value+" "+document.getElementById("lName").value) ;
			let email = cookies.getCookie("userEmail") || (document.getElementById("email").value);
			let finalDecision =  localStorage.getItem("finalProgram") || document.getElementById("finalDecision").textContent; 
			let programLink = localStorage.getItem("programLink")|| data[finalDecision];
			/*firing the sweet alert (third party library) on submission*/
			Swal.fire({
			  position: 'top',
			  imageUrl: 'img/tick.png',
			  imageHeight: 100,								  
			  title: "Hey "+fullName+" \nSaving your information...",				  			  
			  html: "Click <a id=\"submitInfo\" href="+programLink+">here</a> to apply. \n We will provide more information on "+email,
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'OK'
			}).then(function(result){
			  if (result.value) {
			  	// deleting the cookies set on clicking OK(from the dialog box)
			  	cookies.deleteCookie("firstName");
			  	cookies.deleteCookie("lastName");
			  	cookies.deleteCookie("userEmail");
			  	// Resetting the form on successful submission
			  	document.contactForm.reset();
			  }
			});
			// preventing the page to refresh, on form submission
			event.preventDefault();
		}
	});		
}		

/* Dynamically populating the final choices (after reaching the lowest depth)		
*/
function getResultDetails(finalProgram){		
	let selectNodes = document.getElementById("forms").querySelectorAll("SELECT");						
	let divTag = document.createElement("div");
	divTag.setAttribute("id", "choices");
	for(let i=0; i<selectNodes.length; i++){
		let labelTag = document.createElement("label");
		let labelText = document.createTextNode(selectNodes[i].options[0].value);
		labelTag.appendChild(labelText);
		let pTag = document.createElement("p");
		let pText = document.createTextNode(selectNodes[i].value);
		pTag.appendChild(pText);
		pTag.setAttribute("id","choices_"+i);
		labelTag.setAttribute("for", pTag.id);
		divTag.appendChild(labelTag);
		divTag.appendChild(pTag);			
	}
	let h3Tag = document.createElement("h3");
	let h3Text = document.createTextNode("You should go for ");		
	let linkTag = document.createElement("a");
	linkTag.setAttribute("href","#");
	linkTag.setAttribute("id", "finalDecision");
	// storing in local storage the final program link and the destination
	localStorage.setItem("finalProgram", finalProgram);
	localStorage.setItem("programLink", data[finalProgram]);
	let linkText = document.createTextNode(finalProgram);		
	linkTag.appendChild(linkText);
	h3Tag.appendChild(h3Text);
	h3Tag.appendChild(linkTag);
	divTag.appendChild(h3Tag);		
	return divTag;		
}
