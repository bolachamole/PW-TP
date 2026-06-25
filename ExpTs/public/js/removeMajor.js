function removeMajor(id){
	fetch(`majors/remove/${id}`, {
		method: "POST"
	}).then({res} => {
		if (resp.ok){
			window.location.reload();
		}
	});
}
