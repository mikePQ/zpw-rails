var TicketBuyForm = /** @class */ (function () {
    function TicketBuyForm(validator) {
        this.validator = validator;
        TicketBuyForm.initializeConfirmBuyButton(this);
    }
    TicketBuyForm.initializeConfirmBuyButton = function (ticketBuyForm) {
        var confirmBuyButton = document.getElementsByClassName('confirm-buy-button')[0];
        if (!confirmBuyButton) {
            return;
        }
        var url = new URL(window.location.href);
        var eventId = url.searchParams.get("event_id");
        var seatIds = url.searchParams.getAll("seat_ids[]");
        console.log(confirmBuyButton);
        confirmBuyButton.addEventListener('click', function (event) {
            event.stopPropagation();
            ticketBuyForm.submitForm(eventId, seatIds);
        }, true);
    };
    TicketBuyForm.prototype.submitForm = function (eventId, seatsIds) {
        var form = document.forms.namedItem("buy-form");
        console.log(form);
        if (!validator.validate(form)) {
            alert(validator.messages[0]);
            return;
        }
        var name = getInputValue(form, "name");
        var email = getInputValue(form, "email");
        var phone = getInputValue(form, "phone");
        var address = getTextAreaValue(form, "address");
        var token = document.head.querySelector('meta[name="csrf-token"').getAttribute("content");
        var data = new FormData();
        data.append("name", name);
        data.append("email", email);
        data.append("phone", phone);
        data.append("address", address);
        data.append("event_id", eventId);
        seatsIds.forEach(function (seatId) {
            data.append("seat_ids[]", seatId);
        });
        var request = new XMLHttpRequest();
        request.open('POST', '/buy', true);
        request.setRequestHeader('X-CSRF-Token', token);
        request.send(data);
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 204) {
                window.location.href = "/tickets";
            }
        };
        request.onerror = function (error) {
            alert(error.message);
        };
    };
    return TicketBuyForm;
}());
function getInputValue(form, elementName) {
    return form.elements.namedItem(elementName).value;
}
function getTextAreaValue(form, elementName) {
    return form.elements.namedItem(elementName).value;
}
function getUserBalance() {
    var element = document.getElementsByClassName("user-balance")[0];
    return Number(element.textContent.replace(/\s+/g, ''));
}
function getTotalPrice() {
    var element = document.getElementsByClassName("total-price")[0];
    return Number(element.textContent.replace(/\s+/g, ''));
}
var FormValidator = /** @class */ (function () {
    function FormValidator() {
        this.messages = [];
    }
    FormValidator.prototype.validate = function (form) {
        this.messages = [];
        if (getUserBalance() < getTotalPrice()) {
            this.messages.push("Zbyt mała liczba środków na koncie");
            return false;
        }
        return true; //TODO implement
    };
    return FormValidator;
}());
var validator = new FormValidator();
var form = new TicketBuyForm(validator);
//# sourceMappingURL=ticket.js.map