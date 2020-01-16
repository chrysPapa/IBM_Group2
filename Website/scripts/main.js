var sidebarOpen = false; //initiate sidebar state
$(document).ready(function() {
  var searchHistory = [];
  var queryShowing = false;

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

  $("#customQueryBtn").click(function() {
    if ($("#customQuerySearch").val().length > 0) {
      optionList.push($("#customQuerySearch").val());
      $("#customQuerySearch").val("");
      updateOptionList();
    }
  });

  $(".optionButton").on("click", function() {
    if ($(this).hasClass("optionButtonInactive")) {
      optionButtonActive($(this));
      optionList.push($(this).text());
    } else {
      optionButtonInactive($(this));
      optionList.splice(optionList.indexOf($(this).text()), 1);
    }
    updateOptionList();
  });

  $('#customQuerySearch').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
          if ($("#customQuerySearch").val().length > 0) {
            optionList.push($("#customQuerySearch").val());
            $("#customQuerySearch").val("");
            updateOptionList();
          };
        }
    });

  $("div").on("click", ".queryResultTitle", function() {
    let text = $(this)
      .closest("div")
      .find(".Text");
    console.log($(text));
    if ($(text).is(":hidden")) {
      $(text).slideDown();
    } else {
      $(text).slideUp();
    }

    if (
      $(this)
        .children()
        .hasClass("fa-angle-right")
    ) {
      $(this)
        .children()
        .removeClass("fa-angle-right");
      $(this)
        .children()
        .addClass("fa-angle-down");
    } else {
      $(this)
        .children()
        .removeClass("fa-angle-down");
      $(this)
        .children()
        .addClass("fa-angle-right");
    }
  });

  function updateOptionList() {
    var returnString = "";
    if (optionList.length > 0) {
      returnString += '<p class="text-secondary">Current queries..</p>';
      for (var i = 0; i < optionList.length; ++i) {
        returnString += '<div class="optionListItem bg-primary text-light">';
        returnString +=
          '<i class="fas fa-times optionListRemoveIcon mr-1"></i>';
        returnString += optionList[i];
        returnString += "</div>";
      }
    } else returnString += '<p class="text-secondary">Start adding queries by clicking above..</p>';
    $("#queryOptionList").html(returnString);
  }

  $("#clearQueryBtn").click(() => {
    optionList = [];
    updateOptionList();
    resetOptionButtons();
  })

  $("#searchQueryBtn").click(function () {

      if (!queryShowing && optionList.length > 0) {
        addToHistory(optionList, searchHistory);

      var url =
        "https://ibm-project-group2-20200110154159265.eu-gb.mybluemix.net/query?queryData=";
      var flag = false;
      for (var i = 0; i < optionList.length; ++i) {
        if (!flag) {
          url = url + optionList[i];
          flag = true;
        } else url = url + "&queryData=" + optionList[i];
      }
      url+= "&colid=61bba916-01d3-497b-8ea2-0ac54d0fe7c2";

      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(jsonData) {
          var txt = "";
          txt += "<h4>Titles</h4>";
          loopLength = 10;
          for (var count = 0; count < loopLength; ++count) {
            if (jsonData.length > 0) {
              if (
                !jsonData[count].text.includes("Price: $") &&
                !jsonData[count].text.includes("CES Registration") &&
                !jsonData[count].text.includes("arrow-black")
              ) {
                txt += '<div class="p-3">';
                txt +=
                  '<h5 class="queryResultTitle"><i class="fas fa-angle-right mr-2"></i>' +
                  jsonData[count].extracted_metadata.title +
                  "</h5>";
                txt += "<div class='conceptBar bt-1'>";
                jsonData[count].enriched_text.concepts.forEach(concept => {
                  txt +=
                    '<div class="badge badge-info m-1 conceptBadge conceptBadgeInactive"><section>' +
                    concept.text +
                    "</section></div>";
                });
                txt += "</div>";
                var textBodyFull = removeTextEnding(jsonData[count].text);
                var textBodyWithDate = removeLocation(textBodyFull);
                txt += '<div class="Text">';
                txt += "<h6>Description</h6>";
                txt += "<p>" + removeDateTime(textBodyWithDate);
                +"</p>";
                txt += "<h6>Location</h6>";
                txt += "<p>" + getLocation(textBodyFull) + "</p>";
                txt += "<h6>Date/Time</h6>";
                txt +=
                  "<p>" +
                  getDateTime(textBodyWithDate) +
                  '<button style="float:right" value="Submit" class="saveButton btn btn-dark">Save</button></p>';

                txt += "</div></div>";
              } else if (jsonData.length > loopLength) {
                loopLength++;
              } else {
                loopLength = count;
              }
            }
          }

          $("#queryResultsContainer").html(txt);
          $(".Text").each(function() {
            $(this).hide();
          });
          showList();
          updateOptionList();
          resetOptionButtons();
        });
    } else{
      hideList();
      optionList = [];
      updateOptionList();
    } 
  });

  function showList() {
    queryShowing = true;
    $("#option-container").slideUp();
    $("#searchQueryBtn").html('<i class="fas fa-search mr-2"></i>New Query');
    $("#clearQueryBtn").toggle(300);
  }

  function hideList() {
    queryShowing = false;
    $("#option-container").slideDown();
    $("#searchQueryBtn").html('<i class="fas fa-search mr-2"></i>Search');
    $("#clearQueryBtn").toggle(300);
  }

  $(document).on("click", ".optionListRemoveIcon", function() {
    optionButtonInactive(
      $(
        ".optionButton:contains(" +
          $(this)
            .parent()
            .text() +
          ")"
      )
    );
    optionList.splice(
      optionList.indexOf(
        $(this)
          .parent()
          .text()
      ),
      1
    );
    updateOptionList();
  });

  function resetOptionButtons() {
    $(".optionButton").each(function() {
      if ($(this).hasClass("optionButtonActive")) {
        optionButtonInactive($(this));
      }
    });
  }

  function removeTextEnding(fullText) {
    return fullText.slice(0, fullText.search("All CES conference sessions"));
  }

  function removeLocation(text) {
    return text.slice(0, text.search("LOCATION"));
  }

  function getLocation(text) {
    text = text.slice(text.search("LOCATION"), text.search("INCLUDED"));
    return text.replace("LOCATION", "");
  }

  function getDateTime(text) {
    return text.slice(text.lastIndexOf(".") + 1, text.length);
  }

  function removeDateTime(text) {
    return text.slice(0, text.lastIndexOf(".") + 1);
  }

  $("#queryResultsContainer").on("click", ".conceptBadge", e => {
    let option = $(e.target).text();
    if (!optionList.includes(option)) {
      hideList();
      optionList.push(option);
      updateOptionList();
      console.log($(e.target).text());
    }
  });

  $('#searchHistory').on("click", ".historyEntry", (e) => {
    console.log("test");
    optionList = [];
    let entry = $(e.target);
    console.log(entry.children(".optionListItem"));
    children = entry.children(".optionListItem").each((index, object) => {
      optionList.push(object.innerHTML);
      console.log(object.innerHTML);
    })
    hideList();
    updateOptionList();
    toggleSidebar();
  })
});

