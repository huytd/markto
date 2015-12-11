var marked = require('./marked.js');
var fs = require('fs');
var $ = function(query) { return document.querySelector(query); };

var isCmd = false;
var currentEditMode = false;
var checkData = {};

hljs.initHighlightingOnLoad();
marked.setOptions({
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

function codeHighlight(value) {
    var codeHighlight = hljs.highlight('markdown', value);
    $(".editor-output").innerHTML = codeHighlight.value;
}

$('#editor').addEventListener('scroll', function(){
    $('.editor-output').scrollTop = $('#editor').scrollTop;
});

$('#editor').addEventListener('input', function(e){
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    var newChar = String.fromCharCode(charCode);
    codeHighlight($('#editor').value + newChar);
}, false);

function save(noDisplayIndicator) {
    fs.writeFile(__dirname + '/saved.md', $('#editor').value, function(err){ });
    if (!noDisplayIndicator) {
        $("#saver").classList.add('anim');
        setTimeout(function(){
            $("#saver").classList.remove('anim');
        }, 1000);
    }
}

function load() {
    fs.readFile(__dirname + '/saved.md', 'utf-8', function(err, content){
        if (!err) {
            console.log('loaded');
            if (content.length > 0) {
                $('#editor').value = content;
                $('#preview').innerHTML = marked($('#editor').value);
                codeHighlight($('#editor').value);
            }
        } else {
            console.log(err);
        }
    });
}

function enableTab(id) {
    var el = document.getElementById(id);
    el.onkeydown = function(e) {
        if (e.keyCode === 9) { // tab was pressed

            // get caret position/selection
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            return false;

        }
    };
}

function check(e, yes) {
    var pos = e.getAttribute('index');
    var editor = $('#editor');

    if (e.classList.contains('done')) {
        e.classList.remove('done');
        e.classList.add('undone');
        var arr = editor.value.split('');
        arr[pos] = '-';
        editor.value = arr.join('');
    }
    else if (e.classList.contains('undone')) {
        e.classList.remove('undone');
        e.classList.add('done');
        var arr = editor.value.split('');
        arr[pos] = '+';
        editor.value = arr.join('');
    }

    save(true);
    console.log($('#editor').value);
}

function previewMode() {
    $('#preview').innerHTML = marked($('#editor').value);
    setTimeout(function(){
        var liList = document.querySelectorAll("li");
        for (var i = 0; i < liList.length; i++) {
            liList[i].addEventListener('click', function(e){
                var item = e.target;
                check(item);
            });
        }
    }, 300);
    $('#btnPreview').style.display = 'none';
    $('#editor-panel').style.display = 'none';
    $('#btnEdit').style.display = 'block';
    $('#preview').style.display = 'block';
    currentEditMode = false;
}

function editMode() {
    $('#btnEdit').style.display = 'none';
    $('#btnPreview').style.display = 'block';
    $('#preview').style.display = 'none';
    $('#editor-panel').style.display = 'block';
    currentEditMode = true;
    codeHighlight($('#editor').value);
    $('#editor').focus();
}

$('#btnPreview').addEventListener('click', function(){
    previewMode();
});

$('#btnEdit').addEventListener('click', function(){
    editMode();
});

$('#editor').addEventListener('keyup', function(e){
    isCmd = false;
});

document.addEventListener('keydown', function(e){
    if (e.keyCode >= 65 && e.keyCode <= 90) {
    var shortcut = (e.metaKey ? '⌘-' : '') + String.fromCharCode(e.keyCode).toUpperCase();
    if (shortcut == '⌘-E') {
        if (currentEditMode) previewMode();
        else editMode();
    }
    if (shortcut == '⌘-S') {
        save();
    }
  }
});

load();
enableTab('editor');
previewMode();

/* syntax highlight */
