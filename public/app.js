var subjectRunURL = "";
var objectRunURL = "";
var verbRunURL = "";
var lessonArray = new Array();
var lessonCounter = 0;
var subjectAnswer = false;
var objectAnswer = false;
var verbAnswer = false;
var lessonName = "";
var imageText = "";


document.addEventListener("DOMContentLoaded", event => { //setting up the firebase

    const app = firebase.app();
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);
$( ".swdraggable" ).draggable({ // setting up drag and drop
    cursor : 'move'
});
$( ".swdroppable" ).droppable({
    activeClass: "ui-state-highlight"
});


})

function uploadFile(files) {
    console.log("files ",files)
    const storageRef = firebase.storage().ref(); //reference storage for the uploaded pictures


    const file = files.item(0);
    console.log(file.name);

    const horseRef = storageRef.child(file.name);

    const task = horseRef.put(file);

    task.then(snapshot => {
        console.log(snapshot)


    const urlW = snapshot.downloadURL //gets image url of the image
    document.querySelector('#imgUpload').setAttribute('src', urlW);
    const db = firebase.firestore();

    var inputW1 = document.querySelector('#label1').value;

    db.collection('sensoryworldpictures').doc(file.name).set({
        fileName: snapshot.metadata.name,
        url: urlW,
        label: inputW1
    }) //takes assigned variables and places them into the database
    document.getElementById("#label1").innerHTML = inputW1;

}







)}

function googleLogin() { //google login
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)

        .then(result => {
        const user = result.user;
    document.write(`Hello ${user.displayName}`);
    console.log("User ",user)
    console.log("User Name",user.displayName)
})
.catch(console.log)

}
function showData() { //when search button is clicked, shows all od the images in database
    const db = firebase.firestore();
    //console.log(app)
    const myPost = db.collection('sensoryworldpictures');
    var labelValue = document.querySelector('#search1').value; //takes input from search bar and assigns it to variable


    var labelRecs = myPost.where("label", "==", labelValue); //displays images that have the same value as the input label

    var allPost = labelRecs.get()
    var imgArray = new Array();

    if (labelValue === null || labelValue === "" || labelValue === " ") { //default case, shows all images
        var allPost = myPost.get()
                .then(snapshot => {
                $('#Images').empty();
        $('#Images').append('<table id="recs"></table>');

        var table = $('#Images').children(); //places into table and shows images with their details
        table.addClass("table table-bordered");
        $.fn.editable.defaults.mode = 'inline';
        table.append("<thead>" + "<tr>" + "<th>FileName</th>" + "<th>Image</th>" + "<th>Label</th>" + "</tr>" + "</thead>");
        snapshot.forEach(doc => {
            table.append("<tr>" + "<td scope = row style='padding-left:10px;'>" + doc.data().fileName + "</td>" + "<td>" + "<img src = '" + doc.data().url + "' height = '60' width = '60'>" + "</td>" + "<td class = 'label'>" + "<span style='color:black;' href='#' data-name='label' data-pk=" + doc.data().fileName + ">" + doc.data().label + "</span>" + "</td>" + "</tr>");
        //imgArray.append(doc.data().url)
        console.log(doc.id, '=>', doc.data());
        var picture = [];
        picture["fileName"] = doc.data().fileName;
        imgArray.push(picture);
        var label = [];
        label["label"] = doc.data.label;
        imgArray.push(label);
        var url = [];
        url["url"] = doc.data.url;
        imgArray.push(url);

    });
    console.log("Array ", imgArray);

    $('#recs span[data-name="label"]').editable({ //allows the labels to be edited from the shown table
        tpl: "<input type='text' style='color:black'>",
        success: function (response, newValue) {
            console.log("In OK button ", response, newValue);
            var current_pk = $(this).data('pk');
            console.log("current pk", current_pk);
            db.collection('sensoryworldpictures').doc(current_pk).update({ //updates new changes (lables) into the database

                label: newValue

            })
        }

    })


})
.catch(err => {
    console.log('Error getting documents', err);
});
} else { //other case, shows all images with matching labels
    allPost.then(snapshot => {
        $('#Images').empty();
    $('#Images').append('<table id="recs"></table>');

    var table = $('#Images').children();
    table.addClass("table table-bordered");
    $.fn.editable.defaults.mode = 'inline';
    table.append("<thead>" + "<tr>" + "<th>FileName</th>" + "<th>Image</th>" + "<th>Label</th>" + "</tr>" + "</thead>");
    snapshot.forEach(doc => {
        table.append("<tr>" + "<td scope = row>" + doc.data().fileName + "</td>" + "<td>" + "<img src = '" + doc.data().url + "' height = '60' width = '60'>" + "</td>" + "<td class = 'label'>" + "<span style='color:black;' href='#' data-name='label' data-pk=" + doc.data().fileName + ">" + doc.data().label + "</span>" + "</td>" + "</tr>");
    //  imgArray.append(doc.data().url)

    console.log(doc.id, '=>', doc.data());
    var picture = [];
    picture["fileName"] = doc.data().fileName;
    imgArray.push(picture);
    var label = [];
    label["label"] = doc.data.label;
    imgArray.push(label);
    var url = [];
    url["url"] = doc.data.url;
    imgArray.push(url);


});

$('#recs span[data-name="label"]').editable({ //same as above, allows lables to be edited inline
    tpl: "<input type='text' style='color:black'>",
    success: function (response, newValue) {
        console.log("In OK button ", response, newValue);
        var current_pk = $(this).data('pk');
        console.log("current pk", current_pk);
        db.collection('sensoryworldpictures').doc(current_pk).update({

            label: newValue

        })
    }

})


})
.catch(err => {
    console.log('Error getting documents', err);
});
}
}

