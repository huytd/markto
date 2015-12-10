var marked = require('marked');
var fs = require('fs');
var isCmd = false;
var currentEditMode = false;

function save() {
    fs.writeFile('./saved.md', document.getElementById('editor').value, function(err){ });
    document.getElementById("saver").classList.add('anim');
    setTimeout(function(){
        document.getElementById("saver").classList.remove('anim');
    }, 1000);
}

function load() {
    fs.readFile('./saved.md', 'utf-8', function(err, content){
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

function previewMode() {
    document.getElementById('preview').innerHTML = marked(document.getElementById('editor').value);
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
