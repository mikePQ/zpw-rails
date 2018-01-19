function displayModal(header, body) {
    var modal = document.getElementsByClassName('.modal')[0];
    if (!modal) {
        return;
    }
    var modalBody = document.getElementsByClassName('.modal-body')[0];
    var modalHeading = document.getElementsByClassName('.modal-heading')[0];
    modalHeading.innerHTML = header;
    modalBody.innerHTML = body;
    modal.modal();
}
//# sourceMappingURL=modal.js.map