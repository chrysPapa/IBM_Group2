var sidebarOpen = false; //initate sidebar state
$(document).ready(function () {

  var searchHistory = [];

  var optionList = [
    "Aritificial Intelligence",
    "Machine Learning",
    "Data Algorithms",
    "Robotics",
    "Smart Devices",
    "Gaming",
    "Virtual Reality",
    "Augmented Reality",
    "Cryptocurrency",
    "Blockchain"
  ];
  var divText = "";
  for (var i = 0; i < optionList.length; ++i) {
    $("#optionList").append(createOptionBtn(optionList[i]));
  }

  function createOptionBtn(queryOption) {
    var toReturn = "";
    var queryId = queryOption.replace(" ", "");
    toReturn += '<div class="col-lg-4">';
    toReturn +=
      '<button type="button" class="optionButton optionButtonInactive">';
    toReturn += '<i class="fas fa-plus"></i>';
    toReturn += queryOption;
    toReturn += "</button></div>";
    return toReturn;
  }
  var optionList = [];

  $("#customQueryBtn").click(function () {
    if ($("#customQuerySearch").val().length > 0) {
      optionList.push($("#customQuerySearch").val());
      $("#customQuerySearch").val("");
      updateOptionList();
    }
  });

  $(".optionButton").click(function () {
    if ($(this).hasClass("optionButtonInactive")) {
      optionButtonActive($(this));
      optionList.push($(this).text());
    } else {
      optionButtonInactive($(this));
      optionList.splice(optionList.indexOf($(this).text()), 1);
    }
    updateOptionList();
  });

  $("div").on("click", ".queryResultTitle", function () {
    $(this).closest("div").find(".Text").toggle(500);
  });

  function updateOptionList() {
    var returnString = "";
    if (optionList.length > 0) {
      returnString += '<p class="text-secondary">Current queries..</p>';
      for (var i = 0; i < optionList.length; ++i) {
        returnString += '<div class="optionListItem bg-primary text-light">';
        returnString += optionList[i];
        returnString += "</div>";
      }
    } else returnString += '<p class="text-secondary">Start adding queries by clicking above..</p>';
    $("#queryOptionList").html(returnString);
  }
  var queryShowing = false;

  $("#searchQueryBtn").click(function () {
    if (!queryShowing) {

      //add to search history
      addToHistory(optionList, searchHistory);

      var url =
        "https://ibm-project-group2-20200110154159265.eu-gb.mybluemix.net/query?queryData=";
      var flag = false;
      for (var i = 0; i < optionList.length; ++i) {
        if (!flag) {
          url = url + optionList[i];
          flag = true;
        } else url = url + "&choice=" + optionList[i];
      }
      fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonData) {
          var txt = "";
          for (var count = 0; count < jsonData.length; ++count) {
            if (
              !jsonData[count].text.includes("Price: $") &&
              !jsonData[count].text.includes("CES Registration")
            ) {
              txt += '<div class=\"p-3">';
              txt +=
                '<h4 class=\"queryResultTitle\">' + jsonData[count].extracted_metadata.title + "</h4>";
              var textBodyFull = removeTextEnding(jsonData[count].text);
              var textBodyWithDate = removeLocation(textBodyFull);
              txt += '<div class=\"Text p-3\">'
              txt += "<p>" + removeDateTime(textBodyWithDate);
              +"</p>";
              txt += "<p>" + getLocation(textBodyFull) + "</p>";
              txt += "<p>" + getDateTime(textBodyWithDate) + "</p>";
              txt += "</div></div>";
            }
          }
          $("#queryResultsContainer").html(txt);
          showList();
          optionList = [];
          updateOptionList();
          resetOptionButtons();
        });
    } else hideList();
  });


  var test = 0;

  $(document).ready(function () {
    $("").click(function () {
      console.log("test");
      $("p").toggle(600);
      if (test == 0) {
        $(this).removeClass("fa-angle-right");
        $(this).addClass("fa-angle-down");
        test = test + 1;
      } else if (test == 1) {
        $(this).removeClass("fa-angle-down");
        $(this).addClass("fa-angle-right");
        test = 0;
      }

    });
  });

  function showList() {
    queryShowing = true;
    $("#option-container").slideUp();
    $("#searchQueryBtn").html('<i class="fas fa-search mr-2"></i>New Query');
  }

  function hideList() {
    queryShowing = false;
    $("#option-container").slideDown();
    $("#searchQueryBtn").html('<i class="fas fa-search mr-2"></i>Search Query');
  }

  function resetOptionButtons() {
    $(".optionButton").each(function () {
      if ($(this).hasClass("optionButtonActive")) {
        optionButtonInactive($(this));
      }
    })
  }

  function removeTextEnding(fullText) {
    return fullText.slice(0, fullText.search("All CES conference sessions"));
  }

  function removeLocation(text) {
    return text.slice(0, text.search("LOCATION"));
  }

  function getLocation(text) {
    text.replace("LOCATION", "Location");
    return text.slice(text.search("LOCATION"), text.length);
  }

  function getDateTime(text) {
    return text.slice(text.lastIndexOf(".") + 1, text.length);
  }

  function removeDateTime(text) {
    return text.slice(0, text.lastIndexOf(".") + 1);
  }
});

function optionButtonActive(button) {
  button.removeClass("optionButtonInactive");
  button.addClass("optionButtonActive");
  button
    .children()
    .removeClass("fa-plus");
  button
    .children()
    .addClass("fa-check");
}

function optionButtonInactive(button) {
  button.removeClass("optionButtonActive");
  button.addClass("optionButtonInactive");
  button
    .children()
    .removeClass("fa-check");
  button
    .children()
    .addClass("fa-plus");
}

//SIDEBAR
$('#sidebar #sidebarButton').click(toggleSidebar);

function toggleSidebar(){
  $('#sidebar #sidebarContent').toggle(500);
  if (sidebarOpen){
    $('#sidebar #sidebarButton').removeClass('fa-angle-double-right').addClass('fa-angle-double-left');
  }else{
    $('#sidebar #sidebarButton').removeClass('fa-angle-double-left').addClass('fa-angle-double-right');
  }
  sidebarOpen = !sidebarOpen;
};

function addToHistory(tags, searchHistory){
  console.log(searchHistory);
  searchHistory.push(new searchQuery(tags));

  refreshHistory(searchHistory);

  
}

function refreshHistory(searchHistory){
  let output = "";

  searchHistory.forEach((entry) => {
    let tEntry = "<div class=\"historyEntry\">";
    entry.getTags().forEach((tag) => {
      tEntry += "<div class=\"optionListItem bg-primary text-light\">" + tag + "</div>" 
    })

    output += tEntry + "</div>";
  }, this);

  $('#searchHistory').html(output);
  
}

class searchQuery{
    constructor(tags){
        this.tags = tags;
    }

    getTags(){
        return this.tags;
    }
}
