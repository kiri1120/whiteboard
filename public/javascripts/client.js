var boards = [];
var carouselOption = { interval : false };
var defaultTag = {
  position: 'absolute',
  width: 160,
  height: 160
};

$(function() {
  //initialize
  createBoard('first');
  $('#carousel').carousel('next');

  // create board
  $('#create-board').submit(function() {
    createBoard($('#boardname').val());
    $('#boardname').val('');
    return false;
  });

  // delete board
  $('#delete-board').click(deleteBoard);

  // rename board
  $('#rename-board').click(function() {
    renameBoard($('#boardname').val());
    $('#boardname').val('');
  });

  //----------------------- functions -----------------------
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

    // create tag
    $('#carousel canvas').click(function(event) {
      createTag(event.pageX, event.pageY - 60);
    });
  }

  // delete board
  function deleteBoard() {
    if (boards.length == 1) {
      return;
    }
    var id = getActiveBoardId();
    for (i=0; i<boards.length; i++) {
      if (boards[i].id == id) {
        boards.splice(i, 1);
      }
    }
    $('#carousel').hide('slow');
    $('#carousel .item.active').remove();
    $('#carousel .carousel-indicators li:last').remove();

    $('#carousel').carousel(carouselOption);
    $('#carousel').carousel('next');
    $('#carousel').show('slow');
    console.log(JSON.stringify(boards));
  }

  // rename board
  function renameBoard(name) {
    var id = getActiveBoardId();
    for (i=0; i<boards.length; i++) {
      if (boards[i].id == id) {
        boards[i].name = name;
      }
    }
    $('#carousel .item.active h4').text(name);
  }

  function getActiveBoardId() {
    return $('#carousel .item.active').attr('id').replace(/board\-/, '');
  }
  
  function createTag(x, y) {
    var id = getActiveBoardId();
    var tagOption = defaultTag;
    tagOption.left = x;
    tagOption.top = y;
    $('#board-' + id).append(
      $('<div>').addClass('tag alert alert-error').css(tagOption).append(
        '<h4>kiri</h4><p>message</p><div class="message hide"><input type="text"><button class="btn btn-primary">send</button><button class="btn">cancel</button></div>'
      )
    );
    $('.tag').resizable();
    $('.tag').draggable();
    $('.tag').hover(
      function () {
        $('.message').show();
      },
      function () {
        $('.message').hide();
      }
    );
  }
});
