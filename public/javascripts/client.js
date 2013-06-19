// initialize 
var boardsCount = 0;

// options
var uri = "http://" + location.hostname + ":3000/";
var carouselOption = { interval : false };

$(function() {
  // 付箋のテンプレート初期化
  $('#tagreference').hover(
    function () {
      $(this).find('.message').show();
    },
    function () {
      $(this).find('.message').hide();
    }
  );

  // socket.io initialize
  var socket = io.connect(uri);

  // 初期化
  socket.on('initStart', function(){
    $('#carousel .carousel-indicators').empty();
    $('#carousel .carousel-inner').empty();
    $('#carousel .tag').remove();
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

  // 付箋貼付
  socket.on('createTag', function(data) {
    createTag(data);
  });

  // 付箋更新
  socket.on('updateTag', function(data) {
    updateTag(data);
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
    $('#carousel canvas').click(function(event) {
      var data = {
        board_id : getActiveBoardId(),
        position_x: event.pageX,
        position_y: event.pageY - 60
      }
      socket.emit('createTag', data);
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

  // create tag
  function createTag(tag) {
    var taghtml = $('#tagreference').clone(true);
    var css = {
      color           : tag.color,
      backgroundColor : tag.background_color,
      left            : tag.position_x,
      top             : tag.position_y,
      width           : tag.size_x,
      height          : tag.size_y,
    };

    $('#board-' + tag.board_id).append(taghtml);
    taghtml.attr('id', 'tag-' + tag.id);
    taghtml.css(css);
    taghtml.show();

    taghtml.resizable({ stop : function() {
      changeTag(taghtml);
    }});
    taghtml.draggable({ stop : function() {
      changeTag(taghtml);
    }});

  }

  // change tag event
  function changeTag(taghtml) {
    var data = {
      id          : taghtml.attr('id').replace(/tag\-/, ''),
      size_x      : taghtml.css('width'),
      size_y      : taghtml.css('height'),
      position_x  : taghtml.css('left'),
      position_y  : taghtml.css('top'),
    };
    socket.emit('changeTag', data);
  }

  // update tag
  function updateTag(tag) {
    var css = {
      color           : tag.color,
      backgroundColor : tag.background_color,
      left            : tag.position_x,
      top             : tag.position_y,
      width           : tag.size_x,
      height          : tag.size_y,
    };
    $('#tag-' + tag.id).css(css);
  }

  // show error message
  function errorShow(error) {
    $('#error-body').text(error);
    $('#error').modal('show');
  }

});
