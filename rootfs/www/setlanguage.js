function setlanguage(){
var vervaldatum = new Date()
vervaldatum.setDate(vervaldatum.getDate()+365);
var setlang = document.form.site.options[document.form.site.selectedIndex].value;
document.cookie="language="+setlang+";expires="+vervaldatum+"; path=/";
window.location.href = "index.html";
}