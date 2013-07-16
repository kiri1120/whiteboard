// initialize 
var boardsCount = 0;
var isInitializing = false;

// options
var uri = "http://" + location.hostname + ":3000/";
var messageformHeight = 100;

$(function() {
  // socket.io initialize
  var socket = io.connect(uri);

  // get cookies
  var cookies = getCookies();

  // 初期化
  socket.on('initStart', function(){
    isInitializing = true;
    boardsCount = 0;
    $('#carousel .carousel-indicators').empty();
    $('#carousel .carousel-inner').empty();
    $('#carousel .tag').remove();

    socket.emit('session', cookies.session);
  });

  socket.on('initEnd', function() {
    isInitializing = false;
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
    createTag(data.tag, data.user);
  });

  // 付箋更新
  socket.on('updateTag', function(data) {
    updateTag(data);
  });

  // 付箋削除
  socket.on('deleteTag', function(data) {
    deleteTag(data);
  });

  // メッセージ表示
  socket.on('showMessage', function(data) {
    showMessage(data.user, data.message);
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
      var offset = $(this).offset();
      var data = {
        BoardId : board.id,
        left    : event.pageX - offset.left,
        top     : event.pageY - offset.top,
      }
      socket.emit('createTag', data);
    });
    var caption = $('<div>').addClass('carousel-caption pull-top').append($('<h4>').html(board.name));
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

    if (isInitializing == false) {
      var alerthtml = $('#alertreference').clone(true);
      alerthtml.removeAttr('id');
      alerthtml.addClass('alert-info');
      alerthtml.find('.alert-message').html('ボード（' + board.name + '）が新規作成されました。');
      $('#alerts').append(alerthtml);
      alerthtml.show();
    }

    boardsCount++;
  }

  // delete board
  function deleteBoard(board) {
    if (board.id == getActiveBoardId()) {
      $('#carousel').carousel('next');
      $('#carousel').carousel('pause');
    }

    $('#carousel .carousel-indicators li:last').remove();
    $('#board-' + board.id).remove();

    boardsCount--;

    if (boardsCount == 1) {
      $('#carousel .carousel-control').hide();
    }

    var alerthtml = $('#alertreference').clone(true);
    alerthtml.removeAttr('id');
    alerthtml.addClass('alert-error');
    alerthtml.find('.alert-message').html('ボード（' + board.name + '）が削除されました。');
    $('#alerts').append(alerthtml);
    alerthtml.show();
  }

  // rename board
  function renameBoard(board) {
    $('#board-' + board.id + ' h4').html(board.name);
  }

  function getActiveBoardId() {
    return $('#carousel .item.active').attr('id').replace(/board\-/, '');
  }

  // create tag
  function createTag(tag, user) {
    var html = $('#tagreference').clone(true);
    var css = {
      color           : tag.color,
      backgroundColor : tag.backgroundColor,
      left            : tag.left,
      top             : tag.top,
      width           : tag.width,
      height          : tag.height,
      zIndex          : tag.zIndex,
    };

    $('#board-' + tag.BoardId).append(html);
    html.attr('id', 'tag-' + tag.id);
    html.css(css);

    // 付箋タイトル部分
    html.find('.tagid').html(tag.id);
    html.find('.taguser').html(user.nickname);

    html.find('.messages').css({
      width : tag.width,
      height : tag.height - messageformHeight,
    });

    // リサイズ
    html.resizable({ stop : function() {
      changeTag(html);
    }});

    // 移動
    html.draggable({ handle : '.dragarea', containment: 'parent', stop : function() {
      changeTag(html);
    }});

    // 付箋をはがす
    html.find('.close').click(function() {
      closeTag(html);
    });

    // 付箋に書き込む
    html.find('.messageform').submit(function() {
      commitMessage(html);
      return false;
    });

    // 背景色
    var backCS = html.find('input[name=back-colorselector]');
    backCS.val(css.backgroundColor);
    backCS.change(function() {
      html.css('background-color', backCS.val());
      changeTag(html);
    });

    // 文字色
    var textCS = html.find('input[name=text-colorselector]');
    textCS.val(css.color);
    textCS.change(function() {
      html.css('color', textCS.val());
      changeTag(html);
    });

    // 表に移動
    html.find('.zindex-up').tooltip({ title : '最前面に移動' }).click(function() {
      socket.emit('upZIndexTag', getTagId(html));
    });

    // ページ切り替えコントローラーを最前面に
    $('#carousel-control-left').css('z-index', tag.zIndex + 1);
    $('#carousel-control-right').css('z-index', tag.zIndex + 1);
    $('.carousel-caption h4').css('z-index', tag.zIndex + 1);
    $('.carousel-indicators').css('z-index', tag.zIndex + 2);

    html.show();
  }

  // change tag event
  function changeTag(html) {
    var data = {
      id              : getTagId(html),
      color           : rgbToHex(html.css('color')),
      backgroundColor : rgbToHex(html.css('background-color')),
      width           : html.css('width'),
      height          : html.css('height'),
      left            : html.css('left'),
      top             : html.css('top'),
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
      backgroundColor : tag.backgroundColor,
      left            : tag.left,
      top             : tag.top,
      width           : tag.width,
      height          : tag.height,
      zIndex          : tag.zIndex,
    };
    var html = $('#tag-' + tag.id);
    html.css(css);
    html.find('input[name=back-colorselector]').val(tag.backgroundColor);
    html.find('input[name=text-colorselector]').val(tag.color);

    html.find('.messages').css({
      width : tag.width,
      height : tag.height - messageformHeight,
    });

    // ページ切り替えコントローラーを最前面に
    $('#carousel-control-left').css('z-index', tag.zIndex + 1);
    $('#carousel-control-right').css('z-index', tag.zIndex + 1);
    $('.carousel-caption h4').css('z-index', tag.zIndex + 1);
    $('.carousel-indicators').css('z-index', tag.zIndex + 2);
  }

  // delete tag
  function deleteTag(id) {
    $('#tag-' + id).remove();
  }

  // get tag.id
  function getTagId(html) {
    return html.attr('id').replace(/tag\-/, '');
  }

  // commit message
  function commitMessage(html) {
    var msghtml = html.find('.messageform input[name=message]');
    socket.emit('commitMessage', { tagid : getTagId(html), message : msghtml.val() });
    msghtml.val('');
  }

  // show message
  function showMessage(user, message) {
    var taghtml = $('#tag-' + message.TagId);
    var html = $('<div>').addClass('message').append($('<p>').html('<strong>' + user.nickname + '</strong>＞' + message.message));
    var messages = taghtml.find('.messages');
    if (messages.scrollTop() == messages.prop('scrollHeight') - messages.height()) {
      messages.append(html);
      messages.scrollTop(messages.prop('scrollHeight') - messages.height());
    } else {
      messages.append(html);
    }
  }

  // show error message
  function errorShow(error) {
    $('#error-body').html(error);
    $('#error').modal('show');
  }

  // parse cookies
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

  function rgbToHex(rgb) {
    var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);  

    if (parts != null && parts.length == 4) {
      delete parts[0];  
      for (var i = 1; i <= 3; i++) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length == 1) {
          parts[i] = '0' + parts[i];
        }
      }
      return "#" + parts.join("");
    }
    return rgb;
  }
});