function lessonPlan() { //creates lesson plans

    //retrives information on lesson plans from user and stores them into variables
    const db = firebase.firestore();
    var inputName = document.querySelector('#lessonName').value;
    var inputLevel = document.querySelector('#lessonLevel').value;
    var questionLabel = document.querySelector('#questionLabel').value;
    var questionImageURL = document.querySelector("#questionImageURL");
    var questionImageURLsrc= questionImageURL.src;
    var subjectImageURL = document.querySelector("#subjectImageURL");
    var subjectImageURLsrc= subjectImageURL.src;
    var objectImageURL = document.querySelector("#objectImageURL");
    var objectImageURLsrc= objectImageURL.src;
    var verbImageURL = document.querySelector("#verbImageURL");
    var verbImageURLsrc= verbImageURL.src;
    var titleImage = document.querySelector("#questionLabel").value;



    db.collection('sensoryworldlessons').doc(inputName).set({ //sets given data into database
        name: inputName,
        level: inputLevel,
        question: questionLabel,
        questionImage: questionImageURLsrc,
        subjectImage: subjectImageURLsrc,
        objectImage: objectImageURLsrc,
        verbImage: verbImageURLsrc,
        question: titleImage




    });


}

function handleCardDrop(event, ui ) { //checks whether the dropped image guess matches with true value
    console.log("In the handleCardDrop");
    var droppableDiv = $(this);
    // var slotNumber = $(this).data( 'url' );
    var draggableUrl = ui.draggable.data('url');
    console.log("Url", draggableUrl);

    if (droppableDiv.attr('id') == "questionDroppableDiv") { //question check
        var questionImage = document.createElement("IMG");
        questionImage.id = 'questionImageURL';
        questionImage.src = draggableUrl, questionImage.height = "75", questionImage.width = "75";
        droppableDiv.html(questionImage)


    }


    if (droppableDiv.attr('id') == "subjectDroppableDiv") { //subject check
        var subjectImage = document.createElement("IMG");
        subjectImage.id = 'subjectImageURL';
        subjectImage.src = draggableUrl, subjectImage.height = "75", subjectImage.width = "75";
        droppableDiv.html(subjectImage)
    }


    if (droppableDiv.attr('id') == "objectDroppableDiv") { //object check
        var objectImage = document.createElement("IMG");
        objectImage.id = 'objectImageURL';
        objectImage.src = draggableUrl, objectImage.height = "75", objectImage.width = "75";
        droppableDiv.html(objectImage)
    }


    if (droppableDiv.attr('id') == "verbDroppableDiv") { //verb check
        var verbImage = document.createElement("IMG");
        verbImage.id = 'verbImageURL';
        verbImage.src = draggableUrl, verbImage.height = "75", verbImage.width = "75";
        droppableDiv.html(verbImage)
    }


    if (droppableDiv.attr('id') == "subjectRunLesson") { //subject check
        if (subjectRunURL == draggableUrl){
            subjectAnswer = true;
            checkAnswers();
            var subjectRun = document.createElement("IMG");
            subjectRun.id = 'subjectRunURL';
            subjectRun.src = draggableUrl, subjectRun.height = "75", subjectRun.width = "75";
            droppableDiv.html(subjectRun)

        }

    }


    if (droppableDiv.attr('id') == "objectRunLesson") { //object check
        if (objectRunURL == draggableUrl){
            objectAnswer = true;
            checkAnswers();
            var objectRun = document.createElement("IMG");
            objectRun.id = 'objectRunURL';
            objectRun.src = draggableUrl, objectRun.height = "75", objectRun.width = "75";
            droppableDiv.html(objectRun)

        }

    }


    if (droppableDiv.attr('id') == "verbRunLesson") { //verb check
        if (verbRunURL == draggableUrl){
            verbAnswer = true;
            checkAnswers();
            var verbRun = document.createElement("IMG");
            verbRun.id = 'verbRunURL';
            verbRun.src = draggableUrl, verbRun.height = "75", verbRun.width = "75";
            droppableDiv.html(verbRun)

        }

    }




    //  ui.draggable.position({of: $(this),my: 'left top', at: 'left top'});
    //ui.draggable.draggable('option','revert', false);

}




