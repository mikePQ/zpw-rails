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
        console.log(form);

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

        return true; //TODO implement
    }
}

let validator = new FormValidator();
let form = new TicketBuyForm(validator);