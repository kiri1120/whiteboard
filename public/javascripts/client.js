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

  // get cookies
  var cookies = getCookies();

  // 初期化
  socket.on('initStart', function(){
    $('#carousel .carousel-indicators').empty();
    $('#carousel .carousel-inner').empty();
    $('#carousel .tag').remove();

    socket.emit('session', cookies.session);
  });

  // 初期化完了
  socket.on('initEnd', function() {
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

  // 付箋削除
  socket.on('deleteTag', function(data) {
    deleteTag(data);
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
    var html = $('<div>').attr('id', 'board-' + board.id).addClass('item');
    var canvas = $('<canvas>').addClass('canvas').click(function(event) {
      var data = {
        BoardId   : board.id,
        position_x: event.pageX,
        position_y: event.pageY - 60
      }
      socket.emit('createTag', data);
    });
    var caption = $('<div>').addClass('carousel-caption pull-top').append($('<h4>').text(board.name));
    var indicator = $('<li>').attr('data-target', '#carousel').attr('data-slide-to', boardsCount);
    if (boardsCount == 0) {
      html.addClass('active');
      indicator.addClass('active');
    } else {
      $('#carousel .carousel-control').show();
    }

    html.append(canvas);
    html.append(caption);

    $('#carousel .carousel-inner').append(html);
    $('#carousel .carousel-indicators').append(indicator);

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

    boardsCount--;

    if (boardsCount == 1) {
      $('#carousel .carousel-control').hide();
    }
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

    $('#board-' + tag.BoardId).append(taghtml);
    taghtml.attr('id', 'tag-' + tag.id);
    taghtml.css(css);
    taghtml.show();

    taghtml.resizable({ stop : function() {
      changeTag(taghtml);
    }});
    taghtml.draggable({ stop : function() {
      changeTag(taghtml);
    }});

    taghtml.find('.close').click(function() {
      closeTag(taghtml);
    });

/*
    taghtml.find('.colorSelector').ColorPicker({
      color: tag.background_color,
      onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
      },
      onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        return false;
      },
      onChange: function (hsb, hex, rgb) {
        taghtml.css('backgroundColor', '#' + hex);
      }
    });
*/
  }

  // change tag event
  function changeTag(taghtml) {
    var data = {
      id          : getTagId(taghtml),
      size_x      : taghtml.css('width'),
      size_y      : taghtml.css('height'),
      position_x  : taghtml.css('left'),
      position_y  : taghtml.css('top'),
    };
    socket.emit('changeTag', data);
  }

  // close tag event
  function closeTag(tag) {
    socket.emit('closeTag', getTagId(tag));
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

  // delete tag
  function deleteTag(id) {
    $('#tag-' + id).remove();
  }

  // get tag.id
  function getTagId(taghtml) {
    return taghtml.attr('id').replace(/tag\-/, '');
  }

  // show error message
  function errorShow(error) {
    $('#error-body').text(error);
    $('#error').modal('show');
  }

  function getCookies() {
    var result = {};
    var allcookies = document.cookie;

    if (allcookies != '') {
      var cookies = allcookies.split(';');

      for(var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split( '=' );
        result[cookie[0]] = decodeURIComponent(cookie[1]);
      }
    }

    return result;
  }
});
