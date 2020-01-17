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
      if ($('#clearQueryBtn').is(":hidden") && !queryShowing){
        $('#clearQueryBtn').toggle(300);
      }
      $('#searchQueryBtn').removeAttr("disabled");
      returnString += '<p class="text-secondary">Current queries...</p>';
      for (var i = 0; i < optionList.length; ++i) {
        returnString += '<div class="optionListItem bg-primary text-light">';
        returnString +=
          '<i class="fas fa-times optionListRemoveIcon mr-1"></i>';
        returnString += optionList[i];
        returnString += "</div>";
      }
    } else {
      returnString += '<p class="text-secondary">Start adding queries by clicking above...</p>';
      if (!$('#clearQueryBtn').is(":hidden")){
        $('#clearQueryBtn').toggle(300);
      }
      if (!queryShowing) $('#searchQueryBtn').attr("disabled", true);
    } 
    $("#queryOptionList").html(returnString);
  }

  $("#clearQueryBtn").click((e) => {
    optionList = [];
    updateOptionList();
    resetOptionButtons();
    $("html")[0].scrollIntoView();


  })

  $("#searchQueryBtn").click(function (e) {

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
      url += "&colid=" + $("#confSelection").children("option:selected").val();

      var textFormat;
      if ($("#confSelection").children("option:selected").text().includes("CES"))
        textFormat = 1;
      else if ($("#confSelection").children("option:selected").text().includes("O'REILLY"))
        textFormat = 2;
      
      waitingStatus(true);


      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(jsonData) {
          waitingStatus(false);
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
                txt += '<div class="Text">';
                txt += "<h6>Description</h6>";
                txt += "<p>" + getDescription(jsonData[count].text, textFormat)
                  + "</p>";
                txt += "<h6>Location</h6>";
                txt += "<p>" + getLocation(jsonData[count].text, textFormat) + "</p>";
                txt += "<h6>Date/Time</h6>";
                txt +=
                  "<p>" +
                  getDateTime(jsonData[count].text, textFormat) +
                  '<button style="float:right" value="Submit" class="saveButton btn btn-dark">Save</button></p>';

                txt += "</div></div>";
              } else if (jsonData.length > loopLength) {
                loopLength++;
              } else {
                loopLength = count;
              }
            }
          }
          //SAVE LIST
          txt += "<br><br><h4>Saved</h4>";
          var  flag=1;
          $(document).on("click", ".saveButton", function () {
            var html = $(this).parent().parent().parent().html();
            $(this).text("Unsave");
            $(this).removeClass("saveButton");
            $(this).addClass("unsaveButton");
            $("#saveContainer").append($(this).parent().parent().parent());
            $(document).on("click", ".unsaveButton", function () { 
              $("#saveContainer").append($(this).parent().parent().parent().hide())

          });
        }); 


          function updateSaveList() {
            var txt = "";
            for (var i = 0; i < saveList.length; ++i) {

            }

          }
          // /SAVE LIST
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
      $("html")[0].scrollIntoView();
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

  function getDescription(text, formatNum) {
    if (formatNum == 1) {
      if (text.includes("All CES conference sessions"))
        text = text.slice(0, text.search("All CES conference sessions"));
      if (text.includes("LOCATION"))
        text = text.slice(0, text.search("LOCATION"));
      return text.slice(0, text.lastIndexOf(".") + 1);
    } else if (formatNum == 2) {
      if (text.includes("Capital Suite"))
        return text.slice(text.search("Capital Suite") + 16, text.length);
      else if (text.includes("Capital Hall"))
        return text.slice(text.search("Capital Hall") + 12, text.length);
      else if (text.includes("S11"))
        return text.slice(text.search("S11") + 6, text.length)
      else return text;
    }
  }

  function getLocation(text, formatNum) {
    if (formatNum == 1) {
      if (text.includes("All CES conference sessions"))
        text = text.slice(0, text.search("All CES conference sessions"));
      if (text.includes("LOCATION") && text.includes("INCLUDED")) {
        text = text.slice(text.search("LOCATION"), text.search("INCLUDED"));
        return text.replace("LOCATION", "");
      }
    } else if (formatNum == 2) {
      if (text.includes("Capital Suite"))
        return text.slice(text.search("Location"), text.search("Capital Suite") + 16)
      else if (text.includes("Capital Hall"))
        return text.slice(text.search("Location"), text.search("Capital Hall") + 13)
    }
  }

  function getDateTime(text, formatNum) {
    if (formatNum == 1) {
      if (text.includes("All CES conference sessions"))
        text = text.slice(0, text.search("All CES conference sessions"));
      if (text.includes("LOCATION"))
        text = text.slice(0, text.search("LOCATION"));
      if (text.includes("INCLUDED WITH:"))
        text = text.replace("INCLUDED WITH:", "");
      if (text.includes("Conference Session"))
        text = text.slice(0, text.search("Conference Session"));
      if (text.includes("AM"))
        return text.slice(text.lastIndexOf(".") + 1, text.search("AM") + 3);
      else if (text.includes("PM"))
        return text.slice(text.lastIndexOf(".") + 1, text.search("PM") + 3);
      return text.slice(text.lastIndexOf(".") + 1, text.length);
    } else if (formatNum == 2) {
      if (text.includes("Location")) {
        return text.slice(0, text.search("Location"));
      } else return "";
    }
  }

  $("body").on("click", ".conceptBadge", e => {
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

function waitingStatus(status){

  if (status){
    $('#searchQueryBtn').removeClass('btn-success').addClass('btn-secondary')
    $('#searchQueryBtn').find('i').removeClass('fa-search').addClass('fa-hourglass-half')
  }
  else{
    $('#searchQueryBtn').find('i').addClass('fa-search').removeClass('fa-hourglass-half')
    $('#searchQueryBtn').addClass('btn-success').removeClass('btn-secondary')
  }
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
