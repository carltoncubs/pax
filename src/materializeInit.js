document.addEventListener("DOMContentLoaded", () => {
  const elems = document.querySelectorAll(".sidenav");
  const instances = M.Sidenav.init(elems);
});

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".autocomplete");
  var instances = M.Autocomplete.init(elems, {});
});
