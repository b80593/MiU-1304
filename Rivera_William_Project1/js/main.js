//MiU 1304
//Project 1
//William Rivera

//Wait until the DOM is ready.
window.addEventListener("DOMContentLoaded", function(){
    
    
    //getElementById Function
    
    //Create select field element and populate with options.
    function makeCats(){
        var formTag = document.getElementsByTagName("form"); //Is an array of all the form
            selectLi = document.getElementById("select"),
            makeSelect = document.createElement("select");
            makeSelect.setAttribute("id", "grades");
        for(var i=0, j=schoolGrades.length; i<j; i++){
            var makeOption = document.createElement("option");
            var optText = schoolGrades[i];
            makeOption.setAttribute("value", optText);
            makeOption.innerHTML = optText;
            makeSelect.appendChild(makeOption);
        }
        selectLi.appendChild(makeSelect);
    }
    
    //Find value of a selected radio button.
    function getSelectedRadio(){
        var radios =document.forms[0].gender;
        for(var i=0; i<radios.length; i++){
            if(radios[i].checked){
                genValue = radios[i].value;
            }
        }
    }
    
    function getCheckboxValue(){
        if(document.getElementById("fav").checked){
            alergiesValue = document.getElementById("fav").value;
        }else{
            alergiesValue = "No"
        }
    }
    
    function toggleControls(n){
        switch(n){
            case "on":
                document.getElementById("memForm").style.display = "none";
                document.getElementById("clear").style.display = "inline";
                document.getElementById("displayLink").style.display = "none";
                document.getElementById("addNew").style.display = "inline";
                break;
            case "off":
                document.getElementById("memForm").style.display = "block";
                document.getElementById("clear").style.display = "inline";
                document.getElementById("displayLink").style.display = "inline";
                document.getElementById("addNew").style.display = "none";
                document.getElementById("items").style.display = "none";
                break;
            default:
                return false;
        }
    }
    
    function storeData(key){
        //No key brand new item and need a new key
        if(!key){
        var id          = Math.floor(Math.random()*100000001);
        }else{
            //Set the id to the existing key we are editing sp that it will save over the data
            //The key is the same key that been passed along from the editSubmit event handler
            //to the validate func, and then passed here, into the storeData func.
            id = key;
        }
        //Gather up all form field value and store in a object
        //Obj properties cont array with the form label and input value.
        getSelectedRadio();
        getCheckboxValue();
        var item            ={};
            item.grade      =["School Grade:", document.getElementById("grades").value];
            item.fname      =["First Name:", document.getElementById("fname").value];
            item.lname      =["Last Name:", document.getElementById("lname").value];
            item.email      =["Email:", document.getElementById("email").value];
            item.gender     =["Gender:", genValue];
            item.fav        =["Any Alergies:", alergiesValue];
            item.nv         =["Number of Visits:",document.getElementById("nv").value];
            item.date       =["Date of Birth:", document.getElementById("date").value];
            item.notes      =["Comments:", document.getElementById("notes").value];
        //Save date into Local Storage: Use Stringify to convert out obj to a string.
        localStorage.setItem(id, JSON.stringify(item));
        alert("Member Saved!");        
    }
    
    function getData(){
        toggleControls("on");
        if(localStorage.length === 0){
            alert("There is no date in Local Storage so default data was added.");
            autoFillData();
        }
        //Write data from Local Storage to the browser.
        var makeDiv = document.createElement("div");
        makeDiv.setAttribute("id", "items");
        var makeList = document.createElement("ul");
        makeDiv.appendChild(makeList);
        document.body.appendChild(makeDiv);
        document.getElementById("items").style.display = "block";
        for(var i=0, len=localStorage.length; i<len; i++){
            var makeLi = document.createElement("li");
            var linksLi =document.createElement("li");
            makeList.appendChild(makeLi);
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            //Convert the string from local Storage value back to an obj by using JSON.parse().
            var obj = JSON.parse(value);
            var makeSubList = document.createElement("ul");
            makeLi.appendChild(makeSubList);
            getImage(obj.grade[1], makeSubList);
            for(var n in obj){
                var makeSubli = document.createElement("li");
                makeSubList.appendChild(makeSubli);
                var optSubText = obj[n][0]+" "+obj[n][1];
                makeSubli.innerHTML = optSubText;
                makeSubList.appendChild(linksLi);
            }
            makeItemLinks(localStorage.key(i), linksLi); //create our edit and delete buttons/link for each item in LS
        }
    }
    
    //Get the image for the right category
    function getImage(catName, makeSubList){
        var imageLi = document.createElement("li");
        makeSubList.appendChild(imageLi);
        var newImg = document.createElement("img");
        var setSrc = newImg.setAttribute("src", "img/"+ catName + ".png");
        imageLi.appendChild(newImg);
    }
    
    //Auto Populate Local Storage
    function autoFillData(){
        //JSON OBJ data required for this to work i coming from json.js
        //Store the JSON OBJ into Local Storage.
        for(var n in json){
            var id          = Math.floor(Math.random()*100000001);
            localStorage.setItem(id, JSON.stringify(json[n]));
        }
    }
    
    //Make Item Links
    //Create the edit and delete links for each stored item when displayed.
    function makeItemLinks(key, linksLi){
        //add edit single item link
        var editLink = document.createElement("a");
        editLink.href = "#";
        editLink.key = key;
        var editText ="Edit Member";
        editLink.addEventListener("click", editItem);
        editLink.innerHTML = editText;
        linksLi.appendChild(editLink);
        
        //add line break
        var breakTag = document.createElement("br");
        linksLi.appendChild(breakTag);
        
        //add delete single item link
        var deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.key = key;
        var deleteText = "Delete Member";
        deleteLink.addEventListener("click", deleteItem);
        deleteLink.innerHTML = deleteText;
        linksLi.appendChild(deleteLink);
    }
    
    function editItem(){
        //Grad the data from our item from Local Storage
        var value = localStorage.getItem(this.key);
        var item = JSON.parse(value);
        
        //Show the form
        toggleControls("off");
        
        //Populate the form fields with the current localStorage values.
        document.getElementById("grades").value = item.grade[1];
        document.getElementById("fname").value = item.fname[1];
        document.getElementById("lname").value = item.lname[1];
        document.getElementById("email").value = item.email[1];
        var radios =document.forms[0].gender;
        for(var i=0; i<radios.length; i++){
            if(radios[i].value == "Male" && item.gender[1] == "Male"){
                radios[i].setAttribute("checked", "checked");
            }else if(radios[i].value == "Female" && item.gender[1] == "Female"){
                radios[i].setAttribute("checked", "checked");
            }
        }
        if(item.fav[1] == "Yes"){
            document.getElementById("fav").setAttribute("checked", "checked");
        }
        document.getElementById("nv").value = item.nv[1];
        document.getElementById("date").value = item.date[1];
        document.getElementById("notes").value = item.notes[1];
        
        //Removed the initial listener from the input 'save member' button.
        save.removeEventListener("click", storeData);
        //Change Submit Button Value to Edit Button.
        document.getElementById("submit").value = "Edit Member";
        var editSubmit = document.getElementById("submit");
        //Save the key value establish in this fucntion as a prop of the editSubmit event
        //so we can use that value when se save the date we edited.
        editSubmit.addEventListener("click", validate);
        editSubmit.key =this.key;
    }
    
    function deleteItem(){
        var ask = confirm("Are you sure you want to delete this Member?");
        if(ask){
            localStorage.removeItem(this.key);
            alert("Member was deleted!!");
            window.location.reload();
        }else{
            alert("Member was NOT deleted.");
        }
    }
    
    function clearlocal(){
        if(localStorage.length === 0){
            alert("There is no data to clear.")
            
        }else{
            localStorage.clear();
            alert("All Members are deleted!");
            window.location.reload();
            return false;
        }
    }
    
    function validate(e){
        //Define the element we want to check
        var getGrade = document.getElementById("grades");
        var getFname = document.getElementById("fname");
        var getLname = document.getElementById("lname");
        var getEmail = document.getElementById("email");
        
        //Reset Error Messages
        errMsg.innerHTML = "";
        getGrade.style.border = "1px solid black";
        getFname.style.border = "1px solid black";
        getLname.style.border = "1px solid black";
        getEmail.style.border = "1px solid black";

        
        
        //Get Error Messages
        var messageArray = [];
        //Grade Validation
        if(getGrade.value ==="--Choose A Grade--"){
            var gradeError = "Please Choose a School Grade.";
            getGrade.style.border = "1px solid red";
            messageArray.push(gradeError);
        }
        
        //First name Validation
        if(getFname.value === ""){
            var fnameError = "Please enter a first name.";
            getFname.style.border = "1px solid red";
            messageArray.push(fnameError);
        }
        
        //Last Name Validation
        if(getLname.value === ""){
            var lNameError = "Please enter a last name.";
            getLname.style.border = "1px solid red";
            messageArray.push(lNameError);
        }
        
        //Email Validation
        var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!(re.exec(getEmail.value))){
            var emailError = "Please enter a valid email address.";
            getEmail.style.border = "1px solid red";
            messArray.push(emailError);
        }
        //If there were errors, display them on the screen
        if(messageArray.length >= 1){
            for(var i=0, j=messageArray.length; i<j; i++){
                var txt = document.createElement("li");
                txt.innerHTML = messageArray[i];
                errMsg.appendChild(txt);
            }
            e.preventDefault();
            return false;
            
        }else{
            //if all is OK, save data. Send the key value(which came from editData).
            //Remember thi key value
            storeData(this.key);
        }
        
    }
    
    //Variable defaults
    var schoolGrades = ["--Choose A Grade--", "Infants", "Toddlers", "Pre-School", "Kindergarden", "First Grade", "Second Grade", "Third Grade", "Fourth Grade", "Fifth Grade"],
        genValue,
        alergiesValue ="No",
        errMsg = document.getElementById("errors")
    ;
    makeCats();



    //Set Link & Submit Click Events
    var displayLink = document.getElementById("displayLink");
    displayLink.addEventListener("click", getData);
    var clearLink = document.getElementById("clear");
    clearLink.addEventListener("click", clearlocal);
    var save = document.getElementById("submit");
    save.addEventListener("click", validate);
    
    
    //Search
    
    var search = document.getElementById("search-1");
    search.addEventListener("click", getSearch);
    
    function getSearch(){
        var category = document.getElementById("grades").value;
        var term = document.getElementById("search-1").value;
        
        if(category != "--Choose a School Grade--" && term === ""){
            var makeDiv = document.createElement("div");
            makeDiv.setAttribute("id", "items");
            var makeList = document.createElement("ul");
            makeDiv.appendChild(makeList);
            document.body.appendChild(makeDiv);
            for(i=0, j=localStorage.length; i<j; i++){
                var key = localStorage.key(i);
                var value = localStorage.getItem(key);
                var obj = JSON.parse(value);
                if(category === obj.grades[1]){
                    var makeli = document.createElement("li");
                    var makeSubList = document.createElement("ul");
                    makeli.appendChild(makeSubList);
                    makeList.appendChild(makeli);
                    for (q in obj){
                        var makeSubli = document.createElement("li")
                        makeSubli.innerHTML = obj[q][0]+" "+obj[q][1];
                        makeSubList.appendChild(makeSubli);
                    }
                }
            }
        }
    }
    

});