<!DOCTYPE html>
<html lang="en">
  <head>
    <?php
    require('includes/conn.php');
    $listQuery = "SELECT * FROM conferencedata";
    $stmt = $pdo->query($listQuery);
    $optionList = "SELECT * FROM queryoptions"
    ?>
    <link rel="icon" href="resources/ibm-cloud.png">
    <meta charset="UTF-8" />
    <!-- Mobile first -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Bootstrap -->
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
      integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
      crossorigin="anonymous"
    />
    <!-- Mobile stylesheet -->
    <link rel="stylesheet" href="styles/mainStyles.css" />
    <!-- Desktop stylesheet -->
    <link
      rel="stylesheet"
      href="styles/mainStylesDesktop.css"
      media="only screen and (min-width:1200px)"
    />
    <!-- JQuery -->
    <script src="scripts/jquery-3.4.1.js"></script>
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <script
      src="https://kit.fontawesome.com/ae910a7907.js"
      crossorigin="anonymous"
    ></script>
    <title>Conference Concierge</title>
  </head>

  <body>
    <div id="sidebar" class="sidebarClose" style="z-index: 1030;">
      <a href="#/" id="sidebarButton" class="fas fa-angle-double-left"></a>
      <div id="sidebarContent">
        <h2>Search History</h2>
        <div id="searchHistory"></div>
      </div>
    </div>

    <div
      class="container border-primary mt-5 mb-4"
      id="mainPageTitle"
      style="border-left:3px solid;"
    >
      <h2 class="display-3">Conference Concierge</h2>
      <h4 class="text-muted display-5">
        For querying tech conferences. Powered by Watson on the IBM cloud.
      </h4>
    </div>
    <div class="container-lg border-primary" id="option-container">
      <div class="form-group">
        <label for="sel1">Select A Conference:</label>
        <select class="form-control" id="confSelection">
          <?php
            while($row = $stmt->fetchObject()) {
              echo "<option value=\"$row->collection_id\">$row->conference_name</option>";
            }
            ?>
        </select>
      </div>
      <div class="form-group">
        <label for="customQuerySearch">Add Your Conference Interests:</label>
        <div class="input-group" id="custom-search-container">
          <input
            type="text"
            class="form-control"
            placeholder="Custom search..."
            id="customQuerySearch"
          />
          <div class="input-group-append">
            <button
              type="button"
              class="btn btn-success px-4"
              id="customQueryBtn"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
        <div id="optionList" class="row border-bottom border-primary">
        </div>
        
    </div>
    </div>
  <div class="container sticky-top bg-white p-1 border-bottom border-light" id="optionListContainer">
        <div class="container" id="queryOptionList">
            <p class="text-secondary">Start adding queries by clicking above...</p>
        </div>
    <div
      class="container d-flex flex-row-reverse mb-3"
      id="searchQueryBtnContainer"
    >
      
      <button type="button" class="btn btn-success p-2 ml-1" id="searchQueryBtn" disabled>
        <i class="fas fa-search mr-2"></i>Search
      </button>

      <button type="button" class="btn btn-danger p-2" id="clearQueryBtn" style="display:none">
        <i class="fas fa-times mr-2"></i>Clear
      </button>

    </div>
  </div >
    <div id="queryResultsContainer" class="container b-bottom-1 b-bottom b-bottom-light">
        
    </div>
    <div id="saveContainer" class="container">

    </div>
    <script src="scripts/main.js"></script>
  </body>
</html>
