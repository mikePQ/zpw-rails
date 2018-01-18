var Seat = /** @class */ (function () {
    function Seat(htmlElement, id) {
        this.htmlElement = htmlElement;
        this.id = id;
        this.isSelected = false;
        this.addClickHandler();
        this.isAvailable = Seat.isAvailable(htmlElement);
    }
    Seat.prototype.addClickHandler = function () {
        var _this = this;
        if (!this.htmlElement) {
            return;
        }
        this.htmlElement.addEventListener("click", function () {
            if (!_this.isSelected && !seatsManager.canSelect(_this)) {
                if (_this.isAvailable) {
                    alert("Nie można wybrać więcej niż 5 miejsc");
                }
                return;
            }
            _this.isSelected = !_this.isSelected;
            if (_this.isSelected) {
                _this.addClass('selected');
            }
            else {
                _this.removeClass('selected');
            }
        });
    };
    Seat.prototype.addClass = function (className) {
        this.htmlElement.classList.add(className);
    };
    Seat.prototype.removeClass = function (className) {
        this.htmlElement.classList.remove(className);
    };
    Seat.isAvailable = function (button) {
        return button.classList.contains('btn-success');
    };
    Seat.initializeSeats = function () {
        var result = [];
        var seatButtons = document.getElementsByClassName('seat-button');
        for (var i = 0; i < seatButtons.length; i++) {
            var seatButton = seatButtons.item(i);
            if (seatButton) {
                var seatId = Seat.getSeatId(seatButton);
                if (!seatId) {
                    continue;
                }
                result.push(new Seat(seatButton, seatId));
            }
        }
        return result;
    };
    Seat.getSeatId = function (button) {
        if (!button) {
            return null;
        }
        var child = button.firstChild;
        if (!child) {
            return null;
        }
        return child.textContent.replace(/\s+/g, '');
    };
    return Seat;
}());
var SeatsManager = /** @class */ (function () {
    function SeatsManager() {
        this.seats = Seat.initializeSeats();
    }
    SeatsManager.prototype.getSelected = function () {
        return this.seats.filter(function (seat) { return seat.isSelected; });
    };
    SeatsManager.prototype.canSelect = function (seat) {
        return this.getSelected().length < 5 && seat.isAvailable;
    };
    return SeatsManager;
}());
var TicketManager = /** @class */ (function () {
    function TicketManager(seatsManager) {
        this.seatsManager = seatsManager;
        TicketManager.initializeBuyButton(this);
    }
    TicketManager.prototype.goToBuyForm = function () {
        var selectedSeats = this.seatsManager.getSelected();
        if (selectedSeats.length < 1) {
            return;
        }
        var requestBuilder = new BuyRequestBuilder();
        window.location.href = requestBuilder.buildRequest(selectedSeats);
    };
    TicketManager.initializeBuyButton = function (ticketsManager) {
        var buyButton = document.getElementsByClassName('buy-button')[0];
        if (!buyButton) {
            return;
        }
        buyButton.addEventListener('click', function () {
            ticketsManager.goToBuyForm();
        });
    };
    TicketManager.getEventId = function () {
        var pathname = window.location.pathname;
        var elements = pathname.split("/");
        return elements[elements.length - 1];
    };
    return TicketManager;
}());
var BuyRequestBuilder = /** @class */ (function () {
    function BuyRequestBuilder() {
    }
    BuyRequestBuilder.prototype.buildRequest = function (selectedSeats) {
        var eventId = TicketManager.getEventId();
        return "/buy?event_id=" + eventId + this.buildSeatsParameters(selectedSeats);
    };
    BuyRequestBuilder.prototype.buildSeatsParameters = function (seats) {
        var parametersString = "";
        seats.forEach(function (seat) {
            console.log(seat.id);
            parametersString += "&seat_ids[]=" + seat.id;
        });
        return parametersString;
    };
    return BuyRequestBuilder;
}());
var seatsManager = new SeatsManager();
var ticketManager = new TicketManager(seatsManager);
console.log(TicketManager.getEventId());
//# sourceMappingURL=event.js.map