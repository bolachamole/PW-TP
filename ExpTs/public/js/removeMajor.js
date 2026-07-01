function removeMajor(id) {
  fetch(`/major/remove/${id}`, {
    method: "POST",
  }).then((res) => {
    if (res.ok) {
	    window.location.href = "/major";
    }
  });
}
