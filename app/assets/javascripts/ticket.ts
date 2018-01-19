class TicketBuyForm {
    constructor(private validator: FormValidator) {
        TicketBuyForm.initializeConfirmBuyButton(this);
    }

    static initializeConfirmBuyButton(ticketBuyForm: TicketBuyForm) {
        let confirmBuyButton = document.getElementsByClassName('confirm-buy-button')[0];
        if (!confirmBuyButton) {
            return;
        }

        let url = new URL(window.location.href);
        let eventId = url.searchParams.get("event_id");
        let seatIds = url.searchParams.getAll("seat_ids[]");

        console.log(confirmBuyButton);
        confirmBuyButton.addEventListener('click', (event) => {
            event.stopPropagation();
            ticketBuyForm.submitForm(eventId, seatIds);
        }, true);
    }

    submitForm(eventId: string, seatsIds: string[]) {
        let form = document.forms.namedItem("buy-form");

        if (!validator.validate(form)) {
            alert(validator.messages[0]);
            return;
        }

        let name = getInputValue(form, "name");
        let email = getInputValue(form, "email");
        let phone = getInputValue(form, "phone");
        let address = getTextAreaValue(form, "address");

        let token = document.head.querySelector('meta[name="csrf-token"').getAttribute("content");

        let data = new FormData();
        data.append("name", name);
        data.append("email", email);
        data.append("phone", phone);
        data.append("address", address);
        data.append("event_id", eventId);

        seatsIds.forEach(seatId => {
            data.append("seat_ids[]", seatId);
        });

        let request = new XMLHttpRequest();
        request.open('POST', '/buy', true);
        request.setRequestHeader('X-CSRF-Token', token);
        request.send(data);

        request.onreadystatechange = () => {
            if (request.readyState == 4 && request.status == 204) {
                window.location.href = "/tickets";
            }
        };

        request.onerror = error => {
            alert(error.message);
        }
    }
}

function getInputValue(form: HTMLFormElement, elementName: string): string {
    return (<HTMLInputElement>form.elements.namedItem(elementName)).value;
}

function getTextAreaValue(form: HTMLFormElement, elementName: string): string {
    return (<HTMLTextAreaElement>form.elements.namedItem(elementName)).value;
}

function getCheckboxValue(form: HTMLFormElement, elementName: string): boolean {
    return (<HTMLInputElement>form.elements.namedItem(elementName)).checked;
}

function getUserBalance(): number {
    let element = document.getElementsByClassName("user-balance")[0];
    return Number(element.textContent.replace(/\s+/g, ''));
}

function getTotalPrice(): number {
    let element = document.getElementsByClassName("total-price")[0];
    return Number(element.textContent.replace(/\s+/g, ''));
}

class FormValidator {
    messages: Array<String> = [];

    validate(form: HTMLFormElement): boolean {
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
    }

    private validateAdultCheckbox(form: HTMLFormElement) {
        let adultCheckbox = form.elements.namedItem("adult");
        if (!adultCheckbox) {
            return true;
        }

        let value = getCheckboxValue(form, "adult");
        if (!value) {
            this.messages.push("Potwierdzenie pełnoletności jest wymagane do zakupu biletu na to wydarzenie");
        }
    }

    private validateNameLength(form: HTMLFormElement) {
        let value = getInputValue(form, "name");
        if (value.length < 5) {
            this.messages.push("Imię i nazwisko nie może być krótsze niż 5 znaków");
        }
    }

    private validateEmail(form: HTMLFormElement) {
        let email = getInputValue(form, "email");
        let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

        if (email.length < 5) {
            this.messages.push("Email nie może być krótszy niż 5 znaków");
        }

        if (!pattern.test(email)) {
            this.messages.push("Niepoprawny email");
        }
    }

    private validatePhone(form: HTMLFormElement) {
        let value = getInputValue(form, "phone");
        if (value.length != 9) {
            this.messages.push("Numer telefonu powinien zawierać 9 znaków");
        }

        if (!value.match(/\d/g)) {
            this.messages.push("Niepoprawny numer telefonu");
        }
    }

    private validateAddress(form: HTMLFormElement) {
        let value = getInputValue(form, "address");
        if (value.length < 10) {
            this.messages.push("Adres nie może być krótszy niż 10 znaków");
        }
    }
}

let validator = new FormValidator();
let form = new TicketBuyForm(validator);