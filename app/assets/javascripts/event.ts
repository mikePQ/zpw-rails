class Seat {
    isSelected: boolean = false;
    isAvailable: boolean;

    constructor(private htmlElement: Element,
                private id: string) {

        this.addClickHandler();
        this.isAvailable = Seat.isAvailable(htmlElement);
    }

    private addClickHandler() {
        if (!this.htmlElement) {
            return;
        }

        this.htmlElement.addEventListener("click", () => {
            if (!this.isSelected && !manager.canSelect(this)) {
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
        console.log(seatButtons.length);
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

        return child.textContent
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

let manager = new SeatsManager();