function searching( divSearch,findId) { //searches for images according to a inputted label
    console.log("hello")
    const db = firebase.firestore();
    //console.log(app)
    const myPost = db.collection('sensoryworldpictures');
    var value = document.querySelector(findId).value;

    var recs = null;
    if (value === null || value === "" || value === " ") {
        recs = myPost; //shows all pictures
    } else {
        recs = myPost.where("label", "==", value); //shows images only with a matching label
    }

    var allPosts = recs.get()
    var imgArray = new Array();



    var allPosts = recs.get()
            .then(snapshot => {
            $(divSearch).empty();
    $(divSearch).append('<div id="recs"></div>');

    var table = $(divSearch).children();


    //table.addClass("table table-bordered");
    $.fn.editable.defaults.mode = 'inline';

    snapshot.forEach(doc => { //makes each image draggable (to run the lesson)
        var imageDiv = $("<span/>",
            {
                "class":"swdraggable",
                "style":"height: 50px; width: 50px;"

            });
    var img = document.createElement("IMG");
    img.src = doc.data().url, img.height= "50", img.width= "50" ;
    imageDiv.html(img);
    imageDiv.data("url",doc.data().url);
    table.append(imageDiv);
    //table.append("<div class='swdraggable' style='position: relative;' >" +  "<img src = '" + doc.data().url + "' height = '60' width = '60'>" + doc.data().url + "</div>");
    //imgArray.append(doc.data().url)

    //same as above, places images into a generated table for display
    console.log(doc.id, '=>', doc.data());
    var picture = [];
    picture["fileName"] = doc.data().fileName;
    imgArray.push(picture);
    var label = [];
    label["label"] = doc.data.label;
    imgArray.push(label);
    var url = [];
    url["url"] = doc.data.url;
    imgArray.push(url);

});
$( ".swdraggable" ).draggable({ //makes each image drag and droppable
    containment: '#content',
    stack: '#cardPile div',
    cursor : 'move',
    revert: true
});
console.log("Array ", imgArray);
$( ".swdroppable" ).droppable({
    drop: handleCardDrop
});



$('#recs span[data-name="label"]').editable({ //allows user to make inline edits to labels
    tpl: "<input type='text' style='color:black'>",
    success: function (response, newValue) {
        console.log("In OK button ", response, newValue);
        var current_pk = $(this).data('pk');
        console.log("current pk", current_pk);
        db.collection('sensoryworldpictures').doc(current_pk).update({

            label: newValue

        })
    }

})
})
.catch(err => {
    console.log('Error getting documents', err);
});
}

