class Seat {
    isSelected: boolean = false;
    isAvailable: boolean;

    constructor(private htmlElement: Element,
                public id: string) {

        this.addClickHandler();
        this.isAvailable = Seat.isAvailable(htmlElement);
    }

    private addClickHandler() {
        if (!this.htmlElement) {
            return;
        }

        this.htmlElement.addEventListener("click", () => {
            if (!this.isSelected && !seatsManager.canSelect(this)) {
                if (this.isAvailable) {
                    alert("Nie można wybrać więcej niż 5 miejsc");
                }
                return;
            }

            this.isSelected = !this.isSelected;
            if (this.isSelected) {
                this.addClass('selected');
            } else {
                this.removeClass('selected');
            }
        });
    }

    private addClass(className: string) {
        this.htmlElement.classList.add(className);
    }

    private removeClass(className: string) {
        this.htmlElement.classList.remove(className);
    }

    static isAvailable(button: Element): boolean {
        return button.classList.contains('btn-success');
    }

    static initializeSeats(): Array<Seat> {
        let result: Array<Seat> = [];
        let seatButtons = document.getElementsByClassName('seat-button');
        for (let i = 0; i < seatButtons.length; i++) {
            let seatButton = seatButtons.item(i);
            if (seatButton) {
                let seatId = Seat.getSeatId(seatButton);
                if (!seatId) {
                    continue;
                }

                result.push(new Seat(seatButton, seatId));
            }
        }

        return result;
    }

    static getSeatId(button: Element): string {
        if (!button) {
            return null;
        }

        let child = button.firstChild;
        if (!child) {
            return null;
        }

        return child.textContent.replace(/\s+/g, '')
    }
}

class SeatsManager {
    seats: Array<Seat> = Seat.initializeSeats();

    getSelected(): Array<Seat> {
        return this.seats.filter(seat => seat.isSelected);
    }

    canSelect(seat: Seat): boolean {
        return this.getSelected().length < 5 && seat.isAvailable;
    }
}

class TicketManager {
    constructor(private seatsManager: SeatsManager) {
        TicketManager.initializeBuyButton(this);
    }

    goToBuyForm() {
        let selectedSeats = this.seatsManager.getSelected();
        if (selectedSeats.length < 1) {
            return;
        }

        let requestBuilder = new BuyRequestBuilder();
        window.location.href = requestBuilder.buildRequest(selectedSeats);
    }

    static initializeBuyButton(ticketsManager: TicketManager) {
        let buyButton = document.getElementsByClassName('buy-button')[0];
        if (!buyButton) {
            return;
        }

        buyButton.addEventListener('click', () => {
            ticketsManager.goToBuyForm();
        });
    }

    static getEventId(): string {
        let pathname = window.location.pathname;
        let elements = pathname.split("/");

        return elements[elements.length - 1];
    }
}

class BuyRequestBuilder {

    buildRequest(selectedSeats: Array<Seat>): string {
        let eventId = TicketManager.getEventId();
        return `/buy?event_id=${eventId}${this.buildSeatsParameters(selectedSeats)}`;
    }

    private buildSeatsParameters(seats: Array<Seat>): string {
        let parametersString = "";
        seats.forEach(seat => {
            console.log(seat.id);
            parametersString += `&seat_ids[]=${seat.id}`;
        });

        return parametersString;
    }
}

let seatsManager = new SeatsManager();
let ticketManager = new TicketManager(seatsManager);

console.log(TicketManager.getEventId());


