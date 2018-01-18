$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyCAbowk_95R8-DrLyTpD-Y2BoaYIO6YSQ8",
    authDomain: "train-scheduler-1a0e5.firebaseapp.com",
    databaseURL: "https://train-scheduler-1a0e5.firebaseio.com",
    projectId: "train-scheduler-1a0e5",
    storageBucket: "train-scheduler-1a0e5.appspot.com",
    messagingSenderId: "784560832892"
  };
  firebase.initializeApp(config)

  var database = firebase.database()

  $(".submit").on("click", function(event) {
    event.preventDefault();
    var name = $("#trainNameForm").val()
    var destination = $("#destinationForm").val()
    var firstTrain = $("#firstTrainForm").val()
    var frequency = $("#frequencyForm").val()
    database.ref().push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    })
    alert("Employee successfully added")
    $("#trainNameForm").val("")
    $("#destinationForm").val("")
    $("#firstTrainForm").val("")
    $("#frequencyForm").val("")
  })

  //function to retrieve data
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().firstTrain;
    var trainFrequency = childSnapshot.val().frequency;
    console.log("name:", trainName)
    console.log("destination:", trainDest)
    console.log("first train time:", trainFirst)
    console.log("frequency:", trainFrequency)
    // convert time to minutes
    var firstTrainInMins = moment.duration(trainFirst).asMinutes()
    console.log("train time in minutes:", firstTrainInMins)
    // capture now and convert to military and then to minutes
    var now = moment()
    var nowinMilitary = moment(now).format("HH:mm")
    var nowinMinutes = moment.duration(nowinMilitary).asMinutes()
    // find the difference in time to get next train time and mins away
    var diff = moment(nowinMinutes).diff(firstTrainInMins)
    console.log("time diff:", diff)
    var nextTrainTimeinMins
    var minsAway
    console.log("time now in minutes:", nowinMinutes)
    if (firstTrainInMins > nowinMinutes) {
      nextTrainTimeinMins = firstTrainInMins
      minsAway = Math.abs(nextTrainTimeinMins - nowinMinutes)
    } else {
      minsAway = trainFrequency - (diff % trainFrequency)
      nextTrainTimeinMins = nowinMinutes + minsAway
    }
    console.log("next train time in mins:", nextTrainTimeinMins)
    console.log("mins away:", minsAway)
    // convert the next train time to military time format
    var nextTrainTime = moment().startOf('day').add(nextTrainTimeinMins, 'minutes').format("HH:mm")
    console.log("next train in 24h:", nextTrainTime)
    // create the table display
    var tBody = $("tbody")
    var tRow = $("<tr>")
    var nameTd = $("<td>").text(trainName)
    var destinationTd = $("<td>").text(trainDest)
    var frequencyTd = $("<td>").text(trainFrequency)
    var nextArrivalTd = $("<td>").text(nextTrainTime)
    var minutesAwayTd = $("<td>").text(minsAway)
    tRow.append(nameTd, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd)
    tBody.append(tRow);
  })
})
