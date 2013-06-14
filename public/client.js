var boards = [];
var carouselOption = { interval : false };

$(function() {
  //initialize
  createBoard('first');
  $('#carousel').carousel('next');

  // tag resize
  $('.tag').resizable();

  // tag move
  $('.tag').draggable();

  // create board
  $('#create-board').submit(function() {
    createBoard($('#boardname').val());
    $('#boardname').val('');
    return false;
  });

  //delete board
  $('#delete-board').click(deleteBoard);

  // create board
  function createBoard(name) {
    var id;
    if (boards.length == 0) {
      id = 0;
    } else {
      id = boards[boards.length - 1].id + 1;
    }

    boards.push({id:id, name:name});

    $('#carousel .carousel-indicators').append($('<li>').attr('data-target', '#carousel').attr('data-slide-to', boards.length - 1));
    $('#carousel .carousel-inner').append('<div id="board-' + id + '" class="item"><canvas class="canvas"></canvas><div class="carousel-caption pull-top"><h4>' + name + '</h4></div></div>');

    $('#carousel').carousel(carouselOption);
  }

  //delete board
  function deleteBoard() {
    if (boards.length == 1) {
      return;
    }
    var id = $('#carousel .item.active').attr('id').replace(/board\-/, '');

    for (key in boards) {
      if (boards[key].id == id) {
        boards.splice(key, 1);
      }
    }
    $('#carousel .item.active').remove();
    $('#carousel .carousel-indicators li:last').remove();

    $('#carousel').carousel(carouselOption);
    $('#carousel').carousel('next');
  }

});