function loadLesson() {
    const db = firebase.firestore();

    var mylesson = db.collection('sensoryworldlessons');

    var labelValue = document.querySelector('#searchSpecificLesson').value; //get data from user, allows to search a specific lesson

    if (labelValue != null && labelValue != "" && labelValue != " ") { //runs lesson with the same label given from user
        mylesson = mylesson.where("name", "==", labelValue);

    }



    var allLessons = mylesson.get()
            .then(snapshot => {
            snapshot.forEach(doc => {
            var lesson = [];
    // Creates  var lesson


    // subjectRunURL = doc.data().subjectImage;

    // objectRunURL = doc.data().objectImage;

    // verbRunURL = doc.data().verbImage;

    questionRunURL = doc.data().questionImage;

    lesson.questionRunURL = questionRunURL;

    lesson.subjectRunURL = doc.data().subjectImage;

    lesson.objectRunURL = doc.data().objectImage;

    lesson.verbRunURL = doc.data().verbImage;

    lesson.questionImage = doc.data().question;


    lessonArray.push(lesson);


    $('#lessonTable').empty();
    $('#lessonTable').append('<table id="recs"></table>');

    var table = $('#lessonTable').children(); //creates table for lessons
    table.addClass("table table-bordered");
    $.fn.editable.defaults.mode = 'inline';
    table.append("<thead>" + "<tr>" +
        "<th>Lesson Name</th>" +
        "<th>Lesson Level</th>" +
        "<th>Question Text</th>" +
        "<th>Question Image</th>" +
        "<th>Subject Image</th>" +
        "<th>Object Image</th>" +
        "<th>Verb Image</th>" +
        "<th>Edit Lession</th>" +
        "<th>Delete Lession</th>" +

        "</tr>" + "</thead>");


    snapshot.forEach(doc => {
        table.append("<tr>" + "<td scope = row style='padding-left:8px;'>" +
        doc.data().name + "</td>" +
        "<td>" + doc.data().level + "</td>" +
        "<td>" + doc.data().question + "</td>" +
        "<td>" + "<img src = '" + doc.data().questionImage + "' height = '60' width = '60'>" + "</td>" +
        "<td>" + "<img src = '" + doc.data().subjectImage + "' height = '60' width = '60'>" + "</td>" +
        "<td>" + "<img src = '" + doc.data().objectImage + "' height = '60' width = '60'>" + "</td>" +
        "<td>" + "<img src = '" + doc.data().verbImage + "' height = '60' width = '60'>" + "</td>" +
        "<td>"+ "<a "+" href='#' onclick='editLesson("+"\""+doc.data().name+"\"" +")' style=\'margin-left: 20px;\'>"+"Edit</a>" +"</td>" +
        "<td>"+ "<a "+" href='#' onclick='deleteLesson("+"\""+doc.data().name+"\"" +")' style=\'margin-left: 20px;\'>"+"Delete</a>" +"</td>" +
        "</tr>");


});


console.log(doc.data().questionImage);


})
console.log(lessonArray, "lesson");
playLesson(0);
})


}