function optionButtonActive(button) {
  button.removeClass("optionButtonInactive");
  button.addClass("optionButtonActive");
  button.children().removeClass("fa-plus");
  button.children().addClass("fa-check");
}

function optionButtonInactive(button) {
  button.removeClass("optionButtonActive");
  button.addClass("optionButtonInactive");
  button.children().removeClass("fa-check");
  button.children().addClass("fa-plus");
}

//SIDEBAR
$("#sidebar #sidebarButton").click(toggleSidebar);

function toggleSidebar() {
  $("#sidebar #sidebarContent").toggle(500);
  if (sidebarOpen) {
    $("#sidebar #sidebarButton")
      .removeClass("fa-angle-double-right")
      .addClass("fa-angle-double-left");
  } else {
    $("#sidebar #sidebarButton")
      .removeClass("fa-angle-double-left")
      .addClass("fa-angle-double-right");
  }
  sidebarOpen = !sidebarOpen;
}

function addToHistory(tags, searchHistory) {
  console.log(searchHistory);
  searchHistory.push(new searchQuery(tags));

  refreshHistory(searchHistory);
}

function refreshHistory(searchHistory) {
  let output = "";

  searchHistory.forEach(entry => {
    let tEntry = '<div class="historyEntry">';
    entry.getTags().forEach(tag => {
      tEntry +=
        '<div class="optionListItem bg-primary text-light">' + tag + "</div>";
    });

    output += tEntry + "</div>";
  }, this);

  $("#searchHistory").html(output);
}

class searchQuery {
  constructor(tags) {
    this.tags = tags;
  }

  getTags() {
    return this.tags;
  }
}
