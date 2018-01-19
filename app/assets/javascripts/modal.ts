function displayModal(header: string, body: string) {
    let modal = document.getElementsByClassName('.modal')[0];
    if (!modal) {
        return;
    }

    let modalBody = document.getElementsByClassName('.modal-body')[0];
    let modalHeading = document.getElementsByClassName('.modal-heading')[0];

    modalHeading.innerHTML = header;
    modalBody.innerHTML = body;
    (<any>modal).modal();
}