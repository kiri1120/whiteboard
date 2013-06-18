// initialize 
var boardsCount = 0;

// options
var uri = "http://" + location.hostname + ":3000/";
var carouselOption = { interval : false };

$(function() {
  // socket.io initialize
  var socket = io.connect(uri);

  // 初期化
  socket.on('initStart', function(){
    $('#carousel .carousel-indicators').empty();
    $('#carousel .carousel-inner').empty();
    $('.tag').remove();
  });

  // 初期化完了
  socket.on('initEnd', function() {
    $('#carousel').carousel('next');
  });

  // ホワイトボード作成
  socket.on('createBoard', function(data) {
    createBoard(data);
  });

  // ホワイトボード削除
  socket.on('deleteBoard', function(data) {
    deleteBoard(data);
  });

  // ホワイトボード名変更
  socket.on('renameBoard', function(data) {
    renameBoard(data);
  });

  // エラー通知
  socket.on('error', function(error){
    errorShow(error);
  });

  // create board event
  $('#create-board').submit(function() {
    socket.emit('createBoard', $('#boardname').val());
    $('#boardname').val('');
    return false;
  });

  // delete board
  $('#delete-board').click(function() {
    socket.emit('deleteBoard', getActiveBoardId());
  });

  // rename board
  $('#rename-board').click(function() {
    var data = {
      id    : getActiveBoardId(),
      name  : $('#boardname').val(),
    }
    socket.emit('renameBoard', data);
    $('#boardname').val('');
  });

  //----------------------- functions -----------------------
  // create board
  function createBoard(board) {
    $('#carousel .carousel-indicators').append($('<li>').attr('data-target', '#carousel').attr('data-slide-to', boardsCount));
    $('#carousel .carousel-inner').append('<div id="board-' + board.id + '" class="item"><canvas class="canvas"></canvas><div class="carousel-caption pull-top"><h4>' + board.name + '</h4></div></div>');
    $('#carousel').carousel(carouselOption);

    // create tag event
    $('#carousel canvas').dblclick(function(event) {
      event.preventDefault();
      var data = {
        position_x: event.pageX,
        position_y: event.pageY - 60
      }
      socket.emit('createTag', data);
      return false;
    });

    boardsCount++;
  }

  // delete board
  function deleteBoard(id) {
    if (id == getActiveBoardId()) {
      $('#carousel').hide('slow');
      $('#carousel').carousel('next');
      $('#carousel').show('slow');
    }
    $('#carousel .carousel-indicators li:last').remove();
    $('#board-' + id).remove();

    $('#carousel').carousel(carouselOption);
  }

  // rename board
  function renameBoard(board) {
    $('#board-' + board.id + ' h4').text(board.name);
  }

  function getActiveBoardId() {
    return $('#carousel .item.active').attr('id').replace(/board\-/, '');
  }
  
  function createTag(x, y) {
/*
    var id = getActiveBoardId();
    var tagOption = defaultTag;
    tagOption.left = x;
    tagOption.top = y;
    $('#board-' + id).append();
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
*/
  }

  function errorShow(error) {
    $('#error-body').text(error);
    $('#error').modal('show');
  }

});