function editLesson(lessonName){
    const db = firebase.firestore();

    var allLessons = db.collection('sensoryworldlessons');

    var editLessons = allLessons.where("name", "==", lessonName); //edit given lesson from user


    editLessons.get()
        .then(snapshot => {
        snapshot.forEach(doc => {
        var tab1 = $('#tabsHeader a[href="lessonPlan"]');

    //$('#tabsHeader a[href="lessonPlan"]').tab('show')
    $("#tabsHeader").tabs();
    $("#tabsHeader").tabs("option","active",1);


    var questionImagerun = $('#questionDroppableDiv');
    var subjectImagerun = $('#subjectDroppableDiv');
    var objectImagerun = $('#objectDroppableDiv');
    var verbImagerun = $('#verbDroppableDiv');
    var lessonLabelName = $('#lessonName');
    var lessonLabelLevel = $('#lessonLevel');

    var questionURL = document.createElement("IMG");
    var subjectURL = document.createElement("IMG");
    var objectURL = document.createElement("IMG");
    var verbURL = document.createElement("IMG");

    questionURL.id = "questionImageURL";
    subjectURL.id = "subjectImageURL";
    objectURL.id = "objectImageURL";
    verbURL.id = "verbImageURL";


    questionURL.src = doc.data().questionImage, questionURL.height= "50", questionURL.width= "50" ;
    subjectURL.src = doc.data().subjectImage, subjectURL.height= "50", subjectURL.width= "50" ;
    objectURL.src = doc.data().objectImage, objectURL.height= "50", objectURL.width= "50" ;
    verbURL.src = doc.data().verbImage, verbURL.height= "50", verbURL.width= "50" ;
    lessonLabelLevel.val (doc.data().level);
    lessonLabelName.val (doc.data().name);






    questionImagerun.html(questionURL);
    subjectImagerun.html(subjectURL);
    objectImagerun.html(objectURL);
    verbImagerun.html(verbURL);






})

})








}

function deleteLesson(lessonName){ //when a specific delete button clicked, removes that lesson
    const db = firebase.firestore();

    var allLessons = db.collection('sensoryworldlessons');
    allLessons.doc(lessonName).delete().then()
    {

        console.log('document has been deleted')
        loadLesson();

    }


    var deleteLessons = allLessons.where("name", "==", lessonName);


    deleteLessons.get()
        .then(snapshot => {
        snapshot.forEach(doc => {


    })

})








}



















function checkAnswers (){
    if (subjectAnswer && verbAnswer && objectAnswer){ //if all correct, display the congrats screen
        lessonCounter = lessonCounter + 1; //goes onto the next lesson
        var congratsDiv = $("#congrats")
        congratsDiv.css({ visibility: "visible"});
        setTimeout(
            function()
            {
                playLesson(lessonCounter)
            }, 2000);


    }

}

function playLesson(lessonCounter) { //plays the next or first lesson
    var congratsDiv = $("#congrats")

    congratsDiv.css({ visibility: "hidden"}); //shows the congrats screen when the user gets the question correct


    $("#objectRunLesson").html('Object');
    $("#subjectRunLesson").html('Subject');
    $("#verbRunLesson").html('Verb');





    var lesson = lessonArray[lessonCounter];

    var questionRunLesson = $("#questionRunLesson")
    $("#questionText").html(lesson.questionImage);


    var questionImg = document.createElement("IMG");

    questionImg.src = lesson.questionRunURL, questionImg.height= "50", questionImg.width= "50" ;

    questionRunLesson.html(questionImg).hide().show('fast');

    questionRunLesson.html(questionImg);

    questionRunLesson.data("url", lesson.questionRunURL);


    subjectRunURL = lesson.subjectRunURL;
    objectRunURL = lesson.objectRunURL;
    verbRunURL = lesson.verbRunURL;
    imageText = lesson.question;


    subjectAnswer = false;
    objectAnswer = false;
    verbAnswer = false;

}
