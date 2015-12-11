var marked = require('./marked.js');
var fs = require('fs');
var isCmd = false;
var currentEditMode = false;
var checkData = {};

hljs.initHighlightingOnLoad();
marked.setOptions({
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

function save() {
    fs.writeFile(__dirname + '/saved.md', document.getElementById('editor').value, function(err){ });
    document.getElementById("saver").classList.add('anim');
    setTimeout(function(){
        document.getElementById("saver").classList.remove('anim');
    }, 1000);
}

function load() {
    fs.readFile(__dirname + '/saved.md', 'utf-8', function(err, content){
        if (!err) {
            console.log('loaded');
            if (content.length > 0) {
                document.getElementById('editor').value = content;
                document.getElementById('preview').innerHTML = marked(document.getElementById('editor').value);
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
    var editor = document.querySelector('#editor');

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

    console.log(document.getElementById('editor').value);
}

function previewMode() {
    document.getElementById('preview').innerHTML = marked(document.getElementById('editor').value);
    setTimeout(function(){
        var liList = document.querySelectorAll("li");
        for (var i = 0; i < liList.length; i++) {
            liList[i].addEventListener('click', function(e){
                var item = e.target;
                check(item);
            });
        }
    }, 300);
    document.getElementById('btnPreview').style.display = 'none';
    document.getElementById('editor-panel').style.display = 'none';
    document.getElementById('btnEdit').style.display = 'block';
    document.getElementById('preview').style.display = 'block';
    currentEditMode = false;
}

function editMode() {
    document.getElementById('btnEdit').style.display = 'none';
    document.getElementById('btnPreview').style.display = 'block';
    document.getElementById('preview').style.display = 'none';
    document.getElementById('editor-panel').style.display = 'block';
    currentEditMode = true;
}

document.getElementById('btnPreview').addEventListener('click', function(){
    previewMode();
});

document.getElementById('btnEdit').addEventListener('click', function(){
    editMode();
});

document.getElementById('editor').addEventListener('keyup', function(e){
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
