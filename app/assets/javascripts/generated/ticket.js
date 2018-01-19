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
        var valid = validator.validate(form);
        this.showValidationErrors(validator.messages);
        if (!valid) {
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
    TicketBuyForm.prototype.showValidationErrors = function (errors) {
        var errorsContainer = document.getElementsByClassName('validation-errors')[0];
        if (!errorsContainer) {
            return;
        }
        errorsContainer.classList.remove('alert');
        errorsContainer.classList.remove('alert-danger');
        errorsContainer.innerHTML = "";
        if (errors.length === 0) {
            return;
        }
        errorsContainer.classList.add('alert');
        errorsContainer.classList.add('alert-danger');
        var innerHtml = "<strong>Formularz zawiera błędy:</strong><br><ul>";
        errors.forEach(function (error) {
            innerHtml += "<li>" + error + "</li>";
        });
        innerHtml += "</ul>";
        errorsContainer.innerHTML = innerHtml;
    };
    return TicketBuyForm;
}());
function getInputValue(form, elementName) {
    return form.elements.namedItem(elementName).value;
}
function getTextAreaValue(form, elementName) {
    return form.elements.namedItem(elementName).value;
}
function getCheckboxValue(form, elementName) {
    return form.elements.namedItem(elementName).checked;
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
        this.validateAdultCheckbox(form);
        this.validateNameLength(form);
        this.validateEmail(form);
        this.validateAddress(form);
        this.validatePhone(form);
        return this.messages.length === 0;
    };
    FormValidator.prototype.validateAdultCheckbox = function (form) {
        var adultCheckbox = form.elements.namedItem("adult");
        if (!adultCheckbox) {
            return true;
        }
        var value = getCheckboxValue(form, "adult");
        if (!value) {
            this.messages.push("Potwierdzenie pełnoletności jest wymagane do zakupu biletu na to wydarzenie");
        }
    };
    FormValidator.prototype.validateNameLength = function (form) {
        var value = getInputValue(form, "name");
        if (value.length < 5) {
            this.messages.push("Imię i nazwisko nie może być krótsze niż 5 znaków");
        }
    };
    FormValidator.prototype.validateEmail = function (form) {
        var email = getInputValue(form, "email");
        var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        if (email.length < 5) {
            this.messages.push("Email nie może być krótszy niż 5 znaków");
        }
        if (!pattern.test(email)) {
            this.messages.push("Niepoprawny email");
        }
    };
    FormValidator.prototype.validatePhone = function (form) {
        var value = getInputValue(form, "phone");
        if (value.length != 9) {
            this.messages.push("Numer telefonu powinien zawierać 9 znaków");
        }
        if (!value.match(/\d/g)) {
            this.messages.push("Niepoprawny numer telefonu");
        }
    };
    FormValidator.prototype.validateAddress = function (form) {
        var value = getInputValue(form, "address");
        if (value.length < 10) {
            this.messages.push("Adres nie może być krótszy niż 10 znaków");
        }
    };
    return FormValidator;
}());
var validator = new FormValidator();
var form = new TicketBuyForm(validator);
//# sourceMappingURL=ticket.js.map